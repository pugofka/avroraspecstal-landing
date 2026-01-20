document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth Reveal Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animate]').forEach(el => {
    revealObserver.observe(el);
  });

  // 2. Slider Functionality
  const initSlider = (container) => {
    const track = container.querySelector('.works-slider__track');
    const slides = Array.from(track.children);
    const nextBtn = container.querySelector('.slider-arrow.next');
    const prevBtn = container.querySelector('.slider-arrow.prev');
    const dotsContainer = container.querySelector('.works-slider__dots');

    let currentIndex = 0;

    const updateSlider = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dotsContainer.querySelectorAll('.works-slider__dot').forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentIndex);
      });
    };

    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'works-slider__dot';
      if (idx === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => {
        currentIndex = idx;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    });

    nextBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlider();
    });

    prevBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlider();
    });
  };

  document.querySelectorAll('.works-slider').forEach(initSlider);

  // 3. Modal Functionality
  const modal = document.querySelector('.work-modal');
  const modalImg = modal?.querySelector('.work-modal__media img');
  const modalTitle = modal?.querySelector('.work-modal__title');
  const modalDesc = modal?.querySelector('.work-modal__desc');

  const openModal = (card) => {
    if (!modal) return;
    modalImg.src = card.dataset.img;
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.desc;
    modal.style.display = 'grid';
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('is-open'), 10);
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 400);
  };

  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  document.querySelectorAll('[data-close="modal"]').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // 4. Phone Mask
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      if (!x[1] && x[2]) x[1] = '7';
      e.target.value = !x[2] ? x[1] ? '+' + x[1] : '' : '+' + x[1] + ' (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
    });
  }

  // 5. Mobile Menu
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  navToggle?.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-open');
    document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
  });

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // 6. Form Submission
  const leadForm = document.getElementById('leadForm');
  leadForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    const btn = leadForm.querySelector('button');
    
    btn.disabled = true;
    status.textContent = 'Отправка...';

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      status.textContent = 'Заявка отправлена! Мы свяжемся с вами.';
      status.style.color = 'var(--accent)';
      leadForm.reset();
    } catch (err) {
      status.textContent = 'Ошибка. Попробуйте еще раз.';
      status.style.color = '#ff4444';
    } finally {
      btn.disabled = false;
    }
  });
});
