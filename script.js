const urlApiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/';
const urlApiMercadoLivreItem = 'https://api.mercadolibre.com/items/';

// FUNÇÃO 01.
// Faz o fetch da API do mercado livre. Coloquei a url em uma constante lá em cima.
// O endPoint vai ser a busca por computador.
// Vai retornar o objeto já traduzido ou um erro.
// CHAMADA: createProductsGrid
const fetchApiMercadoLivre = async (endPoint) => {
  try {
    const response = await fetch(`${urlApiMercadoLivre}${endPoint}`);
  const product = await response.json();
  return product;
  } catch (error) {
    alert('Não foi possível acessar à api');
  }
};

// FUNÇÃO 02.
// Cria uma imagem.
// CHAMADA: createProductItemElement
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// FUNÇÃO 03.
// Cria um elemento com classe e inner text.
// CHAMADA: createProductItemElement
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
const cartOl = '.cart__items';

function saveCart() {
  const cartList = document.querySelector(cartOl);
  localStorage.setItem('cart', cartList.innerHTML);
}

function cartItemClickListener(event) {
  const cartList = document.querySelector(cartOl);
  cartList.removeChild(event.target);
  saveCart();
}

// FUNÇÃO 04.
// Cria uma li no carrinho de compras com as informações do produto passado por parâmetro
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// FUNÇÃO 05.
// Adiciona a li à ol do carrinho
const addProductCart = (li) => {
  const olItems = document.querySelector(cartOl);
  olItems.appendChild(li);
};

// FUNÇÃO 06.
// Pega o id do item clicado e faz o fetch da api desse item.
// Chama a createCartItemElement e passa o produto como parâmetro pra ela, ela retorna uma li. Eu aramazeno esse retorno e passo como parâmetro pra addProductCart pra linkar ao html.
const getProduct = async (idProduct) => {
  const response = await fetch(`${urlApiMercadoLivreItem}${idProduct}`);
  const product = await response.json();
  const productLi = createCartItemElement(product);
  addProductCart(productLi);
};

// FUNÇÃO 07.
// Função do addEventListener dos botões 'Adicionar ao carrinho!'.
// Pega o primeiro filho do parentNode, que é o id que a gente quer
async function getIdProduct(event) {
  const idProduct = event.target.parentNode.firstChild.innerText;
  await getProduct(idProduct);
  saveCart();
}

// FUNÇÃO 08.
// Cria o quadrado do produto na lista.
// Alterei os parâmetros da função porque as chaves são id, title e thumbnail.
// Vai criar uma section pra cada item, essa section tá sendo linkada ao html na função createProductsGrid
// Cria uma classe pra essa section.
// Usa a função createCustomElement pra criar um span com o id, um spam com o name, os dois contendo suas classes. Uma imagem e um botão.
// Coloquei um eventListener pra cada botão pro requisito 2.
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', getIdProduct);

  return section;
}

// FUNÇÃO 09.
// To chamando a função que faz o fetch da API, com o endpoint que queremos.
// Acesso a chave onde estão as informações que eu quero.
// A chave já é um array, então jogo o forEach direto.
// forEach: pra cada resultado dessa busca eu vou criar um item na lista, com a função que já veio, e vou linkar ela à seção de items.
// Chamo essa função no onload.
const createProductsGrid = async () => {
  const product = await fetchApiMercadoLivre('search?q=computador');
  const sectionItems = document.querySelector('.items');
  product.results.forEach((result) => {
    const item = createProductItemElement(result);
    sectionItems.appendChild(item);
  });
};

function getCartSaved() {
  const cartSaved = localStorage.getItem('cart');
  if (cartSaved !== null) {
    const cartList = document.querySelector(cartOl);
    cartList.innerHTML = cartSaved;
    const productsCartList = document.querySelectorAll('.cart__item');
    productsCartList.forEach((product) => {
      product.addEventListener('click', (event) => {
      cartList.removeChild(event.target);
      saveCart();
    });
    });
  }
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

/* function clearCart() {
  const buttonClear = document.querySelector('.empty-cart');
  const cartList = document.querySelector(cartOl);
  buttonClear.addEventListener('click', () => {
    cartList.innerHTML = '';
  });
} */

window.onload = async () => {
  await createProductsGrid();
  getCartSaved();
  /* clearCart(); */
};
