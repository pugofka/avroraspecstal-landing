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

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const fileInput = form.file;
    const formData = new FormData(form);

    setStatus('Отправляем заявку...', 'neutral');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setStatus('Заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
      form.reset();
    } catch (error) {
      const fallbackBody = [
        'Заявка с лендинга ЗМК «Аврора»',
        `Имя: ${name}`,
        `Телефон: ${phone}`,
        `Email: ${email}`,
        `Комментарий: ${message || '—'}`,
        fileInput?.files?.length ? `Файл: ${Array.from(fileInput.files).map(f => f.name).join(', ')}` : 'Файл: не приложен'
      ].join('\n');

      const mailto = `mailto:105@td-avrora.ru?subject=${encodeURIComponent('Заявка ЗМК «Аврора»')}&body=${encodeURIComponent(fallbackBody)}`;
      window.location.href = mailto;
      setStatus('Не удалось отправить автоматически. Мы открыли ваш почтовый клиент — прикрепите файл и отправьте письмо.', 'error');
    }
  });
}

// Smooth scroll for in-page anchors in browsers without native support
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href') || '';
    if (targetId.length <= 1) return;
    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

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

  const handleInput = () => {
    phoneInput.value = formatPhone(phoneInput.value);
  };

  const handleFocus = () => {
    if (!phoneInput.value.trim()) {
      phoneInput.value = '+7 ';
    }
  };

  const handleBlur = () => {
    const digits = phoneInput.value.replace(/\D/g, '');
    if (digits.length <= 1) {
      phoneInput.value = '';
    } else {
      phoneInput.value = formatPhone(phoneInput.value);
    }
  };

  phoneInput.addEventListener('input', handleInput);
  phoneInput.addEventListener('focus', handleFocus);
  phoneInput.addEventListener('blur', handleBlur);
  phoneInput.addEventListener('keydown', (event) => {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowed.includes(event.key)) return;
    if (event.ctrlKey || event.metaKey) return;
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  });
}

const initSlider = (sliderEl) => {
  const viewport = sliderEl.querySelector('.works-slider__viewport');
  const track = sliderEl.querySelector('.works-slider__track');
  let slides = Array.from(track?.children || []);
  const dotsContainer = sliderEl.querySelector('.works-slider__dots');
  const prevBtn = sliderEl.querySelector('.works-slider__btn--prev');
  const nextBtn = sliderEl.querySelector('.works-slider__btn--next');

  if (!viewport || !track || !dotsContainer || !prevBtn || !nextBtn || slides.length === 0) {
    return;
  }

  const getSlidesPerView = () => {
    const w = window.innerWidth;
    if (w >= 1400) return 5;
    if (w >= 1100) return 4;
    if (w >= 768) return 3;
    return 1;
  };

  let pageIndex = 0;
  let dots = [];
  let slidesPerView = getSlidesPerView();

  const padSlides = () => {
    const remainder = slides.length % slidesPerView;
    if (remainder === 0) return;
    const need = slidesPerView - remainder;
    for (let i = 0; i < need; i += 1) {
      const clone = slides[i % slides.length].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
    slides = Array.from(track.children);
  };

  const update = () => {
    slides.forEach((slide) => {
      slide.style.minWidth = `${100 / slidesPerView}%`;
      slide.style.maxWidth = `${100 / slidesPerView}%`;
    });

    const pagesCount = Math.max(1, Math.ceil(slides.length / slidesPerView));
    pageIndex = Math.min(pageIndex, pagesCount - 1);

    const slideWidth = viewport.clientWidth / slidesPerView;
    track.style.transform = `translateX(-${pageIndex * slideWidth * slidesPerView}px)`;
    slides.forEach((slide, slideIdx) => {
      const visible = slideIdx >= pageIndex * slidesPerView && slideIdx < (pageIndex + 1) * slidesPerView;
      slide.setAttribute('aria-hidden', !visible);
    });
    dots.forEach((dot, dotIdx) => dot.classList.toggle('is-active', dotIdx === pageIndex));
  };

  const rebuildDots = () => {
    dotsContainer.innerHTML = '';
    const pages = Math.ceil(slides.length / slidesPerView);
    dots = Array.from({ length: pages }).map((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'works-slider__dot';
      dot.setAttribute('aria-label', `Показать работы ${idx + 1}`);
      dot.addEventListener('click', () => goTo(idx));
      dotsContainer.appendChild(dot);
      return dot;
    });
  };

  const goTo = (targetIndex) => {
    const pagesCount = Math.max(1, Math.ceil(slides.length / slidesPerView));
    pageIndex = (targetIndex + pagesCount) % pagesCount;
    update();
  };

  prevBtn.addEventListener('click', () => goTo(pageIndex - 1));
  nextBtn.addEventListener('click', () => goTo(pageIndex + 1));
  window.addEventListener('resize', () => {
    slidesPerView = getSlidesPerView();
    padSlides();
    rebuildDots();
    update();
  });

  padSlides();
  rebuildDots();
  goTo(0);
};

document.querySelectorAll('[data-slider="portfolio"]').forEach(initSlider);

const modalEl = document.querySelector('.work-modal');
const modalImg = modalEl?.querySelector('img');
const modalTitle = modalEl?.querySelector('.work-modal__title');
const modalDesc = modalEl?.querySelector('.work-modal__desc');

const openModal = (title, desc, imgSrc, imgAlt) => {
  if (!modalEl || !modalImg || !modalTitle || !modalDesc) return;
  modalImg.src = imgSrc;
  modalImg.alt = imgAlt || title || '';
  modalTitle.textContent = title || '';
  modalDesc.textContent = desc || '';
  modalEl.classList.add('is-open');
  modalEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  if (!modalEl) return;
  modalEl.classList.remove('is-open');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

modalEl?.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.dataset.close === 'modal') {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

document.addEventListener('click', (event) => {
  const media = event.target instanceof Element ? event.target.closest('.work-card__media') : null;
  if (!media) return;
  const card = media.closest('.work-card');
  if (!card) return;
  const title = card.getAttribute('data-title') || '';
  const desc = card.getAttribute('data-desc') || '';
  const imgSrc = card.getAttribute('data-img') || '';
  const imgAlt = media.querySelector('img')?.alt || title;
  openModal(title, desc, imgSrc, imgAlt);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const media = event.target instanceof Element ? event.target.closest('.work-card__media') : null;
  if (!media) return;
  event.preventDefault();
  media.click();
});

