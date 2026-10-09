document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     BODY SCROLL LOCK (used by modals so the page behind
     the popup can't scroll on mobile/touch devices)
  ========================================================= */
  function lockBodyScroll() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.dataset.scrollY = String(scrollY);
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockBodyScroll() {
    const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    delete document.body.dataset.scrollY;
    window.scrollTo(0, scrollY);
  }

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
  const projectCards = Array.from(document.querySelectorAll('.project-card'));
  const viewMoreWrap = document.getElementById('viewMoreWrap');
  const viewMoreBtn = document.getElementById('viewMoreBtn');
  const projectsContainer = document.getElementById('projectsContainer');

  const INITIAL_VISIBLE = 6;
  let showAllProjects = false;

  function renderProjects() {
    projectCards.forEach((card, i) => {
      card.style.display = (showAllProjects || i < INITIAL_VISIBLE) ? 'block' : 'none';
    });

    const canToggle = projectCards.length > INITIAL_VISIBLE;
    viewMoreWrap.style.display = canToggle ? 'block' : 'none';

    if (canToggle) {
      viewMoreBtn.innerHTML = showAllProjects
        ? "Show Less <i class='bx bx-up-arrow-alt'></i>"
        : "View More Projects <i class='bx bx-right-arrow-alt'></i>";
    }
  }

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
    lockBodyScroll();
  }

  function closeCertModal() {
    modal.classList.remove('active');
    unlockBodyScroll();
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
  const projectsData = [
    {
      id: 'professional-portfolio',
      title: 'Professional Portfolio',
      badge: 'Complete',
      desc: 'A comprehensive showcase of projects, skills, education and career journey, built with a focus on modern UI/UX and performance.',
      overview: 'A polished personal portfolio designed to present projects, skills, academic achievements, certifications and professional background through a modern, performance-focused interface with smooth interactions and a clean visual identity.',
      tech: [
        { cls: 'react', icon: 'bxl-react', label: 'React' },
        { cls: 'typescript', icon: 'bxl-typescript', label: 'TypeScript' },
        { cls: 'tailwind', icon: 'bxl-tailwind-css', label: 'Tailwind CSS' },
        { cls: 'framer', icon: 'bxs-magic-wand', label: 'Framer Motion' },
        { cls: 'three', icon: 'bx-cube', label: 'Three.js' }
      ],
      features: ['Modern Portfolio Layout', 'Project Showcase', 'Skills & Education Sections', 'Career Journey Highlights', 'Smooth Motion & Interactions', 'Responsive Design'],
      image: './images/professional-portfolio.png',
      live: 'https://professional-pranav-portfolio.netlify.app'
    },
    {
      id: 'pranavwebstudio',
      title: 'Pranav Web Studio',
      badge: 'Complete',
      desc: 'My own web development business website, where I help clients get modern, professional websites built for their brand.',
      overview: 'My own web development business website, built to showcase my services and help clients get modern, professional websites built for their brand.',
      tech: [
        { cls: 'react', icon: 'bxl-react', label: 'React' },
        { cls: 'tailwind', icon: 'bxl-tailwind-css', label: 'Tailwind CSS' },
        { cls: 'typescript', icon: 'bxl-typescript', label: 'TypeScript' }
      ],
      features: ['Service Showcase', 'Client Inquiry Form', 'Modern UI Design', 'Fully Responsive'],
      image: './images/pranavwebstudio.png',
      live: 'https://pranav-webstudio.netlify.app/'
    },
    {
      id: 'maison-doree',
      title: 'Maison Doree Bakery',
      badge: 'In Progress',
      desc: 'A premium online bakery website designed to showcase cakes, enable custom cake orders, and provide a complete online shopping experience.',
      overview: 'A modern and elegant bakery e-commerce website built for Maison Dorée, featuring a curated cake collection, custom cake builder, occasion-based browsing, offers, cart, checkout, order tracking and customer account management.',
      tech: [
        { cls: 'html', icon: 'bxl-html5', label: 'HTML' },
        { cls: 'css', icon: 'bxl-css3', label: 'CSS' },
        { cls: 'js', icon: 'bxl-javascript', label: 'JavaScript' }
      ],
      features: [
        'Cake Product Showcase',
        'Custom Cake Builder',
        'Search & Filters',
        'Shopping Cart',
        'Multi-step Checkout',
        'Multiple Payment Options',
        'Order Tracking',
        'Customer Account',
        'Wishlist & Rewards',
        'Offers & Coupons',
        'Responsive UI'
      ],
      image: './images/maison-doree.png',
      live: 'https://pws-maisondoree.netlify.app'
    },
    {
      id: 'salon',
      title: 'Salon Management System',
      badge: 'Complete',
      desc: 'A complete salon appointment Management system built for better experience.',
      overview: 'A full-featured salon appointment management system that lets customers book services online while giving salon owners an easy way to manage bookings, staff and daily schedules.',
      tech: [
        { cls: 'html', icon: 'bxl-html5', label: 'HTML' },
        { cls: 'css', icon: 'bxl-css3', label: 'CSS' },
        { cls: 'js', icon: 'bxl-javascript', label: 'JavaScript' },
        { cls: 'php', icon: 'bxl-php', label: 'PHP' }
      ],
      features: ['Online Appointment Booking', 'Admin Dashboard', 'Staff & Service Management', 'Fully Responsive Design'],
      image: './images/salon.png',
      live: '404.html'
    },
    {
      id: 'portfolio',
      title: 'Personal Portfolio',
      badge: 'Complete',
      desc: 'Modern responsive portfolio website.',
      overview: 'This is my personal portfolio website built using HTML, CSS and JavaScript. It includes sections like About Me, Skills, Projects, Education and Contact.',
      tech: [
        { cls: 'html', icon: 'bxl-html5', label: 'HTML' },
        { cls: 'css', icon: 'bxl-css3', label: 'CSS' },
        { cls: 'js', icon: 'bxl-javascript', label: 'JavaScript' }
      ],
      features: ['Fully Responsive Design', 'Smooth Animations', 'Project Showcase', 'Contact Form'],
      image: './images/portfolio.png',
      live: 'https://pranavjadhav-portfolio.netlify.app/'
    },
    {
      id: 'bakery',
      title: 'Sweet Delight Bakery',
      badge: 'In Progress',
      desc: 'Modern bakery website with smooth online cake ordering.',
      overview: 'A modern bakery website designed for a smooth online cake ordering experience, showcasing a fresh menu with an easy, appetite-friendly browsing flow.',
      tech: [
        { cls: 'html', icon: 'bxl-html5', label: 'HTML' },
        { cls: 'css', icon: 'bxl-css3', label: 'CSS' },
        { cls: 'js', icon: 'bxl-javascript', label: 'JavaScript' }
      ],
      features: ['Online Cake Ordering', 'Menu Showcase', 'Responsive Layout', 'Smooth Animations'],
      image: './images/bakery.png',
      live: '404.html'
    },
    {
      id: 'aurelia',
      title: 'Aurelia Estates',
      badge: 'Complete',
      desc: 'A premium luxury villa booking website with immersive 3D animations, cinematic UI and fully responsive design.',
      overview: 'A premium real-estate website for luxury villas, built with cinematic scroll-driven animations and an immersive, high-end user interface.',
      tech: [
        { cls: 'html', icon: 'bxl-html5', label: 'HTML' },
        { cls: 'css', icon: 'bxl-css3', label: 'CSS' },
        { cls: 'gsap', icon: 'bxs-zap', label: 'GSAP' },
        { cls: 'lenis', icon: 'bx-mouse', label: 'Lenis' }
      ],
      features: ['Cinematic 3D Animations', 'Smooth Scroll Experience', 'Villa Booking Showcase', 'Fully Responsive Design'],
      image: './images/villa%20website.png',
      live: 'https://aurelia-luxury-estate.netlify.app'
    },
    {
      id: 'visionarc',
      title: 'VisionArc Opticians',
      badge: 'Complete',
      desc: 'A sleek opticians website with elegant eyewear showcases and a smooth, easy browsing experience.',
      overview: 'A modern eyewear brand website showcasing stylish frame collections with a clean, elegant browsing experience designed to highlight every product.',
      tech: [
        { cls: 'html', icon: 'bxl-html5', label: 'HTML' },
        { cls: 'css', icon: 'bxl-css3', label: 'CSS' },
        { cls: 'js', icon: 'bxl-javascript', label: 'JavaScript' }
      ],
      features: ['Product Showcase Gallery', 'Responsive Design', 'Smooth Hover Effects', 'Clean, Elegant UI'],
      image: './images/visionarc.png',
      live: 'https://visionarc-opticians.netlify.app/'
    },
    {
      id: 'veloria',
      title: 'Veloria Timeless Elegance',
      badge: 'In Progress',
      desc: 'A luxury watches store website with a refined, elegant showcase for premium timepieces.',
      overview: "A luxury watches store website designed to showcase premium timepieces with a refined, elegant layout that reflects the brand's high-end identity.",
      tech: [
        { cls: 'html', icon: 'bxl-html5', label: 'HTML' },
        { cls: 'css', icon: 'bxl-css3', label: 'CSS' },
        { cls: 'js', icon: 'bxl-javascript', label: 'JavaScript' }
      ],
      features: ['Premium Product Showcase', 'Elegant Minimal UI', 'Responsive Design', 'Smooth Animations'],
      image: './images/veloria.png',
      live: '404.html'
    },
    {
      id: 'mohitdecodes',
      title: 'Mohit Decodes',
      badge: 'Complete',
      desc: 'A modern learning and developer platform designed to help developers learn, build real-world projects and grow their careers.',
      overview: 'A professional developer education platform featuring courses, tutorials, resources, roadmaps, projects, blogs and career-focused content, designed with a modern and engaging user experience.',
      tech: [
        { cls: 'react', icon: 'bxl-react', label: 'React' },
        { cls: 'vite', icon: 'bxs-bolt', label: 'Vite' }
      ],
      features: [
        'Live YouTube Subscriber Count',
        'Dark / Light Theme Toggle',
        'Site-wide Search',
        'Developer Roadmaps',
        'Blogs Section',
        'Free Resources',
        'Newsletter Signup',
        'Fully Responsive'
      ],
      image: './images/mohit-decodes.png',
      live: 'https://mohitdecodes-website.netlify.app'
    },
  ];

  const projectModal = document.getElementById('projectModal');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalImage = document.getElementById('projectModalImage');
  const projectModalDesc = document.getElementById('projectModalDesc');
  const projectModalOverview = document.getElementById('projectModalOverview');
  const projectModalTech = document.getElementById('projectModalTech');
  const projectModalFeatures = document.getElementById('projectModalFeatures');
  const projectModalBadge = document.getElementById('projectModalBadge');
  const projectModalLink = document.getElementById('projectModalLink');
  const closeProjectModalBtn = document.getElementById('closeProjectModal');
  const projectPrevBtn = document.getElementById('projectPrevBtn');
  const projectNextBtn = document.getElementById('projectNextBtn');

  let currentProjectIndex = 0;

  function renderProjectModal(index) {
    if (!projectsData[index]) return;
    currentProjectIndex = index;
    const p = projectsData[currentProjectIndex];

    projectModalBadge.textContent = p.badge;
    projectModalBadge.className = 'badge' + (p.badge === 'In Progress' ? ' processing' : '');

    const words = p.title.split(' ');
    const last = words.pop();
    projectModalTitle.innerHTML = (words.length ? words.join(' ') + ' ' : '') + `<span>${last}</span>`;

    projectModalDesc.textContent = p.desc;
    projectModalOverview.textContent = p.overview;

    projectModalTech.innerHTML = p.tech.map(t =>
      `<div class="tech-chip"><span class="tech-icon ${t.cls}"><i class='bx ${t.icon}'></i></span>${t.label}</div>`
    ).join('');

    projectModalFeatures.innerHTML = p.features.map(f =>
      `<li><i class='bx bxs-check-circle'></i> ${f}</li>`
    ).join('');

    projectModalImage.src = p.image;
    projectModalImage.alt = p.title;

    projectModalLink.href = p.live;

    projectModal.classList.add('active');
    lockBodyScroll();
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    unlockBodyScroll();
  }

  function showNextProject() {
    renderProjectModal((currentProjectIndex + 1) % projectsData.length);
  }

  function showPrevProject() {
    renderProjectModal((currentProjectIndex - 1 + projectsData.length) % projectsData.length);
  }

  function openProjectModalFromCard(card) {
    const id = card.getAttribute('data-project');
    const idx = projectsData.findIndex(p => p.id === id);
    renderProjectModal(idx >= 0 ? idx : 0);
  }

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', () => openProjectModalFromCard(btn.closest('.project-card')));
  });

  document.querySelectorAll('.project-card .img-box img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openProjectModalFromCard(img.closest('.project-card')));
  });

  if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', closeProjectModal);
  if (projectPrevBtn) projectPrevBtn.addEventListener('click', showPrevProject);
  if (projectNextBtn) projectNextBtn.addEventListener('click', showNextProject);

  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!projectModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeProjectModal();
    if (e.key === 'ArrowRight') showNextProject();
    if (e.key === 'ArrowLeft') showPrevProject();
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