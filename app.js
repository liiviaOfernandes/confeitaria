(() => {
  const { STORE_KEY, CART_KEY, DEFAULT_STORE } = window.CONFEITTARIA;
  const clone = value => JSON.parse(JSON.stringify(value));
  const money = value => Number(value || 0).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
  const esc = (value='') => String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  function normalizeStore(raw){
    const base = clone(DEFAULT_STORE);
    if (!raw || !raw.settings || !Array.isArray(raw.products)) return base;
    base.settings = { ...base.settings, ...raw.settings };
    base.products = raw.products.map(p => ({ active:true, availableToday:true, soldOut:false, featured:false, ...p }));
    return base;
  }
  function loadStore(){
    try { const parsed = JSON.parse(localStorage.getItem(STORE_KEY)); if (parsed) return normalizeStore(parsed); } catch (_) {}
    localStorage.setItem(STORE_KEY, JSON.stringify(DEFAULT_STORE));
    return clone(DEFAULT_STORE);
  }
  function loadCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (_) { return []; } }
  function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

  let store = loadStore();
  let cart = loadCart();
  let category = 'Todos';
  let search = '';
  let fulfillment = store.settings.allowDelivery ? 'delivery' : 'pickup';

  const icons = {
    Todos:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
    Doces:'<svg viewBox="0 0 24 24"><path d="M7 10h10l-1 9H8z"/><path d="M8 10c0-3 2-5 4-5s4 2 4 5"/><path d="M12 5V3"/></svg>',
    Salgados:'<svg viewBox="0 0 24 24"><path d="M4 16c4-6 12-8 16-4-1 5-6 8-12 7-2 0-3-1-4-3z"/><path d="M8 14h.01M12 12h.01M15 15h.01"/></svg>',
    Bebidas:'<svg viewBox="0 0 24 24"><path d="M6 8h11v9a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2"/><path d="M9 4c0 1-1 1-1 2M13 4c0 1-1 1-1 2"/></svg>',
    Presentes:'<svg viewBox="0 0 24 24"><path d="M4 9h16v11H4z"/><path d="M12 9v11M3 9h18V6H3z"/><path d="M12 6c-2 0-4-1-4-3 3 0 4 1 4 3zm0 0c2 0 4-1 4-3-3 0-4 1-4 3z"/></svg>',
    Cestas:'<svg viewBox="0 0 24 24"><path d="M5 10h14l-2 10H7z"/><path d="M8 10l4-6 4 6M9 14h.01M12 14h.01M15 14h.01"/></svg>'
  };
  const categories = ['Todos','Doces','Salgados','Bebidas','Presentes','Cestas'];

  function applySettings(){
    const s = store.settings;
    $('#brandName').textContent = s.name || 'Confeittaria';
    $('#brandTagline').textContent = s.tagline || '';
    $('#cityText').textContent = s.city || 'Monte Carmelo, MG';
    $('#heroEyebrow').textContent = s.heroEyebrow || '';
    $('#heroTitle').textContent = s.heroTitle || '';
    $('#heroText').textContent = s.heroText || '';
    $('#addressText').textContent = s.address || '';
    $('#phoneText').textContent = s.phoneDisplay || '';
    $('#footerNotice').textContent = s.notice || '';
    $('#whatsappContact').href = `https://wa.me/${String(s.phoneWhatsApp||'').replace(/\D/g,'')}`;
    const status = $('#storeStatus');
    status.textContent = s.isOpen ? 'Aberto para pedidos' : 'Pedidos pausados';
    status.classList.toggle('closed', !s.isOpen);
    document.title = `${s.name || 'Confeittaria'} | Delivery`;
  }

  function renderCategories(){
    $('#categoryStrip').innerHTML = categories.map(name => `<button class="category-btn ${name===category?'active':''}" data-category="${name}"><span class="category-icon">${icons[name]}</span><span>${name}</span></button>`).join('');
    $('#filterRow').innerHTML = categories.map(name => `<button class="filter-btn ${name===category?'active':''}" data-filter="${name}">${name}</button>`).join('');
    $$('[data-category]').forEach(btn => btn.addEventListener('click', () => { category=btn.dataset.category; renderCategories(); renderProducts(); $('#cardapio').scrollIntoView({behavior:'smooth'}); }));
    $$('[data-filter]').forEach(btn => btn.addEventListener('click', () => { category=btn.dataset.filter; renderCategories(); renderProducts(); }));
  }

  function publicProducts(){
    return store.products.filter(p => p.active !== false && p.availableToday !== false);
  }
  function renderProducts(){
    const q = search.trim().toLowerCase();
    let list = publicProducts().filter(p => category==='Todos' || p.category===category);
    if(q) list = list.filter(p => `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q));
    const grid = $('#productGrid');
    if(!list.length){ grid.innerHTML = '<div class="empty-results">Nenhum produto encontrado nesta seleção. Tente outra categoria ou busca.</div>'; return; }
    grid.innerHTML = list.map(p => `
      <article class="product-card">
        <div class="product-image-wrap"><img class="product-image" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">${p.soldOut?'<span class="product-status sold">Esgotado</span>':p.featured?'<span class="product-status">Destaque</span>':''}</div>
        <div class="product-body"><span class="product-category">${esc(p.category)}</span><h3 class="product-name">${esc(p.name)}</h3><p class="product-desc">${esc(p.description||'')}</p><div class="product-footer"><span class="product-price">${money(p.price)}</span><button class="add-btn" data-add="${esc(p.id)}" ${p.soldOut || !store.settings.isOpen?'disabled':''} aria-label="Adicionar ${esc(p.name)}">+</button></div></div>
      </article>`).join('');
    $$('[data-add]').forEach(btn => btn.addEventListener('click', () => addToCart(btn.dataset.add)));
  }

  function cleanCart(){
    const ids = new Set(store.products.map(p=>p.id));
    cart = cart.filter(item => ids.has(item.id) && item.qty > 0);
    saveCart();
  }
  function cartQty(){ return cart.reduce((sum,item)=>sum+item.qty,0); }
  function cartTotal(){ return cart.reduce((sum,item)=>{ const p=store.products.find(x=>x.id===item.id); return sum + (p?Number(p.price)*item.qty:0); },0); }
  function addToCart(id){
    const p=store.products.find(x=>x.id===id); if(!p || p.soldOut || !p.availableToday || !p.active || !store.settings.isOpen) return;
    const item=cart.find(x=>x.id===id); if(item) item.qty += 1; else cart.push({id,qty:1});
    saveCart(); renderCart(); toast(`${p.name} adicionado ao carrinho.`);
  }
  function changeQty(id, delta){ const item=cart.find(x=>x.id===id); if(!item)return; item.qty+=delta; if(item.qty<=0) cart=cart.filter(x=>x.id!==id); saveCart(); renderCart(); }
  function removeItem(id){ cart=cart.filter(x=>x.id!==id); saveCart(); renderCart(); }
  function renderCart(){
    cleanCart();
    const qty=cartQty(), total=cartTotal();
    $('#cartCount').textContent=qty; $('#bottomCartCount').textContent=qty;
    $('#cartCount').style.display=qty?'grid':'none'; $('#bottomCartCount').style.display=qty?'grid':'none';
    $('#cartEmpty').classList.toggle('hidden', qty>0); $('#cartItems').classList.toggle('hidden', qty===0); $('#cartSummary').classList.toggle('hidden', qty===0);
    $('#cartSubtotal').textContent=money(total); $('#checkoutTotal').textContent=money(total + (fulfillment==='delivery'?Number(store.settings.deliveryFee||0):0));
    const min=Number(store.settings.minimumOrder||0); $('#minimumOrderText').textContent=min>0?`Pedido mínimo: ${money(min)}`:'';
    $('#cartItems').innerHTML = cart.map(item=>{ const p=store.products.find(x=>x.id===item.id); if(!p)return''; return `<div class="cart-item"><img src="${esc(p.image)}" alt=""><div><h4>${esc(p.name)}</h4><small>${money(p.price)} cada</small><div><button class="remove-item" data-remove="${esc(p.id)}">Remover</button></div></div><div class="qty-control"><button data-dec="${esc(p.id)}">−</button><span>${item.qty}</span><button data-inc="${esc(p.id)}">+</button></div></div>`; }).join('');
    $$('[data-inc]').forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.inc,1))); $$('[data-dec]').forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.dec,-1))); $$('[data-remove]').forEach(b=>b.addEventListener('click',()=>removeItem(b.dataset.remove)));
  }

  function openCart(){ $('#cartDrawer').classList.add('open'); $('#drawerBackdrop').classList.add('show'); $('#cartDrawer').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeCart(){ $('#cartDrawer').classList.remove('open'); $('#drawerBackdrop').classList.remove('show'); $('#cartDrawer').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  function renderFulfillment(){
    const s=store.settings, choices=[];
    if(s.allowDelivery) choices.push(['delivery','Entrega']); if(s.allowPickup) choices.push(['pickup','Retirada']);
    if(!choices.some(c=>c[0]===fulfillment)) fulfillment=choices[0]?.[0] || 'pickup';
    $('#fulfillmentChoices').innerHTML=choices.map(([value,label])=>`<button type="button" class="choice-btn ${value===fulfillment?'active':''}" data-fulfillment="${value}">${label}</button>`).join('');
    $$('[data-fulfillment]').forEach(btn=>btn.addEventListener('click',()=>{fulfillment=btn.dataset.fulfillment;renderFulfillment();renderCart();}));
    $('#addressField').classList.toggle('hidden',fulfillment!=='delivery'); $('#customerAddress').required=fulfillment==='delivery';
  }
  function openCheckout(){
    if(!cart.length) return toast('Adicione algum produto ao carrinho.');
    if(!store.settings.isOpen) return toast('Os pedidos estão pausados no momento.');
    if(cartTotal() < Number(store.settings.minimumOrder||0)) return toast(`O pedido mínimo é ${money(store.settings.minimumOrder)}.`);
    closeCart(); renderFulfillment(); renderCart(); $('#checkoutBackdrop').classList.add('show'); $('#checkoutModal').classList.add('open'); $('#checkoutModal').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  function closeCheckout(){ $('#checkoutBackdrop').classList.remove('show'); $('#checkoutModal').classList.remove('open'); $('#checkoutModal').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

  function submitOrder(event){
    event.preventDefault();
    const name=$('#customerName').value.trim(), phone=$('#customerPhone').value.trim(), address=$('#customerAddress').value.trim(), payment=$('#paymentMethod').value, change=$('#changeFor').value.trim(), notes=$('#orderNotes').value.trim();
    const fee=fulfillment==='delivery'?Number(store.settings.deliveryFee||0):0, total=cartTotal()+fee;
    const lines=cart.map(item=>{const p=store.products.find(x=>x.id===item.id);return `• ${item.qty}x ${p.name} — ${money(Number(p.price)*item.qty)}`;}).join('\n');
    const message = [
      `Olá! Gostaria de fazer um pedido na ${store.settings.name}.`, '',
      `*Cliente:* ${name}`, `*WhatsApp:* ${phone}`, `*Recebimento:* ${fulfillment==='delivery'?'Entrega':'Retirada'}`,
      fulfillment==='delivery'?`*Endereço:* ${address}`:'', '', '*Pedido:*', lines, '',
      `*Subtotal:* ${money(cartTotal())}`, fee?`*Taxa de entrega:* ${money(fee)}`:'', `*Total estimado:* ${money(total)}`,
      `*Pagamento:* ${payment}`, payment==='Dinheiro'&&change?`*Troco para:* ${change}`:'', notes?`*Observações:* ${notes}`:'', '', 'Podem confirmar a disponibilidade e o prazo, por favor?'
    ].filter(Boolean).join('\n');
    const wa=String(store.settings.phoneWhatsApp||'').replace(/\D/g,'');
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(message)}`,'_blank','noopener');
  }

  function toast(message){ const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(window.__toastTimer); window.__toastTimer=setTimeout(()=>el.classList.remove('show'),2400); }

  $('#searchInput').addEventListener('input',e=>{search=e.target.value;$('#clearSearch').classList.toggle('show',!!search);renderProducts();});
  $('#clearSearch').addEventListener('click',()=>{$('#searchInput').value='';search='';$('#clearSearch').classList.remove('show');renderProducts();$('#searchInput').focus();});
  $('#showAllBtn').addEventListener('click',()=>{category='Todos';search='';$('#searchInput').value='';renderCategories();renderProducts();});
  $('#openCartBtn').addEventListener('click',openCart); $('#bottomCartBtn').addEventListener('click',openCart); $('#closeCartBtn').addEventListener('click',closeCart); $('#drawerBackdrop').addEventListener('click',closeCart); $('#checkoutBtn').addEventListener('click',openCheckout); $('#closeCheckoutBtn').addEventListener('click',closeCheckout); $('#checkoutBackdrop').addEventListener('click',closeCheckout); $('#checkoutForm').addEventListener('submit',submitOrder);
  $('#paymentMethod').addEventListener('change',e=>$('#changeField').classList.toggle('hidden',e.target.value!=='Dinheiro')); $('#changeField').classList.add('hidden');
  const searchFocusBtn=$('#searchFocusBtn'); if(searchFocusBtn) searchFocusBtn.addEventListener('click',()=>{$('#searchInput').focus();$('#searchInput').scrollIntoView({behavior:'smooth',block:'center'});});
  window.addEventListener('storage',e=>{ if(e.key===STORE_KEY){store=loadStore();applySettings();renderCategories();renderProducts();renderFulfillment();renderCart();} });

  applySettings(); renderCategories(); renderProducts(); renderFulfillment(); renderCart();
})();
