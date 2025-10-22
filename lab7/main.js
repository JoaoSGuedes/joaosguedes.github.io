
const API_URL = 'https://deisishop.pythonanywhere.com/products/';
const CATEGORIES_URL = 'https://deisishop.pythonanywhere.com/categories/';
const BUY_URL = 'https://deisishop.pythonanywhere.com/buy/';
const STORAGE_KEY = 'produtos-selecionados';
let produtosCache = [];
let categoriaAtiva = '';
let ordenacaoAtiva = '';
let termoPesquisa = '';
const checkoutEstado = {
    estudante: false,
    cupao: '',
    nome: '',
    mensagem: ''
};


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
    setupFiltros();
    carregarProdutosDaApi();
});

function setupFiltros() {
    const secProdutos = document.querySelector('#produtos');
    const listaProdutos = document.querySelector('#lista-produtos');
    if (!secProdutos || !listaProdutos) {
        return;
    }

    let barraFiltros = secProdutos.querySelector('.filtros');
    if (!barraFiltros) {
        barraFiltros = document.createElement('div');
        barraFiltros.className = 'filtros';
        secProdutos.insertBefore(barraFiltros, listaProdutos);
    } else {
        barraFiltros.innerHTML = '';
    }

    const labelCategoria = document.createElement('label');
    labelCategoria.setAttribute('for', 'filtro-categoria');
    labelCategoria.textContent = 'Filtrar: ';

    const selectCategoria = document.createElement('select');
    selectCategoria.id = 'filtro-categoria';

    const opcaoTodas = document.createElement('option');
    opcaoTodas.value = '';
    opcaoTodas.textContent = 'Todas as categorias';
    selectCategoria.appendChild(opcaoTodas);

    selectCategoria.addEventListener('change', () => {
        categoriaAtiva = selectCategoria.value;
        renderProdutosFiltrados();
    });

    const labelOrdenacao = document.createElement('label');
    labelOrdenacao.setAttribute('for', 'ordenacao-preco');
    labelOrdenacao.textContent = ' Ordenar: ';

    const selectOrdenacao = document.createElement('select');
    selectOrdenacao.id = 'ordenacao-preco';

    const opcaoDefault = document.createElement('option');
    opcaoDefault.value = '';
    opcaoDefault.textContent = 'Ordenar pelo preço';
    selectOrdenacao.appendChild(opcaoDefault);

    const opcaoDesc = document.createElement('option');
    opcaoDesc.value = 'desc';
    opcaoDesc.textContent = 'Preço Decrescente';
    selectOrdenacao.appendChild(opcaoDesc);

    const opcaoAsc = document.createElement('option');
    opcaoAsc.value = 'asc';
    opcaoAsc.textContent = 'Preço Crescente';
    selectOrdenacao.appendChild(opcaoAsc);

    selectOrdenacao.addEventListener('change', () => {
        ordenacaoAtiva = selectOrdenacao.value;
        renderProdutosFiltrados();
    });

    const labelPesquisa = document.createElement('label');
    labelPesquisa.setAttribute('for', 'pesquisa-produto');
    labelPesquisa.textContent = ' Procurar: ';

    const inputPesquisa = document.createElement('input');
    inputPesquisa.type = 'search';
    inputPesquisa.id = 'pesquisa-produto';
    inputPesquisa.placeholder = 'pesquise por produto';

    inputPesquisa.addEventListener('input', () => {
        termoPesquisa = inputPesquisa.value.trim().toLowerCase();
        renderProdutosFiltrados();
    });

    barraFiltros.appendChild(labelCategoria);
    barraFiltros.appendChild(selectCategoria);
    barraFiltros.appendChild(labelOrdenacao);
    barraFiltros.appendChild(selectOrdenacao);
    barraFiltros.appendChild(labelPesquisa);
    barraFiltros.appendChild(inputPesquisa);

    carregarCategorias(selectCategoria);
}

async function carregarCategorias(select) {
    try {
        const resposta = await fetch(CATEGORIES_URL);
        if (!resposta.ok) {
            throw new Error(`Falha ao obter categorias: ${resposta.status}`);
        }

        const categorias = await resposta.json();
        categorias.forEach((categoria) => {
            const opcao = document.createElement('option');
            opcao.value = categoria;
            opcao.textContent = categoria;
            select.appendChild(opcao);
        });
    } catch (erro) {
        console.error(erro);
    }
}

