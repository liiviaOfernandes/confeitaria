# Confeittaria Delivery — prévia profissional

Projeto estático em HTML, CSS e JavaScript, pronto para publicar no GitHub Pages para apresentação e testes.

## Estrutura

- `index.html` — delivery público, mobile-first.
- `styles.css` — estilos da loja.
- `app.js` — busca, categorias, carrinho e finalização pelo WhatsApp.
- `data.js` — dados iniciais e produtos demonstrativos.
- `assets/` — logo e fotos reais enviadas.
- `gestao/index.html` — painel administrativo não linkado na loja pública.
- `gestao/admin.css` e `gestao/admin.js` — gestão do cardápio.

## Acesso da área de gestão

Abra `gestao/index.html` ou, depois de publicar, acesse `/gestao/`.

- Usuário: `confeittaria`
- Senha: `3782026`

A área administrativa **não aparece em nenhum botão ou link do delivery**.

## O que já funciona

- Catálogo por categorias: Doces, Salgados, Bebidas, Presentes e Cestas.
- Fotos reais dos produtos enviadas para a prévia.
- Busca e filtros.
- Carrinho com quantidade e remoção de itens.
- Entrega ou retirada.
- Forma de pagamento e observações.
- Pedido formatado e enviado pelo WhatsApp.
- Loja aberta/fechada.
- Pedido mínimo e taxa de entrega configuráveis.
- Área de gestão com cadastro, edição e exclusão de produto.
- Foto por caminho/URL ou upload local.
- Produto ativo/oculto.
- Disponível no cardápio do dia.
- Marcar como esgotado.
- Destaques.
- Backup/importação dos dados da demonstração.

## Limitação importante desta versão GitHub Pages

Como o GitHub Pages não executa banco de dados nem backend, as mudanças feitas no painel são salvas no **localStorage do navegador**. Isso significa que a alteração aparece na loja quando o painel e o delivery são acessados no mesmo navegador/origem, mas não é sincronizada entre aparelhos diferentes.

Para a versão definitiva da confeitaria, o ideal é migrar o painel para hospedagem com PHP/MySQL ou outra API/backend, com:

- login real e senha protegida no servidor;
- banco de dados compartilhado;
- atualização do cardápio em todos os aparelhos;
- upload de fotos para o servidor;
- registro de pedidos;
- estoque e disponibilidade sincronizados;
- relatórios e histórico.

## Publicar no GitHub Pages

1. Envie todos os arquivos e pastas deste projeto para um repositório.
2. No GitHub, abra **Settings > Pages**.
3. Escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/ (root)`.
5. Salve.

O delivery abrirá na raiz do site. O painel ficará em `/gestao/`.

## Observação sobre os preços

Os valores desta prévia são demonstrativos e devem ser confirmados com a confeitaria antes da publicação definitiva.
