document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#lista-produtos');
  if (!container || !Array.isArray(produtos)) {
    return;
  }

  const formatoEUR = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });


  // Criar elementos para cada produto
  produtos.forEach((p) => {
    const artigo = document.createElement('article');
    artigo.className = 'produto';
    artigo.setAttribute('role', 'listitem');
    artigo.dataset.id = String(p.id);

    const img = document.createElement('img');
    img.src = p.image;
    img.alt = `${p.title} — categoria: ${p.category}`;

    const h3 = document.createElement('h3');
    h3.textContent = p.title;

    const descr = document.createElement('p');
    descr.className = 'descricao';
    descr.textContent = p.description;

    const preco = document.createElement('p');
    preco.className = 'preco';
    preco.dataset.preco = String(p.price);
    preco.textContent = formatoEUR.format(p.price);

    const rating = document.createElement('p');
    rating.className = 'rating';
    rating.textContent = `★ ${p.rating.rate} (${p.rating.count})`;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Adicionar ao cesto';
    btn.ariaLabel = `Adicionar "${p.title}" ao cesto`;
    btn.addEventListener('click', () => {
      const evt = new CustomEvent('adicionar-ao-cesto', { detail: { produto: p } });
      window.dispatchEvent(evt);
    });

    artigo.appendChild(img);
    artigo.appendChild(h3);
    artigo.appendChild(descr);
    artigo.appendChild(preco);
    artigo.appendChild(rating);
    artigo.appendChild(btn);

    container.appendChild(artigo);
  });
});