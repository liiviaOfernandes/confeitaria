(() => {
  const { STORE_KEY, DEFAULT_STORE } = window.CONFEITTARIA;
  const AUTH_KEY = 'confeittaria_gestao_auth_v1';
  const USERNAME = 'confeittaria';
  const PASSWORD = '3782026';
  const clone = v => JSON.parse(JSON.stringify(v));
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const money = v => Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const esc = (value='') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
  const uid = () => `p_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
  const imgForAdmin = path => !path ? '../assets/logo.png' : (/^(data:|https?:|blob:)/.test(path) ? path : `../${path.replace(/^\.\//,'')}`);

  function normalizeStore(raw){
    const base=clone(DEFAULT_STORE);
    if(!raw || !raw.settings || !Array.isArray(raw.products)) return base;
    base.settings={...base.settings,...raw.settings};
    base.products=raw.products.map(p=>({active:true,availableToday:true,soldOut:false,featured:false,...p}));
    return base;
  }
  function loadStore(){
    try{const raw=JSON.parse(localStorage.getItem(STORE_KEY));if(raw)return normalizeStore(raw);}catch(_){}
    localStorage.setItem(STORE_KEY,JSON.stringify(DEFAULT_STORE));return clone(DEFAULT_STORE);
  }
  let store=loadStore();
  let todayQuery='',todayCat='Todos',productQuery='',productCat='Todos';

  function persist(message='Alterações salvas'){
    store.settings.updatedAt=new Date().toISOString();
    try{localStorage.setItem(STORE_KEY,JSON.stringify(store));setSaved(message);return true}catch(err){toast('Não foi possível salvar. O armazenamento do navegador pode estar cheio.');return false}
  }
  function setSaved(message){const el=$('#saveState');el.textContent=message;el.style.color='var(--green)';clearTimeout(window.__saved);window.__saved=setTimeout(()=>el.textContent='Alterações salvas',1800)}
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),2400)}
  function fmtDate(iso){try{return new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(iso))}catch(_){return''}}

  function showAdmin(){ $('#loginScreen').classList.add('hidden'); $('#adminShell').classList.remove('hidden'); renderAll(); }
  if(sessionStorage.getItem(AUTH_KEY)==='1') showAdmin();
  $('#loginForm').addEventListener('submit',e=>{e.preventDefault();if($('#loginUser').value.trim()===USERNAME&&$('#loginPass').value===PASSWORD){sessionStorage.setItem(AUTH_KEY,'1');showAdmin()}else toast('Usuário ou senha incorretos.')});
  $('#logoutBtn').addEventListener('click',()=>{sessionStorage.removeItem(AUTH_KEY);location.reload()});

  const panelTitles={dashboard:'Visão geral',today:'Cardápio do dia',products:'Produtos',settings:'Loja e pedidos',backup:'Backup'};
  function openPanel(name){$$('.admin-nav button').forEach(b=>b.classList.toggle('active',b.dataset.panel===name));$$('.panel').forEach(p=>p.classList.toggle('active',p.id===`panel-${name}`));$('#panelTitle').textContent=panelTitles[name]||'Painel';$('.sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});}
  $$('.admin-nav button').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));$$('[data-go]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.go)));$('#mobileMenuBtn').addEventListener('click',()=>$('.sidebar').classList.toggle('open'));

  function renderStats(){
    $('#statProducts').textContent=store.products.length;
    $('#statToday').textContent=store.products.filter(p=>p.active!==false&&p.availableToday!==false).length;
    $('#statSoldOut').textContent=store.products.filter(p=>p.active!==false&&p.availableToday!==false&&p.soldOut).length;
    $('#statFeatured').textContent=store.products.filter(p=>p.featured).length;
    $('#dashboardStoreStatus').textContent=store.settings.isOpen?'Aberta para pedidos':'Pedidos pausados';
    $('#dashboardUpdated').textContent=`Última atualização: ${fmtDate(store.settings.updatedAt)}`;
    $('#quickStoreOpen').checked=!!store.settings.isOpen;
    $('#storeStatusCard').style.borderColor=store.settings.isOpen?'rgba(73,107,80,.25)':'rgba(165,61,53,.24)';
    const today=store.products.filter(p=>p.active!==false&&p.availableToday!==false).slice(0,5);
    $('#todayPreview').innerHTML=today.map(p=>`<div class="mini-row"><img src="${esc(imgForAdmin(p.image))}" alt=""><div><strong>${esc(p.name)}</strong><small>${esc(p.category)}</small></div><span class="pill ${p.soldOut?'sold':''}">${p.soldOut?'Esgotado':'Disponível'}</span></div>`).join('')||'<div class="empty-state">Nenhum produto liberado hoje.</div>';
  }

  function filteredToday(){return store.products.filter(p=>p.active!==false).filter(p=>todayCat==='Todos'||p.category===todayCat).filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(todayQuery.toLowerCase()))}
  function renderToday(){
    const list=filteredToday();
    $('#todayGrid').innerHTML=list.map(p=>`<article class="today-card"><img src="${esc(imgForAdmin(p.image))}" alt="${esc(p.name)}"><div class="today-main"><div class="today-title-row"><div><small>${esc(p.category)}</small><h3>${esc(p.name)}</h3></div><span>${money(p.price)}</span></div><div class="today-switches"><label class="quick-toggle"><input type="checkbox" data-today="${esc(p.id)}" ${p.availableToday!==false?'checked':''}> No cardápio hoje</label><label class="quick-toggle"><input type="checkbox" data-sold="${esc(p.id)}" ${p.soldOut?'checked':''} ${p.availableToday===false?'disabled':''}> Esgotado</label></div></div></article>`).join('')||'<div class="empty-state">Nenhum produto encontrado.</div>';
    $$('[data-today]').forEach(input=>input.addEventListener('change',()=>{const p=store.products.find(x=>x.id===input.dataset.today);if(!p)return;p.availableToday=input.checked;if(!input.checked)p.soldOut=false;persist();renderAll()}));
    $$('[data-sold]').forEach(input=>input.addEventListener('change',()=>{const p=store.products.find(x=>x.id===input.dataset.sold);if(!p)return;p.soldOut=input.checked;persist();renderAll()}));
  }

  function filteredProducts(){return store.products.filter(p=>productCat==='Todos'||p.category===productCat).filter(p=>`${p.name} ${p.category} ${p.description||''}`.toLowerCase().includes(productQuery.toLowerCase()))}
  function renderProducts(){
    $('#productList').innerHTML=filteredProducts().map(p=>`<article class="product-row"><img src="${esc(imgForAdmin(p.image))}" alt=""><div><h3>${esc(p.name)}</h3><p>${esc((p.description||'').slice(0,110))}</p></div><div class="meta">${esc(p.category)}<br>${p.active!==false?'Ativo':'Oculto'}${p.availableToday!==false?' · Hoje':''}${p.soldOut?' · Esgotado':''}</div><div class="price">${money(p.price)}</div><div class="row-actions"><button data-edit="${esc(p.id)}">Editar</button><button class="delete" data-delete="${esc(p.id)}">Excluir</button></div></article>`).join('')||'<div class="empty-state">Nenhum produto encontrado.</div>';
    $$('[data-edit]').forEach(btn=>btn.addEventListener('click',()=>openProductModal(btn.dataset.edit)));$$('[data-delete]').forEach(btn=>btn.addEventListener('click',()=>deleteProduct(btn.dataset.delete)));
  }

  function renderSettings(){const s=store.settings;$('#settingName').value=s.name||'';$('#settingTagline').value=s.tagline||'';$('#settingPhoneDisplay').value=s.phoneDisplay||'';$('#settingPhoneWhatsApp').value=s.phoneWhatsApp||'';$('#settingAddress').value=s.address||'';$('#settingCity').value=s.city||'';$('#settingNotice').value=s.notice||'';$('#settingHeroEyebrow').value=s.heroEyebrow||'';$('#settingHeroTitle').value=s.heroTitle||'';$('#settingHeroText').value=s.heroText||'';$('#settingIsOpen').checked=!!s.isOpen;$('#settingAllowDelivery').checked=!!s.allowDelivery;$('#settingAllowPickup').checked=!!s.allowPickup;$('#settingMinimumOrder').value=Number(s.minimumOrder||0);$('#settingDeliveryFee').value=Number(s.deliveryFee||0)}
  function renderAll(){renderStats();renderToday();renderProducts();renderSettings()}

  $('#quickStoreOpen').addEventListener('change',e=>{store.settings.isOpen=e.target.checked;persist();renderStats();renderSettings()});
  $('#todaySearch').addEventListener('input',e=>{todayQuery=e.target.value;renderToday()});$('#todayCategory').addEventListener('change',e=>{todayCat=e.target.value;renderToday()});
  $('#productSearch').addEventListener('input',e=>{productQuery=e.target.value;renderProducts()});$('#productCategoryFilter').addEventListener('change',e=>{productCat=e.target.value;renderProducts()});
  $('#enableAllToday').addEventListener('click',()=>{if(!confirm('Disponibilizar todos os produtos ativos no cardápio de hoje?'))return;store.products.forEach(p=>{if(p.active!==false){p.availableToday=true;p.soldOut=false}});persist();renderAll();toast('Todos os produtos ativos foram liberados para hoje.')});
  $('#disableAllToday').addEventListener('click',()=>{if(!confirm('Remover todos os produtos do cardápio de hoje?'))return;store.products.forEach(p=>{p.availableToday=false;p.soldOut=false});persist();renderAll();toast('Cardápio do dia limpo.')});

  function clearProductForm(){['productId','productName','productPrice','productImageUrl','productDescription'].forEach(id=>$('#'+id).value='');$('#productCategory').value='Doces';$('#productImageFile').value='';$('#productActive').checked=true;$('#productAvailableToday').checked=true;$('#productSoldOut').checked=false;$('#productFeatured').checked=false;$('#productModalTitle').textContent='Novo produto'}
  function openProductModal(id){clearProductForm();if(id){const p=store.products.find(x=>x.id===id);if(p){$('#productId').value=p.id;$('#productName').value=p.name;$('#productCategory').value=p.category;$('#productPrice').value=p.price;$('#productImageUrl').value=p.image||'';$('#productDescription').value=p.description||'';$('#productActive').checked=p.active!==false;$('#productAvailableToday').checked=p.availableToday!==false;$('#productSoldOut').checked=!!p.soldOut;$('#productFeatured').checked=!!p.featured;$('#productModalTitle').textContent='Editar produto'}}$('#productModalBackdrop').classList.add('show');$('#productModal').classList.add('open');$('#productModal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
  function closeProductModal(){$('#productModalBackdrop').classList.remove('show');$('#productModal').classList.remove('open');$('#productModal').setAttribute('aria-hidden','true');document.body.style.overflow=''}
  $('#newProductBtn').addEventListener('click',()=>openProductModal());$('#dashboardNewProduct').addEventListener('click',()=>openProductModal());$('#closeProductModal').addEventListener('click',closeProductModal);$('#cancelProduct').addEventListener('click',closeProductModal);$('#productModalBackdrop').addEventListener('click',closeProductModal);
  function deleteProduct(id){const p=store.products.find(x=>x.id===id);if(!p)return;if(!confirm(`Excluir “${p.name}” do catálogo?`))return;store.products=store.products.filter(x=>x.id!==id);persist();renderAll();toast('Produto excluído.')}

  function fileToDataUrl(file,max=1100,quality=.76){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const ratio=Math.min(1,max/Math.max(img.width,img.height));const w=Math.round(img.width*ratio),h=Math.round(img.height*ratio);const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(img,0,0,w,h);resolve(canvas.toDataURL('image/jpeg',quality))};img.src=reader.result};reader.readAsDataURL(file)})}
  $('#productForm').addEventListener('submit',async e=>{e.preventDefault();const id=$('#productId').value||uid();const existing=store.products.find(x=>x.id===id);let image=$('#productImageUrl').value.trim()||existing?.image||'assets/logo.png';const file=$('#productImageFile').files[0];if(file){try{image=await fileToDataUrl(file)}catch(_){toast('Não consegui processar a foto.');return}}const data={id,name:$('#productName').value.trim(),category:$('#productCategory').value,price:Number($('#productPrice').value||0),image,description:$('#productDescription').value.trim(),active:$('#productActive').checked,availableToday:$('#productAvailableToday').checked,soldOut:$('#productSoldOut').checked,featured:$('#productFeatured').checked};if(!data.availableToday)data.soldOut=false;if(existing)Object.assign(existing,data);else store.products.unshift(data);if(persist()){renderAll();closeProductModal();toast('Produto salvo com sucesso.')}});

  $('#settingsForm').addEventListener('submit',e=>{e.preventDefault();store.settings={...store.settings,name:$('#settingName').value.trim(),tagline:$('#settingTagline').value.trim(),phoneDisplay:$('#settingPhoneDisplay').value.trim(),phoneWhatsApp:$('#settingPhoneWhatsApp').value.replace(/\D/g,''),address:$('#settingAddress').value.trim(),city:$('#settingCity').value.trim(),notice:$('#settingNotice').value.trim(),heroEyebrow:$('#settingHeroEyebrow').value.trim(),heroTitle:$('#settingHeroTitle').value.trim(),heroText:$('#settingHeroText').value.trim(),isOpen:$('#settingIsOpen').checked,allowDelivery:$('#settingAllowDelivery').checked,allowPickup:$('#settingAllowPickup').checked,minimumOrder:Number($('#settingMinimumOrder').value||0),deliveryFee:Number($('#settingDeliveryFee').value||0)};if(!store.settings.allowDelivery&&!store.settings.allowPickup){store.settings.allowPickup=true;toast('Mantive a opção de retirada ativa, pois pelo menos uma forma de recebimento é necessária.')}persist();renderAll();toast('Configurações salvas.')});

  $('#exportData').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(store,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`confeittaria-backup-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);toast('Backup exportado.')});
  $('#importData').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{const data=JSON.parse(await file.text());store=normalizeStore(data);persist();renderAll();toast('Backup importado.')}catch(_){toast('Arquivo de backup inválido.')}e.target.value=''});
  $('#resetData').addEventListener('click',()=>{if(!confirm('Restaurar todos os dados originais da demonstração?'))return;store=clone(DEFAULT_STORE);persist();renderAll();toast('Demonstração restaurada.')});
  window.addEventListener('storage',e=>{if(e.key===STORE_KEY){store=loadStore();renderAll()}});
})();
