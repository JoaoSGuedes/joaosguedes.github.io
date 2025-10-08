// 1. Passa por aqui
const passa = document.querySelector('span:nth-of-type(1)');
let toggleOn = false;

passa.addEventListener('mouseenter', () => {
  toggleOn = !toggleOn;
  passa.style.color = toggleOn ? 'blue' : 'black';

  passa.addEventListener('mouseleave', () => {
  toggleOn = !toggleOn;
  passa.style.color = toggleOn ? 'blue' : 'black';
});
});


// 2. Pinta-me

/* Old
const paintText = document.getElementById('paintText');
const buttons = document.querySelectorAll('.btn');

buttons.forEach(btn => {
  btn.onclick = function() {
    paintText.style.color = btn.dataset.color;
  };
});
*/
document.querySelectorAll("button.btn").forEach((btn) => {
  btn.onclick = function() {
    paintText.style.color = btn.dataset.color;
  };
});




// 3. Experimenta escrever
const input = document.querySelector('.field');
const colors = ['red', 'green', 'blue', 'purple'];
let colorIndex = 0;

input.addEventListener('keydown', () => {
  input.style.backgroundColor = colors[colorIndex];
  colorIndex = (colorIndex + 1) % colors.length;
});


// 4. Escolha uma cor em inglês
/* OLD
const colorSelect = document.getElementById('colorSelect');

colorSelect.onchange = function() {
  const color = colorSelect.value;
  if (color) {
    document.body.style.backgroundColor = color;
  }
};*/
document.getElementById('colorSelect').onchange = function() {
  document.body.style.backgroundColor = this.value;
};



// 5. Conta!
const countBtn = document.getElementById('countBtn');
const countValue = document.getElementById('countValue');

if (!localStorage.getItem('counter')) {
  localStorage.setItem('counter', 0);
}
countValue.textContent = localStorage.getItem('counter');

countBtn.onclick = function() {
  let current = parseInt(localStorage.getItem('counter'), 10) || 0;
  current++;
  localStorage.setItem('counter', current);
  countValue.textContent = current;
};


// 6. Nome e idade
/* Old
const nameInput = document.getElementById('nameInput');
const ageInput = document.getElementById('ageInput');
const submitNameAge = document.getElementById('submitNameAge');

// Cria um elemento para mostrar a mensagem
let nameAgeMsg = document.getElementById('nameAgeMsg');
if (!nameAgeMsg) {
  nameAgeMsg = document.createElement('p');
  nameAgeMsg.id = 'nameAgeMsg';
  submitNameAge.parentNode.appendChild(nameAgeMsg);
}

submitNameAge.onclick = function() {
  const nome = nameInput.value.trim();
  const idade = ageInput.value.trim();
  if (nome && idade) {
    nameAgeMsg.textContent = `Olá, o/a ${nome} tem ${idade}!`;
  } else {
    nameAgeMsg.textContent = '';
  }
};*/

// 7. Automatic counter
const autoCountValue = document.querySelectorAll('#countValue')[1];
let autoCount = 0;

function count() {
  autoCount++;
  autoCountValue.textContent = autoCount;
}
setInterval(count, 1000);

// 6. Nome e idade (formulário)
const nameAgeForm = document.getElementById('nameAgeForm');
const nameInput = document.getElementById('nameInput');
const ageInput = document.getElementById('ageInput');
const nameAgeMsg = document.getElementById('nameAgeMsg');

nameAgeForm.onsubmit = function(e) {
  e.preventDefault();
  const nome = nameInput.value.trim();
  const idade = ageInput.value.trim();
  if (nome && idade) {
    nameAgeMsg.textContent = `Olá, o/a ${nome} tem ${idade}!`;
  } else {
    nameAgeMsg.textContent = '';
  }
};





/*

const produtos = document.querySelectorAll('[data-preco]');

let total = 0;

produtos.forEach(produto => {

  const preco = parseFloat(produto.dataset.preco);
  total += preco;
});

console.log("Preço total:", total.toFixed(2));
*/