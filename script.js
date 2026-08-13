document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     PAGE FADE IN
  ========================================================= */
  document.body.classList.add('loaded');

  /* =========================================================
     PRELOADER
  ========================================================= */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hide'), 900);
    });
    // Fallback in case the load event already fired or takes too long
    setTimeout(() => preloader.classList.add('hide'), 2500);
  }

  /* =========================================================
     FOOTER YEAR
  ========================================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navYearEl = document.getElementById('navYear');
  if (navYearEl) navYearEl.textContent = new Date().getFullYear();

  /* =========================================================
     HEADER SCROLL STATE + BACK TO TOP
  ========================================================= */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('show', window.scrollY > 400);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================================
     MOBILE MENU
  ========================================================= */
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');
  const navOverlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');

  function closeMenu() {
    navbar.classList.remove('active');
    navOverlay.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  function openMenu() {
    navbar.classList.add('active');
    navOverlay.classList.add('active');
    menuToggle.classList.add('active');
    document.body.classList.add('menu-open');
  }

  menuToggle.addEventListener('click', () => {
    navbar.classList.contains('active') ? closeMenu() : openMenu();
  });

  navOverlay.addEventListener('click', closeMenu);
  if (navClose) navClose.addEventListener('click', closeMenu);

  const navLinks = document.querySelectorAll('.navbar a');
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* =========================================================
     SCROLLSPY - highlight active nav link while scrolling
  ========================================================= */
  const sections = document.querySelectorAll('section[id]');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => spyObserver.observe(sec));

  /* =========================================================
     SKILL CARDS SCROLL REVEAL
  ========================================================= */
  const skillBoxes = document.querySelectorAll('.skill-box');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('show'), i * 120);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  skillBoxes.forEach(box => skillObserver.observe(box));

  /* =========================================================
     DOWNLOAD CV - 3D TILT EFFECT
  ========================================================= */
  const cvBtn = document.querySelector('.header-actions .btn');
  if (cvBtn) {
    cvBtn.addEventListener('mousemove', (e) => {
      const rect = cvBtn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
      cvBtn.style.transform = `perspective(300px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`;
    });

    cvBtn.addEventListener('mouseleave', () => {
      cvBtn.style.transform = '';
    });

    const cvLabel = cvBtn.querySelector('.btn-label');
    const cvOriginalHTML = cvLabel ? cvLabel.innerHTML : 'Download CV';
    let cvResetTimer = null;

    cvBtn.addEventListener('click', (e) => {
      // Ripple burst from the click point (purely visual, doesn't block the download)
      const rect = cvBtn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      cvBtn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);

      // Brief "Downloaded" confirmation state
      if (cvLabel) {
        clearTimeout(cvResetTimer);
        cvBtn.classList.add('success');
        cvLabel.innerHTML = "<i class='bx bx-check'></i> Downloaded!";
        cvResetTimer = setTimeout(() => {
          cvBtn.classList.remove('success');
          cvLabel.innerHTML = cvOriginalHTML;
        }, 1800);
      }
    });
  }

  /* =========================================================
     PROJECT FILTERS + VIEW MORE / SHOW LESS
  ========================================================= */
  const filterButtons = document.querySelectorAll('.filters button');
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const viewMoreWrap = document.getElementById('viewMoreWrap');
  const viewMoreBtn = document.getElementById('viewMoreBtn');
  const projectsContainer = document.getElementById('projectsContainer');

  const INITIAL_VISIBLE = 3;
  let currentFilter = 'all';
  let showAllProjects = false;

  function renderProjects() {
    const matching = projectCards.filter(
      card => currentFilter === 'all' || card.getAttribute('data-category') === currentFilter
    );

    projectCards.forEach(card => { card.style.display = 'none'; });

    if (currentFilter === 'all' && !showAllProjects) {
      matching.forEach((card, i) => {
        card.style.display = i < INITIAL_VISIBLE ? 'block' : 'none';
      });
    } else {
      matching.forEach(card => { card.style.display = 'block'; });
    }

    const canToggle = currentFilter === 'all' && matching.length > INITIAL_VISIBLE;
    viewMoreWrap.style.display = canToggle ? 'block' : 'none';

    if (canToggle) {
      viewMoreBtn.innerHTML = showAllProjects
        ? "Show Less <i class='bx bx-up-arrow-alt'></i>"
        : "View More Projects <i class='bx bx-right-arrow-alt'></i>";
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      showAllProjects = false;
      renderProjects();
    });
  });

  viewMoreBtn.addEventListener('click', () => {
    showAllProjects = !showAllProjects;
    renderProjects();

    if (!showAllProjects) {
      projectsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  renderProjects();

  /* =========================================================
     CERTIFICATE SCROLL REVEAL
  ========================================================= */
  const certCards = document.querySelectorAll('.certificate-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.2 });

  certCards.forEach(card => revealObserver.observe(card));

  certCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
  });

  /* =========================================================
     CERTIFICATE MODAL (with prev / next)
  ========================================================= */
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const closeModalBtn = document.getElementById('closeCertModal');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const viewButtons = document.querySelectorAll('.view-btn');

  const certificates = Array.from(viewButtons).map(btn => ({
    title: btn.getAttribute('data-title'),
    image: btn.getAttribute('data-image')
  }));

  let currentCertIndex = 0;

  function openModal(index) {
    currentCertIndex = index;
    const cert = certificates[currentCertIndex];
    if (!cert) return;
    modalImg.src = cert.image;
    modalImg.alt = cert.title;
    modalTitle.textContent = cert.title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextCert() {
    currentCertIndex = (currentCertIndex + 1) % certificates.length;
    openModal(currentCertIndex);
  }

  function showPrevCert() {
    currentCertIndex = (currentCertIndex - 1 + certificates.length) % certificates.length;
    openModal(currentCertIndex);
  }

  viewButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => openModal(index));
  });

  document.querySelectorAll('.certificate-image img').forEach((img, index) => {
    img.addEventListener('click', () => openModal(index));
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeCertModal);
  if (nextBtn) nextBtn.addEventListener('click', showNextCert);
  if (prevBtn) prevBtn.addEventListener('click', showPrevCert);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCertModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeCertModal();
    if (e.key === 'ArrowRight') showNextCert();
    if (e.key === 'ArrowLeft') showPrevCert();
  });

  /* =========================================================
     PROJECT DETAIL MODAL
  ========================================================= */
  const projectModal = document.getElementById('projectModal');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalImage = document.getElementById('projectModalImage');
  const projectModalDesc = document.getElementById('projectModalDesc');
  const projectModalTech = document.getElementById('projectModalTech');
  const projectModalBadge = document.getElementById('projectModalBadge');
  const projectModalLink = document.getElementById('projectModalLink');
  const closeProjectModalBtn = document.getElementById('closeProjectModal');

  function openProjectModal(card) {
    const img = card.querySelector('img');
    const title = card.querySelector('h3')?.textContent || '';
    const desc = card.querySelector('.content p')?.textContent || '';
    const tech = card.querySelector('.tech')?.textContent || '';
    const badge = card.querySelector('.badge')?.textContent || '';
    const link = card.querySelector('.view-project-btn')?.getAttribute('data-link') || '';

    projectModalTitle.textContent = title;
    projectModalImage.src = img ? img.src : '';
    projectModalImage.alt = title;
    projectModalDesc.textContent = desc;
    projectModalTech.textContent = tech;
    projectModalBadge.textContent = badge;

    if (link) {
      projectModalLink.href = link;
      projectModalLink.style.display = 'inline-flex';
    } else {
      projectModalLink.style.display = 'none';
    }

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', () => openProjectModal(btn.closest('.project-card')));
  });

  document.querySelectorAll('.project-card .img-box img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openProjectModal(img.closest('.project-card')));
  });

  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);

  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) closeProjectModal();
  });

  /* =========================================================
     CONTACT FORM VALIDATION
  ========================================================= */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (form) {
    const fields = {
      name: {
        el: document.getElementById('name'),
        errorEl: document.getElementById('nameError'),
        validate(value) {
          const v = value.trim();
          if (!v) return 'Please enter your name.';
          if (v.length < 2) return 'Name should be at least 2 characters.';
          if (!/^[A-Za-z\s.'-]+$/.test(v)) return 'Name can only contain letters.';
          return '';
        }
      },
      email: {
        el: document.getElementById('email'),
        errorEl: document.getElementById('emailError'),
        validate(value) {
          const v = value.trim();
          if (!v) return 'Please enter your email.';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
          return '';
        }
      },
      subject: {
        el: document.getElementById('subject'),
        errorEl: document.getElementById('subjectError'),
        validate(value) {
          const v = value.trim();
          if (!v) return 'Please enter a subject.';
          if (v.length < 3) return 'Subject should be at least 3 characters.';
          return '';
        }
      },
      message: {
        el: document.getElementById('message'),
        errorEl: document.getElementById('messageError'),
        validate(value) {
          const v = value.trim();
          if (!v) return 'Please write a message.';
          if (v.length < 10) return 'Message should be at least 10 characters.';
          if (v.length > 500) return 'Message should not exceed 500 characters.';
          return '';
        }
      }
    };

    function validateField(key) {
      const field = fields[key];
      const errorText = field.validate(field.el.value);
      field.errorEl.textContent = errorText;
      field.el.closest('.input-box').classList.toggle('error', Boolean(errorText));
      return !errorText;
    }

    Object.keys(fields).forEach(key => {
      const field = fields[key];
      field.el.addEventListener('blur', () => validateField(key));
      field.el.addEventListener('input', () => {
        if (field.el.closest('.input-box').classList.contains('error')) {
          validateField(key);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      Object.keys(fields).forEach(key => {
        if (!validateField(key)) isValid = false;
      });

      if (!isValid) {
        formStatus.textContent = 'Please fix the errors above before sending.';
        formStatus.className = 'form-status error';
        const firstError = form.querySelector('.input-box.error input, .input-box.error textarea');
        if (firstError) firstError.focus();
        return;
      }

      const sendBtn = form.querySelector('.send-btn');
      const originalHTML = sendBtn.innerHTML;
      sendBtn.disabled = true;
      sendBtn.innerHTML = '<span>Sending...</span>';

      // Sends the message to your inbox via Formspree (no backend needed).
      // Setup (one-time, ~2 minutes):
      //   1. Go to https://formspree.io and sign up free.
      //   2. Create a new form, copy its endpoint (looks like
      //      "https://formspree.io/f/xxxxxxxx").
      //   3. Paste that URL below, replacing FORM_ENDPOINT's value.
      //   4. Submit the form once yourself - Formspree emails you a
      //      confirmation link the first time, click it to activate delivery.
      const FORM_ENDPOINT = 'https://formspree.io/f/xnjkyyej';

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(response => {
          if (response.ok) {
            formStatus.textContent = "✅ Message sent successfully! I'll get back to you soon.";
            formStatus.className = 'form-status success';
            form.reset();
            Object.keys(fields).forEach(key => {
              fields[key].errorEl.textContent = '';
              fields[key].el.closest('.input-box').classList.remove('error');
            });
          } else {
            formStatus.textContent = '❌ Something went wrong. Please try again or email me directly.';
            formStatus.className = 'form-status error';
          }
        })
        .catch(() => {
          formStatus.textContent = '❌ Could not send right now. Please check your connection and try again.';
          formStatus.className = 'form-status error';
        })
        .finally(() => {
          sendBtn.disabled = false;
          sendBtn.innerHTML = originalHTML;
        });
    });
  }

});