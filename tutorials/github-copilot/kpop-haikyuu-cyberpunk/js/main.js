const toggleMode = document.getElementById('toggleMode');
const randomCard = document.getElementById('randomCard');
const intensity = document.getElementById('intensity');
const filter = document.getElementById('filter');
const themePicker = document.getElementById('theme');
const motionPicker = document.getElementById('motion');
const cards = Array.from(document.querySelectorAll('.card'));
const hero = document.querySelector('.hero');
const body = document.body;
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalRole = document.getElementById('modalRole');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementById('closeModal');

function applyGlow(value) {
  const opacity = value / 100;
  hero.style.boxShadow = `inset 0 0 ${20 + value / 2}px rgba(0, 229, 255, ${0.1 + opacity / 3}), 0 0 ${120 + value}px rgba(124, 104, 255, ${0.18 + opacity / 0.8})`;
  hero.style.background = `rgba(6, 8, 16, ${0.8 + opacity * 0.08})`;
}

function applyFilter(mode) {
  if (mode === 'glitch') {
    body.style.backgroundImage = 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 16px), linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%)';
  } else if (mode === 'grid') {
    body.style.backgroundImage = 'radial-gradient(circle at top left, rgba(var(--accent-2-rgb), 0.15), transparent 25%), radial-gradient(circle at 80% 10%, rgba(var(--accent-3-rgb), 0.16), transparent 20%), linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%)';
  } else {
    body.style.backgroundImage = 'radial-gradient(circle at top left, rgba(var(--accent-2-rgb), 0.15), transparent 25%), radial-gradient(circle at 80% 10%, rgba(var(--accent-3-rgb), 0.16), transparent 20%), linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%)';
  }
}

function applyTheme(theme) {
  body.classList.remove('theme-neon', 'theme-cyan', 'theme-purple', 'theme-pink');
  body.classList.add(`theme-${theme}`);
  applyFilter(filter.value);
}

function applyMotion(effect) {
  body.classList.remove('bg-motion-wave', 'bg-motion-blink');
  if (effect === 'wave') {
    body.classList.add('bg-motion-wave');
  } else if (effect === 'blink') {
    body.classList.add('bg-motion-blink');
  }
}

function showModal({ name, role, description, traits, imageSrc, imageAlt }) {
  modalTitle.textContent = name;
  modalRole.textContent = role || '';
  modalImage.src = imageSrc || '';
  modalImage.alt = imageAlt || `${name} portrait`;

  const traitHtml = traits.length ? `<br><br>${traits.map((trait) => `• ${trait}`).join('<br>')}` : '';
  modalContent.innerHTML = `${description}${traitHtml}`;
  modal.classList.remove('hidden');
}

function hideModal() {
  modal.classList.add('hidden');
}

cards.forEach((card) => {
  card.addEventListener('click', () => {
    cards.forEach((item) => item.classList.remove('card--active'));
    card.classList.add('card--active');

    const description = card.dataset.description || card.querySelector('.card__role')?.textContent || '';
    const traits = Array.from(card.querySelectorAll('.card__traits li')).map((item) => item.textContent.trim());
    const image = card.querySelector('.card__avatar img');

    showModal({
      name: card.dataset.name || 'Featured',
      role: card.dataset.role || '',
      description,
      traits,
      imageSrc: image?.getAttribute('src') || '',
      imageAlt: image?.alt || `${card.dataset.name || 'Featured'} portrait`,
    });
  });
});

toggleMode.addEventListener('click', () => {
  const active = body.classList.toggle('cyber-active');
  toggleMode.textContent = active ? 'Deactivate Cyber Glow' : 'Activate Cyber Glow';
  hero.classList.toggle('hero--active', active);
  if (active) {
    hero.style.background = 'rgba(10, 12, 22, 0.92)';
  } else {
    hero.style.background = 'rgba(6, 8, 16, 0.82)';
  }
});

randomCard.addEventListener('click', () => {
  const candidate = cards[Math.floor(Math.random() * cards.length)];
  candidate.click();
});

intensity.addEventListener('input', (event) => {
  applyGlow(event.target.value);
});

filter.addEventListener('change', (event) => {
  applyFilter(event.target.value);
});

themePicker.addEventListener('change', (event) => {
  applyTheme(event.target.value);
});

motionPicker.addEventListener('change', (event) => {
  applyMotion(event.target.value);
});

closeModal.addEventListener('click', hideModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) hideModal();
});

applyGlow(intensity.value);
applyTheme(themePicker.value);
applyMotion(motionPicker.value);
applyFilter(filter.value);
