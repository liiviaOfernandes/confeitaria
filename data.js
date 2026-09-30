(function () {
  const DEFAULT_STORE = {
    version: 1,
    settings: {
      name: 'Confeittaria',
      tagline: 'Doces autorais e exclusivos',
      heroEyebrow: 'Sabor em cada momento',
      heroTitle: 'Agora também no seu lar',
      heroText: 'Doces, salgados, bebidas e presentes preparados com o cuidado da Confeittaria.',
      phoneDisplay: '+55 34 9985-6313',
      phoneWhatsApp: '553499856313',
      address: 'Av. Romualdo Rezende, 378 - Centro, Monte Carmelo - MG, 38500-000, Brasil',
      city: 'Monte Carmelo, MG',
      isOpen: true,
      allowDelivery: true,
      allowPickup: true,
      minimumOrder: 0,
      deliveryFee: 0,
      notice: 'Cardápio sujeito à disponibilidade do dia.',
      updatedAt: new Date().toISOString()
    },
    products: [
      { id:'p01', name:'Caixa de Macarons', category:'Doces', description:'Macarons artesanais em sabores variados. Uma opção delicada para presentear ou acompanhar o café.', price:28, image:'assets/products/macarons-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p02', name:'Brownie Cremoso', category:'Doces', description:'Brownie de chocolate com cobertura cremosa e finalização especial.', price:18, image:'assets/products/brownie-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p03', name:'Cone Trufado Especial', category:'Doces', description:'Cone recheado com creme, chocolates e frutas. Ideal para uma sobremesa especial.', price:22, image:'assets/products/cone-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p04', name:'Torta Mousse de Maracujá', category:'Doces', description:'Fatia cremosa de maracujá com base de chocolate.', price:16, image:'assets/products/torta-maracuja-real.jpeg', active:true, availableToday:true, soldOut:false, featured:false },
      { id:'p05', name:'Brigadeiros Gourmet', category:'Doces', description:'Seleção de brigadeiros com acabamentos e sabores variados.', price:24, image:'assets/products/brigadeiros-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p06', name:'Docinhos Especiais', category:'Doces', description:'Docinhos artesanais com acabamento delicado para festas, presentes ou um mimo no dia.', price:12, image:'assets/products/docinhos-real.jpeg', active:true, availableToday:true, soldOut:false, featured:false },
      { id:'p07', name:'Pão de Queijo Recheado', category:'Salgados', description:'Pão de queijo recheado, servido quentinho e bem cremoso.', price:14, image:'assets/products/pao-queijo-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p08', name:'Bebida Cremosa de Caramelo', category:'Bebidas', description:'Bebida gelada e cremosa com toque de caramelo.', price:16, image:'assets/products/bebida-caramelo-real.jpeg', active:true, availableToday:true, soldOut:false, featured:false },
      { id:'p09', name:'Sobremesa no Pote', category:'Doces', description:'Camadas cremosas em porção individual, pronta para levar ou pedir em casa.', price:15, image:'assets/products/sobremesas-pote-real.jpeg', active:true, availableToday:true, soldOut:false, featured:false },
      { id:'p10', name:'Cesta Presente Personalizada', category:'Cestas', description:'Cesta montada com doces, salgados, bebida e espaço para uma mensagem especial.', price:129, image:'assets/products/cesta-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p11', name:'Kit Presente Afetivo', category:'Presentes', description:'Composição especial para aniversários, agradecimentos e outras ocasiões.', price:89, image:'assets/products/cesta-real.jpeg', active:true, availableToday:true, soldOut:false, featured:false },
      { id:'p12', name:'Salgado Recheado com Carne', category:'Salgados', description:'Massa dourada com recheio generoso de carne desfiada.', price:14, image:'assets/products/salgado-carne-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p13', name:'Cuscuz Recheado Especial', category:'Salgados', description:'Cuscuz individual recheado, cremoso e preparado para um lanche completo.', price:18, image:'assets/products/cuscuz-carne-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p14', name:'Cuscuz Cremoso da Casa', category:'Salgados', description:'Cuscuz com recheio cremoso e finalização delicada.', price:17, image:'assets/products/cuscuz-cremoso-real.jpeg', active:true, availableToday:true, soldOut:false, featured:false },
      { id:'p15', name:'Torta de Frutas Vermelhas', category:'Doces', description:'Torta cremosa em camadas com cobertura de frutas vermelhas.', price:19, image:'assets/products/torta-frutas-vermelhas-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p16', name:'Sobremesa Especial de Chocolate', category:'Doces', description:'Sobremesa intensa de chocolate em apresentação especial para compartilhar.', price:42, image:'assets/products/sobremesa-chocolate-real.jpeg', active:true, availableToday:true, soldOut:false, featured:false },
      { id:'p17', name:'Bolo de Chocolate com Avelã', category:'Doces', description:'Bolo de chocolate com recheio cremoso, cobertura e avelãs.', price:68, image:'assets/products/bolo-chocolate-avela-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p18', name:'Doces Variados da Vitrine', category:'Doces', description:'Seleção de doces artesanais em sabores e acabamentos variados.', price:12, image:'assets/products/doces-vitrine-real.jpeg', active:true, availableToday:true, soldOut:false, featured:false },
      { id:'p19', name:'Chocolate Cremoso', category:'Bebidas', description:'Bebida cremosa de chocolate com chantilly e raspas de chocolate.', price:16, image:'assets/products/chocolate-quente-real.jpeg', active:true, availableToday:true, soldOut:false, featured:true },
      { id:'p20', name:'Chá Gelado com Limão', category:'Bebidas', description:'Bebida refrescante servida com gelo e limão.', price:10, image:'assets/products/cha-gelado-real.jpeg', active:true, availableToday:true, soldOut:false, featured:false }
    ]
  };

  window.CONFEITTARIA = {
    STORE_KEY: 'confeittaria_delivery_store_v6',
    CART_KEY: 'confeittaria_delivery_cart_v3',
    DEFAULT_STORE
  };
})();
