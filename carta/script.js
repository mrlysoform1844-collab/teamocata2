// Mostrar / Ocultar la carta con animación typing línea por línea
const showLetterBtn = document.getElementById('showLetterBtn');
const letter = document.getElementById('letter');
const letterParagraphs = letter.querySelectorAll('p');
const openHeart = document.getElementById('openHeart');
const loveMusic = document.getElementById('loveMusic');

// Guardamos el texto original y limpiamos contenido
letterParagraphs.forEach(p => {
  p.dataset.text = p.textContent;
  p.textContent = '';
});

function typingEffectLineByLine(elements, speed = 40) {
  let index = 0;

  function typeParagraph(paragraph) {
    const text = paragraph.dataset.text;
    paragraph.textContent = '';
    let i = 0;

    return new Promise((resolve) => {
      function type() {
        if (i < text.length) {
          paragraph.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else {
          resolve();
        }
      }
      type();
    });
  }

  async function run() {
    for (; index < elements.length; index++) {
      await typeParagraph(elements[index]);
      await new Promise(r => setTimeout(r, 200));
    }
  }

  run();
}

showLetterBtn.addEventListener('click', () => {
  if (letter.classList.contains('hidden')) {
    // Animación corazón apertura SVG
    openHeart.classList.remove('hidden');
    openHeart.classList.add('animate');

    openHeart.addEventListener('animationend', () => {
      openHeart.classList.add('hidden');
      openHeart.classList.remove('animate');
      letter.classList.remove('hidden');
      showLetterBtn.textContent = 'Cerrar Carta ❌';
      typingEffectLineByLine(letterParagraphs);

      // Iniciar música (intentará reproducir)
      loveMusic.play().catch(() => {
        // Si no puede (por políticas de navegador), no hace nada.
      });
    }, { once: true });

  } else {
    letter.classList.add('hidden');
    showLetterBtn.textContent = 'Abrir Carta 💌';
    letterParagraphs.forEach(p => {
      p.textContent = '';
    });
    // Pausar música al cerrar
    loveMusic.pause();
    loveMusic.currentTime = 0;
  }
});

// Código Lightbox y corazones igual que antes...

// Lightbox para galería
const galleryImages = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('img');
const closeLightboxBtn = document.getElementById('closeLightbox');

galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.classList.remove('hidden');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  });
  img.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      img.click();
    }
  });
});

closeLightboxBtn.addEventListener('click', () => {
  lightbox.classList.add('hidden');
  lightboxImg.src = '';
  lightboxImg.alt = '';
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
    closeLightboxBtn.click();
  }
});

// Corazones mejorados con canvas
const canvas = document.getElementById('heartsCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let hearts = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Heart {
  constructor() {
    this.x = Math.random() * width;
    this.y = height + 20;
    this.size = Math.random() * 15 + 10;
    this.speed = Math.random() * 1 + 0.5;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.02;
    this.alpha = 1;
    this.color = `hsl(${340 + Math.random() * 20}, 90%, 70%)`;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.alpha;

    // Dibujar forma de corazón
    ctx.fillStyle = this.color;
    ctx.beginPath();
    const topCurveHeight = this.size * 0.3;
    ctx.moveTo(0, this.size / 4);
    ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
    ctx.bezierCurveTo(-this.size / 2, this.size / 2, 0, this.size * 0.75, 0, this.size);
    ctx.bezierCurveTo(0, this.size * 0.75, this.size / 2, this.size / 2, this.size / 2, topCurveHeight);
    ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, this.size / 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  update() {
    this.y -= this.speed;
    this.angle += this.spin;
    this.alpha -= 0.005;
    if (this.alpha <= 0) {
      this.reset();
    }
  }

  reset() {
    this.x = Math.random() * width;
    this.y = height + 20;
    this.size = Math.random() * 15 + 10;
    this.speed = Math.random() * 1 + 0.5;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.02;
    this.alpha = 1;
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  if (hearts.length < 40) {
    hearts.push(new Heart());
  }

  hearts.forEach(heart => {
    heart.update();
    heart.draw();
  });

  requestAnimationFrame(animate);
}

animate();
