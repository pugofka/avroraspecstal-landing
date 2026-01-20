const form = document.getElementById('leadForm');
const statusEl = document.getElementById('formStatus');
const phoneInput = document.getElementById('phone');
const endpoint = 'https://formsubmit.co/ajax/105@td-avrora.ru';

const setStatus = (message, tone = 'neutral') => {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = tone === 'success' ? '#7CFF9C' : tone === 'error' ? '#ff9c45' : '#b5b6bb';
};

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    setStatus('Отправляем...', 'neutral');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed');
      setStatus('Заявка отправлена.', 'success');
      form.reset();
    } catch (error) {
      setStatus('Ошибка. Попробуйте еще раз.', 'error');
    }
  });
}

// Phone Mask
if (phoneInput) {
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').replace(/^8/, '7');
    const normalized = digits.startsWith('7') ? digits : `7${digits}`;
    const trimmed = normalized.slice(0, 11).split('');
    let out = '+7';
    if (trimmed.length > 1) out += ` (${trimmed.slice(1, 4).join('')}`;
    if (trimmed.length > 4) out += `) ${trimmed.slice(4, 7).join('')}`;
    if (trimmed.length > 7) out += `-${trimmed.slice(7, 9).join('')}`;
    if (trimmed.length > 9) out += `-${trimmed.slice(9, 11).join('')}`;
    return out;
  };

  phoneInput.addEventListener('input', () => {
    phoneInput.value = formatPhone(phoneInput.value);
  });
  phoneInput.addEventListener('focus', () => {
    if (!phoneInput.value.trim()) phoneInput.value = '+7 ';
  });
}

// Mobile Menu
const mobileMenu = document.getElementById('mobileMenu');
const navToggle = document.querySelector('.nav-toggle');
const mobileClose = document.querySelector('.mobile-menu__close');

const toggleMenu = (open) => {
  mobileMenu.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
};

navToggle?.addEventListener('click', () => toggleMenu(true));
mobileClose?.addEventListener('click', () => toggleMenu(false));
mobileMenu?.querySelectorAll('a').forEach(l => l.addEventListener('click', () => toggleMenu(false)));

// Slider
const initSlider = (sliderEl) => {
  const track = sliderEl.querySelector('.works-slider__track');
  const slides = Array.from(track?.children || []);
  const dotsContainer = sliderEl.querySelector('.works-slider__dots');
  const prevBtn = sliderEl.querySelector('.works-slider__btn--prev');
  const nextBtn = sliderEl.querySelector('.works-slider__btn--next');

  if (!track || slides.length === 0) return;

  let index = 0;

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsContainer.querySelectorAll('.works-slider__dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
    });
  };

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'works-slider__dot';
    dot.addEventListener('click', () => {
      index = i;
      update();
    });
    dotsContainer.appendChild(dot);
  });

  prevBtn?.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  });

  nextBtn?.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    update();
  });

  update();
};

document.querySelectorAll('.works-slider').forEach(initSlider);

// Modal
const modalEl = document.querySelector('.work-modal');
const modalImg = modalEl?.querySelector('img');
const modalTitle = modalEl?.querySelector('.work-modal__title');
const modalDesc = modalEl?.querySelector('.work-modal__desc');

const openModal = (card) => {
  if (!modalEl) return;
  modalImg.src = card.dataset.img;
  modalTitle.textContent = card.dataset.title;
  modalDesc.textContent = card.dataset.desc;
  modalEl.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modalEl?.classList.remove('is-open');
  document.body.style.overflow = '';
};

document.addEventListener('click', (e) => {
  const card = e.target.closest('.work-card');
  if (card && (e.target.closest('.work-card__media') || e.target.closest('.btn'))) {
    openModal(card);
  }
  if (e.target.dataset.close === 'modal') closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
