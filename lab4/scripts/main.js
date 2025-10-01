(() => {
  const body = document.body;
  const header = document.querySelector('header');
  const headerTitle = document.querySelector('header h2');
  const hamburger = document.querySelector('.hamburguer');
  const infoSections = Array.from(document.querySelectorAll('.section-info'));
  const attractionItems = Array.from(document.querySelectorAll('.section-info ul li'));


//gerador de factos
  const funFacts = [
    'Sabias que é possível apanhar elétrico até ao Castelo? Aproveita a vista!',
    'O pastel de nata nasceu na zona de Belém — combina bem com um passeio pelo Tejo.',
    'Lisboa tem mais dias de sol por ano do que Atenas. Óculos de sol são essenciais!',
    'A Baixa Pombalina foi um dos primeiros exemplos de urbanismo anti-sísmico do mundo.',
    'O elevador de Santa Justa foi desenhado por um aprendiz de Gustave Eiffel.'
  ];

  const firstInfoSection = infoSections[0];
  if (firstInfoSection) {
    const factWrapper = document.createElement('div');
    factWrapper.style.marginTop = '16px';
    factWrapper.style.padding = '16px';
    factWrapper.style.borderRadius = '10px';
    factWrapper.style.background = 'rgba(255, 255, 255, 0.85)';
    factWrapper.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';

    const factTitle = document.createElement('p');
    factTitle.textContent = 'Facto aleatório sobre Lisboa:';
    factTitle.style.fontWeight = '600';
    factTitle.style.marginBottom = '8px';

    const factText = document.createElement('p');
    factText.textContent = 'Carrega no botão para descobrir algo giro.';
    factText.style.lineHeight = '1.5';

    const factButton = document.createElement('button');
    factButton.type = 'button';
    factButton.textContent = 'Gerar facto';
    factButton.style.marginTop = '12px';
    factButton.style.padding = '10px 16px';
    factButton.style.borderRadius = '999px';
    factButton.style.border = 'none';
    factButton.style.cursor = 'pointer';
    factButton.style.background = '#f3722c';
    factButton.style.color = '#fff';
    factButton.style.fontWeight = '600';
    factButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
    factButton.style.transition = 'transform 0.2s ease';

    let lastFactIndex = -1;
    let highlightTimer;

    const highlightRandomAttraction = () => {
      if (!attractionItems.length) {
        return;
      }

      const randomIndex = Math.floor(Math.random() * attractionItems.length);
      const randomItem = attractionItems[randomIndex];

      attractionItems.forEach((item) => {
        item.style.backgroundColor = '';
        item.style.fontWeight = '';
      });

      randomItem.style.backgroundColor = '#ffe066';
      randomItem.style.fontWeight = '600';

      clearTimeout(highlightTimer);
      highlightTimer = window.setTimeout(() => {
        randomItem.style.backgroundColor = '';
        randomItem.style.fontWeight = '';
      }, 1600);
    };

    factButton.addEventListener('mouseenter', () => {
      factButton.style.transform = 'scale(1.04)';
    });

    factButton.addEventListener('mouseleave', () => {
      factButton.style.transform = '';
    });

    factButton.addEventListener('click', () => {
      if (!funFacts.length) {
        return;
      }

      let nextIndex = Math.floor(Math.random() * funFacts.length);
      if (funFacts.length > 1) {
        while (nextIndex === lastFactIndex) {
          nextIndex = Math.floor(Math.random() * funFacts.length);
        }
      }
      lastFactIndex = nextIndex;

      factText.textContent = funFacts[nextIndex];
      factText.style.opacity = '0';
      factText.style.transition = 'opacity 0.3s ease';

      requestAnimationFrame(() => {
        factText.style.opacity = '1';
      });

      highlightRandomAttraction();
    });

    factWrapper.appendChild(factTitle);
    factWrapper.appendChild(factText);
    factWrapper.appendChild(factButton);
    firstInfoSection.appendChild(factWrapper);
  }


  if (hamburger) {
    const partyColors = ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    let partyIntervalId = null;
    let colorIndex = 0;
    let isPartyActive = false;

    const originalTitle = headerTitle ? headerTitle.textContent : '';
    const stopPartyMode = () => {
      if (!isPartyActive) {
        return;
      }

      window.clearInterval(partyIntervalId);
      partyIntervalId = null;
      isPartyActive = false;
      colorIndex = 0;
      body.style.backgroundColor = '';
      body.style.transition = '';

      if (header) {
        header.style.backgroundColor = '';
        header.style.transition = '';
      }

      if (headerTitle) {
        headerTitle.textContent = originalTitle;
      }

      hamburger.textContent = '\u2630';
      hamburger.style.transform = '';
      hamburger.style.transition = '';
      hamburger.setAttribute('aria-label', 'Ligar modo festa');
    };

    const startPartyMode = () => {
      if (isPartyActive) {
        return;
      }

      isPartyActive = true;
      body.style.transition = 'background-color 0.6s ease';
      if (header) {
        header.style.transition = 'background-color 0.6s ease';
      }

      hamburger.style.transition = 'transform 0.4s ease';
      hamburger.setAttribute('aria-label', 'Desligar modo festa');

      partyIntervalId = window.setInterval(() => {
        const color = partyColors[colorIndex % partyColors.length];
        const accentColor = partyColors[(colorIndex + 3) % partyColors.length];
        body.style.backgroundColor = color;
        if (header) {
          header.style.backgroundColor = accentColor;
        }
        if (headerTitle) {
          headerTitle.textContent = `Modo Festa \uD83C\uDF89 (${colorIndex + 1})`;
        }

        hamburger.style.transform = `rotate(${Math.sin(colorIndex) * 18}deg) scale(1.15)`;
        colorIndex += 1;
      }, 700);
    };

    hamburger.addEventListener('click', () => {
      if (isPartyActive) {
        stopPartyMode();
      } else {
        startPartyMode();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopPartyMode();
      }
    });
  }

  // --- Emoji confetti on double-click --------------------------------------
  if (infoSections.length) {
    const confettiEmojis = ['\u2728', '\uD83C\uDF8A', '\uD83C\uDF87', '\uD83C\uDF1F', '\uD83C\uDF82'];

    const launchEmojiConfetti = (x, y) => {
      const totalPieces = 14;

      for (let index = 0; index < totalPieces; index += 1) {
        const confettiPiece = document.createElement('span');
        confettiPiece.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
        confettiPiece.style.position = 'fixed';
        confettiPiece.style.left = `${x + Math.random() * 80 - 40}px`;
        confettiPiece.style.top = `${y + Math.random() * 40 - 20}px`;
        confettiPiece.style.fontSize = `${Math.random() * 16 + 16}px`;
        confettiPiece.style.transition = 'transform 0.9s ease, opacity 0.9s ease';
        confettiPiece.style.transform = 'translateY(0)';
        confettiPiece.style.opacity = '1';
        confettiPiece.style.pointerEvents = 'none';
        confettiPiece.style.zIndex = '2000';

        body.appendChild(confettiPiece);

        requestAnimationFrame(() => {
          const direction = Math.random() > 0.5 ? 1 : -1;
          const translateY = 60 + Math.random() * 60;
          const rotate = direction * (20 + Math.random() * 120);
          confettiPiece.style.transform = `translate(${direction * (10 + Math.random() * 30)}px, ${translateY}px) rotate(${rotate}deg)`;
          confettiPiece.style.opacity = '0';
        });

        window.setTimeout(() => confettiPiece.remove(), 900);
      }
    };

    infoSections.forEach((section) => {
      section.addEventListener('dblclick', (event) => {
        launchEmojiConfetti(event.clientX, event.clientY);
      });
    });
  }
})();
