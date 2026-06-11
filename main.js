// js/main.js
// Global Application Controller & Shared UI Bindings

import { StorageManager } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize LocalStorage databases
  StorageManager.init();

  // 2. Setup Cursor Elements & Logic
  setupCustomCursor();

  // 3. Setup Scroll Progress & Sticky Header
  setupScrollEffects();

  // 4. Setup Mobile Navigation Menu
  setupMobileMenu();

  // 5. Populate Dynamic Brand Details (Headers, Footers, Floating CTA)
  populateBrandDetails();
});

// Setup Animated Luxury Cursor
function setupCustomCursor() {
  // Check if cursor elements exist, otherwise create them
  let dot = document.querySelector('.custom-cursor-dot');
  let circle = document.querySelector('.custom-cursor-circle');

  if (!dot) {
    dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    document.body.appendChild(dot);
  }
  if (!circle) {
    circle = document.createElement('div');
    circle.className = 'custom-cursor-circle';
    document.body.appendChild(circle);
  }

  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth trailing effect using requestAnimationFrame
  function animateCircle() {
    // Linear interpolation (lerp) for trailing effect
    const delay = 0.15;
    circleX += (mouseX - circleX) * delay;
    circleY += (mouseY - circleY) * delay;

    circle.style.left = `${circleX}px`;
    circle.style.top = `${circleY}px`;

    requestAnimationFrame(animateCircle);
  }
  animateCircle();

  // Bind Hover States to Links, Buttons, and Form fields
  const interactives = document.querySelectorAll('a, button, select, input, textarea, .interactive-item, [role="button"]');
  interactives.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      circle.classList.add('custom-cursor-hover');
    });
    elem.addEventListener('mouseleave', () => {
      circle.classList.remove('custom-cursor-hover');
    });
  });
}

// Setup Scroll Progress Indicator, Sticky Header and Back To Top
function setupScrollEffects() {
  const header = document.querySelector('.header');
  const progressBar = document.querySelector('.scroll-progress-bar');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // 1. Update progress indicator
    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    // 2. Sticky Navbar state
    if (header) {
      if (scrollTop > 50) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    }

    // 3. Back to Top Button visibility
    if (backToTopBtn) {
      if (scrollTop > 500) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  // Back to Top Click Handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Mobile Menu toggles
function setupMobileMenu() {
  const menuBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isActive = navMenu.classList.contains('active');
      menuBtn.innerHTML = isActive ? '✕' : '☰';
      
      // Prevent body scrolling when mobile menu open
      document.body.classList.toggle('no-scroll', isActive);
    });

    // Close menu when clicking navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuBtn.innerHTML = '☰';
        document.body.classList.remove('no-scroll');
      });
    });
  }
}

// Populate contact links, addresses, phone and social anchors across header, footer and CTA widgets
function populateBrandDetails() {
  const contact = StorageManager.getContact();
  const socials = StorageManager.getSocials();

  // 1. Bind Floating Call & WhatsApp Buttons
  const callBtn = document.querySelector('.call-btn');
  const waBtn = document.querySelector('.whatsapp-btn');

  if (callBtn && contact.phone) {
    callBtn.setAttribute('href', `tel:${contact.phone.replace(/\s+/g, '')}`);
    callBtn.setAttribute('aria-label', `Call ${contact.companyName}`);
  }
  if (waBtn && contact.whatsapp) {
    // Formulate wa link
    const digitsOnly = contact.whatsapp.replace(/[^0-9]/g, '');
    waBtn.setAttribute('href', `https://wa.me/${digitsOnly}`);
    waBtn.setAttribute('aria-label', 'WhatsApp inquiry channel');
  }

  // 2. Populate Footer Dynamic details
  const footerAddress = document.querySelector('.footer-address-text');
  const footerPhone = document.querySelector('.footer-phone-text');
  const footerEmail = document.querySelector('.footer-email-text');

  if (footerAddress) footerAddress.innerText = contact.address;
  if (footerPhone) {
    footerPhone.innerHTML = `<a href="tel:${contact.phone.replace(/\s+/g, '')}">${contact.phone}</a>`;
  }
  if (footerEmail) {
    footerEmail.innerHTML = `<a href="mailto:${contact.email}">${contact.email}</a>`;
  }

  // 3. Populate Social Media Links in Footer
  const footerSocialsContainer = document.querySelector('.footer-socials-container');
  if (footerSocialsContainer) {
    footerSocialsContainer.innerHTML = '';
    const socialEntries = Object.entries(socials);

    socialEntries.forEach(([platform, url]) => {
      if (url) {
        const btn = document.createElement('a');
        btn.href = url;
        btn.className = 'social-icon-btn';
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.setAttribute('aria-label', `Follow us on ${platform}`);

        // Set matching SVG node
        btn.innerHTML = getSocialSVG(platform);
        footerSocialsContainer.appendChild(btn);
      }
    });
  }

  // 4. Populate Floating Social Bar
  const floatSocialBar = document.querySelector('.floating-social-bar');
  if (floatSocialBar) {
    // Keep lines of bar clear
    floatSocialBar.innerHTML = '';
    
    // Add prefix line decoration
    const decLineTop = document.createElement('div');
    decLineTop.style.cssText = "width: 1px; height: 80px; background: var(--border-glass); align-self: center;";
    floatSocialBar.appendChild(decLineTop);

    const socialEntries = Object.entries(socials);
    socialEntries.forEach(([platform, url]) => {
      if (url && ['facebook', 'instagram', 'linkedin', 'twitter'].includes(platform)) {
        const btn = document.createElement('a');
        btn.href = url;
        btn.className = 'social-icon-btn';
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.setAttribute('aria-label', `Follow on ${platform}`);
        btn.innerHTML = getSocialSVG(platform);
        floatSocialBar.appendChild(btn);
      }
    });

    const decLineBottom = document.createElement('div');
    decLineBottom.style.cssText = "width: 1px; height: 80px; background: var(--border-glass); align-self: center;";
    floatSocialBar.appendChild(decLineBottom);
  }
}

