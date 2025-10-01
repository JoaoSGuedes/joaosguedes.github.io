(() => {
  const body = document.body;
  const header = document.querySelector('header');
  const headerTitle = document.querySelector('[data-header-title]');
  const partyToggle = document.getElementById('party-toggle');
  const factText = document.getElementById('fact-text');
  const attractions = Array.from(document.querySelectorAll('[data-attraction-item]'));
  const counterValue = document.getElementById('counter-value');
  const pointerTracker = document.getElementById('pointer-tracker');
  const confettiPieces = Array.from(document.querySelectorAll('[data-confetti]'));

  const funFacts = [
    'Sabias que é possível apanhar elétrico até ao Castelo? Aproveita a vista!',
    'O pastel de nata nasceu na zona de Belém — combina bem com um passeio pelo Tejo.',
    'Lisboa tem mais dias de sol por ano do que Atenas. Óculos de sol são essenciais!',
    'A Baixa Pombalina foi um dos primeiros exemplos de urbanismo anti-sísmico do mundo.',
    'O elevador de Santa Justa foi desenhado por um aprendiz de Gustave Eiffel.'
  ];

  const partyColors = ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
  const confettiEmojis = ['\u2728', '\uD83C\uDF8A', '\uD83C\uDF87', '\uD83C\uDF1F', '\uD83C\uDF82'];

  let lastFactIndex = -1;
  let highlightTimerId;
  let counter = 0;
  let partyIntervalId = null;
  let colorIndex = 0;
  let isPartyActive = false;
  let confettiCursor = 0;

  const originalTitle = headerTitle ? headerTitle.textContent : '';
  const originalToggleLabel = partyToggle ? partyToggle.textContent : '';

  const highlightRandomAttraction = () => {
    if (!attractions.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * attractions.length);
    const randomItem = attractions[randomIndex];

    attractions.forEach((item) => {
      item.style.backgroundColor = '';
      item.style.transform = '';
      item.style.fontWeight = '';
    });

    randomItem.style.backgroundColor = '#ffe066';
    randomItem.style.transform = 'scale(1.03)';
    randomItem.style.fontWeight = '600';

    window.clearTimeout(highlightTimerId);
    highlightTimerId = window.setTimeout(() => {
      randomItem.style.backgroundColor = '';
      randomItem.style.transform = '';
      randomItem.style.fontWeight = '';
    }, 1600);
  };

  const showRandomFact = () => {
    if (!factText || !funFacts.length) {
      return;
    }

    let nextIndex = Math.floor(Math.random() * funFacts.length);
    if (funFacts.length > 1) {
      while (nextIndex === lastFactIndex) {
        nextIndex = Math.floor(Math.random() * funFacts.length);
      }
    }
    lastFactIndex = nextIndex;

    factText.style.opacity = '0';
    factText.style.transition = 'opacity 0.3s ease';
    window.requestAnimationFrame(() => {
      factText.textContent = funFacts[nextIndex];
      factText.style.opacity = '1';
    });

    highlightRandomAttraction();
  };

  const emphasizeButton = (button) => {
    if (!button) {
      return;
    }
    button.style.transform = 'scale(1.08)';
    button.style.boxShadow = '0 16px 28px rgba(0, 0, 0, 0.3)';
  };

  const normalizeButton = (button) => {
    if (!button) {
      return;
    }
    button.style.transform = '';
    button.style.boxShadow = '';
  };

  const stopPartyMode = () => {
    if (!isPartyActive) {
      return;
    }

    window.clearInterval(partyIntervalId);
    partyIntervalId = null;
    isPartyActive = false;
    colorIndex = 0;

    if (body) {
      body.style.backgroundColor = '';
      body.style.transition = '';
    }
    if (header) {
      header.style.backgroundColor = '';
      header.style.transition = '';
    }
    if (headerTitle) {
      headerTitle.textContent = originalTitle;
    }
    if (partyToggle) {
      partyToggle.textContent = originalToggleLabel || '\u2630';
      partyToggle.style.transform = '';
      partyToggle.setAttribute('aria-label', 'Ativar modo festa');
    }
  };

  const startPartyMode = () => {
    if (isPartyActive) {
      return;
    }

    isPartyActive = true;
    if (body) {
      body.style.transition = 'background-color 0.6s ease';
    }
    if (header) {
      header.style.transition = 'background-color 0.6s ease';
    }
    if (partyToggle) {
      partyToggle.setAttribute('aria-label', 'Desligar modo festa');
    }

    partyIntervalId = window.setInterval(() => {
      const color = partyColors[colorIndex % partyColors.length];
      const accentColor = partyColors[(colorIndex + 3) % partyColors.length];

      if (body) {
        body.style.backgroundColor = color;
      }
      if (header) {
        header.style.backgroundColor = accentColor;
      }
      if (headerTitle) {
        headerTitle.textContent = `Modo Festa \uD83C\uDF89 (${colorIndex + 1})`;
      }
      if (partyToggle) {
        partyToggle.textContent = '\uD83C\uDF89';
        partyToggle.style.transform = `rotate(${Math.sin(colorIndex) * 18}deg) scale(1.15)`;
      }

      colorIndex += 1;
    }, 700);
  };

  const togglePartyMode = () => {
    if (isPartyActive) {
      stopPartyMode();
    } else {
      startPartyMode();
    }
  };

  const updatePointerTracker = (event) => {
    if (!pointerTracker) {
      return;
    }

    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const bounds = target.getBoundingClientRect();
    const x = Math.round(event.clientX - bounds.left);
    const y = Math.round(event.clientY - bounds.top);
    pointerTracker.textContent = `Coordenadas mágicas: ${x}px, ${y}px`;
  };

  const clearPointerTracker = () => {
    if (!pointerTracker) {
      return;
    }
    pointerTracker.textContent = 'Move o rato por aqui para veres as coordenadas mágicas.';
  };

  const incrementCounter = () => {
    if (!counterValue) {
      return;
    }

    counter += 1;
    counterValue.textContent = String(counter);
    counterValue.style.transform = 'scale(1.14)';
    counterValue.style.transition = 'transform 0.2s ease';

    window.setTimeout(() => {
      counterValue.style.transform = '';
    }, 220);
  };

  const resetCounter = () => {
    if (!counterValue) {
      return;
    }
    counter = 0;
    counterValue.textContent = '0';
    counterValue.style.transform = 'scale(1)';
  };

  const triggerConfetti = (event) => {
    if (!confettiPieces.length) {
      return;
    }

    const piecesToUse = Math.min(12, confettiPieces.length);

    for (let index = 0; index < piecesToUse; index += 1) {
      const piece = confettiPieces[(confettiCursor + index) % confettiPieces.length];
      const emoji = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];

      piece.textContent = emoji;
      piece.style.left = `${event.clientX + Math.random() * 80 - 40}px`;
      piece.style.top = `${event.clientY + Math.random() * 40 - 20}px`;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const translateX = direction * (10 + Math.random() * 30);
      const translateY = 60 + Math.random() * 60;
      const rotate = direction * (20 + Math.random() * 120);

      piece.style.transition = 'none';
      piece.style.transform = 'translate(0, 0) rotate(0deg)';
      piece.style.opacity = '1';

      window.requestAnimationFrame(() => {
        piece.style.transition = 'transform 0.9s ease, opacity 0.9s ease';
        piece.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
        piece.style.opacity = '0';
      });
    }

    confettiCursor = (confettiCursor + piecesToUse) % confettiPieces.length;
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopPartyMode();
    }
  });

  window.showRandomFact = showRandomFact;
  window.emphasizeButton = emphasizeButton;
  window.normalizeButton = normalizeButton;
  window.togglePartyMode = togglePartyMode;
  window.updatePointerTracker = updatePointerTracker;
  window.clearPointerTracker = clearPointerTracker;
  window.incrementCounter = incrementCounter;
  window.resetCounter = resetCounter;
  window.triggerConfetti = triggerConfetti;
})();
