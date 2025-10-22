

const STORAGE_KEY = 'produtos-selecionados';

function initCart() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

function getCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (_) {
        return [];
    }
}

function setCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function addToCart(produto) {
    const cart = getCart();
    cart.push({ id: produto.id, title: produto.title, price: produto.price, image: produto.image });
    setCart(cart);
    renderCestoCount();
    atualizaCesto();
}

function renderCestoCount() {
    const cestoSec = document.querySelector('#cesto');
    if (!cestoSec) { return; }

    // usa o primeiro <p> dentro da secção cesto
    let info = cestoSec.querySelector('p');
    if (!info) {
        info = document.createElement('p');
        cestoSec.appendChild(info);
    }

    const cart = getCart();
    if (cart.length === 0) {
        info.textContent = 'O cesto está vazio.';
    } else {
        const total = cart.reduce((acc, it) => acc + (Number(it.price) || 0), 0);
        const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
        info.textContent = `Itens no cesto: ${cart.length} • Total: ${formatoEUR.format(total)}`;
    }
}




document.addEventListener('DOMContentLoaded', () => {
    initCart();
    renderCestoCount();
    atualizaCesto();
    carregarProdutos(produtos);
});



function carregarProdutos(lista) {
    const container = document.querySelector('#lista-produtos');
    if (!container || !Array.isArray(lista)) {
        return;
    }

    container.setAttribute('role', 'list');

    /*
    lista.forEach((produto) => {
      console.log(produto);
    });
    
    lista.forEach((produto) => {
      console.log('id:', produto.id, 'title:', produto.title);
    });
    */

    // Renderização dos artigos
    lista.forEach((produto) => {
        const artigo = criarProduto(produto);
        container.append(artigo);
    });
}

// Criacao de produtos

function criarProduto(produto) {
    const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });

    const artigo = document.createElement('article');
    artigo.className = 'produto';
    artigo.setAttribute('role', 'listitem');
    artigo.dataset.id = String(produto.id);

    const img = document.createElement('img');
    img.src = produto.image;
    img.alt = `${produto.title} — categoria: ${produto.category}`;

    const h3 = document.createElement('h3');
    h3.textContent = produto.title;

    const descr = document.createElement('p');
    descr.className = 'descricao';
    descr.textContent = produto.description;

    const preco = document.createElement('p');
    preco.className = 'preco';
    preco.dataset.preco = String(produto.price);
    preco.textContent = formatoEUR.format(produto.price);

    const rating = document.createElement('p');
    rating.className = 'rating';
    rating.textContent = `★ ${produto.rating.rate} (${produto.rating.count})`;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Adicionar ao cesto';
    btn.ariaLabel = `Adicionar "${produto.title}" ao cesto`;
    btn.addEventListener('click', () => {
        addToCart(produto);
    });

    // Montagem do artigo
    artigo.appendChild(img);
    artigo.appendChild(h3);
    artigo.appendChild(descr);
    artigo.appendChild(preco);
    artigo.appendChild(rating);
    artigo.appendChild(btn);

    return artigo;
}



// Cesto de compras
function atualizaCesto() {
    const cestoSec = document.querySelector('#cesto');
    if (!cestoSec) return;

    const lista = getCart(); // vai ao localStorage
    cestoSec.innerHTML = '<h2>Cesto</h2><section id="cesto-lista" role="list"></section>';
    const listaEl = cestoSec.querySelector('#cesto-lista');

    if (lista.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'O cesto está vazio.';
        cestoSec.appendChild(p);
        return;
    }

    // criar artigos do cesto
    lista.forEach((produto) => {
        const artigo = criaProdutoCesto(produto);
        listaEl.appendChild(artigo);
    });

    // calcular total
    let total = 0;
    for (let produto of lista) {
        total += Number(produto.price) || 0;
    }

    const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
    const pTotal = document.createElement('p');
    pTotal.textContent = `Total: ${formatoEUR.format(total)}`;
    pTotal.style.fontWeight = 'bold';
    cestoSec.appendChild(pTotal);
}


function criaProdutoCesto(produto) {
    const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });


    const artigo = document.createElement('article');
    artigo.className = 'produto';
    artigo.setAttribute('role', 'listitem');
    artigo.dataset.id = String(produto.id);

    const img = document.createElement('img');
    img.src = produto.image;
    img.alt = `${produto.title}`;

    const h3 = document.createElement('h3');
    h3.textContent = produto.title;

    const preco = document.createElement('p');
    preco.className = 'preco';
    preco.textContent = formatoEUR.format(produto.price);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Remover do cesto';
    btn.style.backgroundColor = '#e74c3c';
    btn.addEventListener('click', () => {
        const lista = getCart();
        const novaLista = lista.filter((p) => p.id !== produto.id);
        setCart(novaLista);
        atualizaCesto();
    });

    artigo.appendChild(img);
    artigo.appendChild(h3);
    artigo.appendChild(preco);
    artigo.appendChild(btn);

    return artigo;
}