// SVG Vector paths lookup mapping for social platforms
export function getSocialSVG(platform) {
  const SVGs = {
    facebook: `<svg viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03.73-2 2-2h1.5V1.85C17.18 1.8 16.03 1.7 14.85 1.7 11.23 1.7 9 3.9 9 7.85v1.65H6v4h3v10h5V13.5z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.41a4.87 4.87 0 0 1 1.82 1.18 4.87 4.87 0 0 1 1.18 1.82c.16.42.36 1.05.41 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.22a4.87 4.87 0 0 1-1.18 1.82 4.87 4.87 0 0 1-1.82 1.18c-.42.16-1.05.36-2.22.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.41a4.87 4.87 0 0 1-1.82-1.18 4.87 4.87 0 0 1-1.18-1.82c-.16-.42-.36-1.05-.41-2.22C2.17 15.75 2.16 15.37 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.22a4.87 4.87 0 0 1 1.18-1.82 4.87 4.87 0 0 1 1.82-1.18c.42-.16 1.05-.36 2.22-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.77.13 4.9.33 4.14.63A7.03 7.03 0 0 0 1.6 3.16 7.03 7.03 0 0 0 .63 7.05C.33 7.82.13 8.7.07 9.97.01 11.26 0 11.67 0 12.5s.01 1.24.07 2.53c.06 1.27.26 2.15.56 2.91a7.03 7.03 0 0 0 2.53 2.53c.77.3 1.65.5 2.91.56 1.29.06 1.7.07 2.53.07s1.24-.01 2.53-.07c1.27-.06 2.15-.26 2.91-.56a7.03 7.03 0 0 0 2.53-2.53c.3-.77.5-1.65.56-2.91.06-1.29.07-1.7.07-2.53s-.01-1.24-.07-2.53c-.06-1.27-.26-2.15-.56-2.91a7.03 7.03 0 0 0-2.53-2.53c-.77-.3-1.65-.5-2.91-.56C16.74.01 16.33 0 12.5 0zM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 9.84a3.84 3.84 0 1 1 0-7.68 3.84 3.84 0 0 1 0 7.68zm6.4-10.22a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.482 20.455 12 20.455 12 20.455s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.843.002-2.634-1.02-5.111-2.877-6.97s-4.34-2.879-6.986-2.88c-5.44 0-9.866 4.41-9.869 9.846-.001 1.77.476 3.497 1.38 5.04l-.993 3.626 3.725-.975c1.517.82 3.136 1.252 4.733 1.252zm10.024-7.39c-.272-.135-1.606-.79-1.854-.88-.247-.09-.427-.135-.607.135-.18.27-.697.88-.854 1.057-.158.179-.315.2-.587.064-.272-.135-1.147-.422-2.183-1.347-.807-.72-1.352-1.609-1.51-1.88-.158-.271-.017-.417.119-.552.122-.122.272-.317.408-.475.136-.158.18-.27.272-.452.09-.18.045-.339-.022-.475-.067-.136-.607-1.46-.83-1.996-.217-.523-.455-.453-.607-.46-.157-.008-.337-.009-.517-.009s-.472.067-.72.338c-.247.27-1.012.99-1.012 2.414s1.035 2.793 1.18 2.986c.146.193 2.036 3.111 4.932 4.363.689.298 1.227.476 1.646.609.692.22 1.323.19 1.82.115.554-.083 1.606-.656 1.832-1.29.225-.634.225-1.178.157-1.29-.067-.113-.247-.18-.52-.315z"/></svg>`,
    telegram: `<svg viewBox="0 0 24 24"><path d="M9.78 18.65l.28-4.23 7.68-6.94c.33-.3-.07-.46-.51-.17L7.71 13.58l-4.1-1.28c-.89-.28-.91-.89.19-1.33l16.03-6.18c.74-.27 1.39.18 1.16 1.17l-2.73 12.85c-.2 1.01-.8 1.26-1.65.78l-4.17-3.07-2 1.93c-.22.22-.41.41-.85.41z"/></svg>`
  };

  return SVGs[platform] || '';
}
