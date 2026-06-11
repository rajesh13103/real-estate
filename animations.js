// js/animations.js
// Cinematic Animation Systems & 3D Interactive Parallax

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Intersection Observer for Scroll Reveals
  initScrollReveals();

  // 2. Initialize 3D Mouse Parallax Card Tilt
  init3DTiltCards();

  // 3. Initialize Parallax Scroll Elements
  initScrollParallax();
});

// Viewport Entrance Anim Observer
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // use viewport
      rootMargin: '0px 0px -80px 0px', // trigger slightly before entering fully
      threshold: 0.12 // percentage of element visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once animated, we can unobserve if we only want it to animate once
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(elem => {
      revealObserver.observe(elem);
    });
  } else {
    // Fallback if IntersectionObserver is not supported: show all immediately
    revealElements.forEach(elem => {
      elem.classList.add('revealed');
    });
  }
}

// 3D Card mouse tilt physics
function init3DTiltCards() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x coordinate inside element
      const y = e.clientY - rect.top;  // y coordinate inside element
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt degrees
      const maxTiltX = 10; 
      const maxTiltY = 10;

      // Calculate tilt percentages relative to center
      const percentX = (x - centerX) / centerX; // ranges from -1 to 1
      const percentY = (y - centerY) / centerY; // ranges from -1 to 1

      // Calculate rotation angles (invert Y to match natural direction)
      const rotateX = -percentY * maxTiltX; 
      const rotateY = percentX * maxTiltY;

      // Apply transform style
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    // Reset card perspective on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none'; // remove transition for real-time response
    });
  });
}

// Parallax scrolling adjustments for background images
function initScrollParallax() {
  const parallaxContainers = document.querySelectorAll('.parallax-container');

  if (parallaxContainers.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    parallaxContainers.forEach(container => {
      const bg = container.querySelector('.parallax-bg');
      if (!bg) return;

      const rect = container.getBoundingClientRect();
      const offsetTop = window.scrollY + rect.top;
      
      // Only compute when element is in viewport
      if (scrolled + window.innerHeight > offsetTop && scrolled < offsetTop + rect.height) {
        const relativeScroll = scrolled - offsetTop;
        // Translate background image slower than scroll
        const speed = 0.25; 
        bg.style.transform = `translateY(${relativeScroll * speed}px)`;
      }
    });
  });
}