async function carregarProdutosDaApi() {
    const container = document.querySelector('#lista-produtos');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    const indicador = document.createElement('p');
    indicador.className = 'loading';
    indicador.textContent = 'A carregar produtos...';
    container.appendChild(indicador);

    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
            throw new Error(`Falha ao obter produtos: ${resposta.status}`);
        }

        const lista = await resposta.json();
        produtosCache = Array.isArray(lista) ? lista : [];
        container.innerHTML = '';
        renderProdutosFiltrados();
    } catch (erro) {
        container.innerHTML = '';
        const mensagemErro = document.createElement('p');
        mensagemErro.className = 'erro';
        mensagemErro.textContent = 'Não foi possível carregar os produtos. Tente novamente mais tarde.';
        container.appendChild(mensagemErro);
        console.error(erro);
    }
}

function renderProdutosFiltrados() {
    const container = document.querySelector('#lista-produtos');
    if (!container) {
        return;
    }

    let lista = Array.isArray(produtosCache) ? [...produtosCache] : [];
    if (categoriaAtiva) {
        lista = lista.filter((produto) => produto.category === categoriaAtiva);
    }

    if (termoPesquisa) {
        lista = lista.filter((produto) => {
            const titulo = String(produto.title || '').toLowerCase();
            return titulo.includes(termoPesquisa);
        });
    }

    if (!Array.isArray(lista) || lista.length === 0) {
        container.innerHTML = '';
        container.setAttribute('role', 'list');
        const aviso = document.createElement('p');
        aviso.className = 'sem-resultados';
        aviso.textContent = 'Nenhum produto encontrado para este filtro.';
        container.appendChild(aviso);
        return;
    }

    if (ordenacaoAtiva === 'asc') {
        lista.sort((a, b) => {
            const precoA = Number(a.price) || 0;
            const precoB = Number(b.price) || 0;
            return precoA - precoB;
        });
    } else if (ordenacaoAtiva === 'desc') {
        lista.sort((a, b) => {
            const precoA = Number(a.price) || 0;
            const precoB = Number(b.price) || 0;
            return precoB - precoA;
        });
    }

    carregarProdutos(lista);
}

function renderCheckoutSection(cestoSec, total, lista) {
    const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
    const checkoutSec = document.createElement('section');
    checkoutSec.className = 'checkout';
    checkoutSec.setAttribute('aria-label', 'Secção de checkout');

    const totalEl = document.createElement('p');
    totalEl.className = 'checkout-total';
    const textoTotal = formatoEUR.format(total);
    totalEl.textContent = `Custo total: ${textoTotal}`;

    const estudanteWrap = document.createElement('label');
    estudanteWrap.htmlFor = 'checkout-estudante';
    estudanteWrap.textContent = 'És estudante do DEISI? ';

    const estudanteInput = document.createElement('input');
    estudanteInput.type = 'checkbox';
    estudanteInput.id = 'checkout-estudante';
    estudanteInput.checked = checkoutEstado.estudante;
    estudanteInput.addEventListener('change', () => {
        checkoutEstado.estudante = estudanteInput.checked;
    });
    estudanteWrap.appendChild(estudanteInput);

    const nomeLabel = document.createElement('label');
    nomeLabel.setAttribute('for', 'checkout-nome');
    nomeLabel.textContent = ' Nome: ';

    const nomeInput = document.createElement('input');
    nomeInput.type = 'text';
    nomeInput.id = 'checkout-nome';
    nomeInput.placeholder = 'o seu nome';
    nomeInput.value = checkoutEstado.nome;
    nomeInput.addEventListener('input', () => {
        checkoutEstado.nome = nomeInput.value;
    });

    const cupaoLabel = document.createElement('label');
    cupaoLabel.setAttribute('for', 'checkout-cupao');
    cupaoLabel.textContent = ' Cupão de desconto: ';

    const cupaoInput = document.createElement('input');
    cupaoInput.type = 'text';
    cupaoInput.id = 'checkout-cupao';
    cupaoInput.placeholder = 'ex.: black-friday';
    cupaoInput.value = checkoutEstado.cupao;
    cupaoInput.addEventListener('input', () => {
        checkoutEstado.cupao = cupaoInput.value;
    });

    const btnComprar = document.createElement('button');
    btnComprar.type = 'button';
    btnComprar.textContent = 'Comprar';
    btnComprar.disabled = lista.length === 0;

    const resultadoEl = document.createElement('p');
    resultadoEl.className = 'checkout-resultado';
    resultadoEl.textContent = checkoutEstado.mensagem;

    btnComprar.addEventListener('click', () => {
        processarCompra(lista, total, totalEl, resultadoEl, btnComprar);
    });

    checkoutSec.appendChild(totalEl);
    checkoutSec.appendChild(estudanteWrap);
    checkoutSec.appendChild(document.createElement('br'));
    checkoutSec.appendChild(nomeLabel);
    checkoutSec.appendChild(nomeInput);
    checkoutSec.appendChild(document.createElement('br'));
    checkoutSec.appendChild(cupaoLabel);
    checkoutSec.appendChild(cupaoInput);
    checkoutSec.appendChild(document.createElement('br'));
    checkoutSec.appendChild(btnComprar);
    checkoutSec.appendChild(resultadoEl);

    cestoSec.appendChild(checkoutSec);
}

async function processarCompra(lista, totalOriginal, totalEl, resultadoEl, botao) {
    if (!Array.isArray(lista) || lista.length === 0) {
        resultadoEl.textContent = 'Adicione produtos ao cesto antes de comprar.';
        checkoutEstado.mensagem = resultadoEl.textContent;
        return;
    }

    const produtosIds = lista.map((produto) => produto.id);
    const payload = {
        products: produtosIds,
        student: Boolean(checkoutEstado.estudante),
        coupon: checkoutEstado.cupao || '',
        name: checkoutEstado.nome || 'Cliente DEISI'
    };

    resultadoEl.textContent = 'A calcular o total...';
    checkoutEstado.mensagem = resultadoEl.textContent;
    botao.disabled = true;

    try {
        const resposta = await fetch(BUY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const dados = await resposta.json();
        if (!resposta.ok || dados.error) {
            const mensagemErro = dados?.error || 'Não foi possível concluir a compra.';
            resultadoEl.textContent = mensagemErro;
            checkoutEstado.mensagem = mensagemErro;
            return;
        }

        const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
        const totalOriginalTexto = formatoEUR.format(totalOriginal);
        const totalNumero = Number(dados.totalCost);
        const textoTotal = Number.isNaN(totalNumero) ? dados.totalCost : formatoEUR.format(totalNumero);
        totalEl.textContent = `Custo total: ${textoTotal}`;

        const houveDesconto = textoTotal !== totalOriginalTexto;
        let textoResultado = houveDesconto
            ? `Total com desconto: ${textoTotal} (antes ${totalOriginalTexto}).`
            : `Total final: ${textoTotal}.`;

        if (dados.reference) {
            textoResultado += ` Referência: ${dados.reference}.`;
        }

        if (dados.message) {
            textoResultado += ` ${dados.message}`;
        }

        resultadoEl.textContent = textoResultado;
        checkoutEstado.mensagem = textoResultado;

        // compra concluída, podemos limpar o cesto
        setCart([]);
        atualizaCesto();
        renderCestoCount();
    } catch (erro) {
        console.error(erro);
        const falha = 'Ocorreu um erro na ligação. Tente novamente.';
        resultadoEl.textContent = falha;
        checkoutEstado.mensagem = falha;
    } finally {
        botao.disabled = false;
    }
}


function carregarProdutos(lista) {
    const container = document.querySelector('#lista-produtos');
    if (!container || !Array.isArray(lista)) {
        return;
    }

    container.innerHTML = '';
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
    const rate = produto.rating?.rate ?? '?';
    const count = produto.rating?.count ?? 0;
    rating.textContent = `★ ${rate} (${count})`;

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
        renderCheckoutSection(cestoSec, 0, lista);
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

    renderCheckoutSection(cestoSec, total, lista);
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
