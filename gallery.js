// js/gallery.js
// Masonry Gallery Category Filtering & Fullscreen Lightbox Modal

import { StorageManager } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return; // Exit if not on gallery page

  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const items = StorageManager.getGallery();
  let activeFilter = 'all';
  let filteredItems = [...items];

  // Render gallery on page load
  renderGallery(items, galleryGrid);

  // Tab filtering click binds
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeFilter = btn.getAttribute('data-filter');
      
      if (activeFilter === 'all') {
        filteredItems = [...items];
      } else {
        filteredItems = items.filter(item => item.category === activeFilter);
      }

      renderGallery(filteredItems, galleryGrid);
    });
  });

  // LIGHTBOX POPUP FUNCTIONALITY
  setupLightbox();
});

// Render portfolio grid elements
function renderGallery(list, container) {
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `<div class="no-results-msg" style="width:100%;">No gallery portfolio items found.</div>`;
    return;
  }

  list.forEach((item, idx) => {
    const col = document.createElement('div');
    col.className = `gallery-item reveal reveal-scale-in delay-${(idx % 3) + 1}`;
    col.setAttribute('data-id', item.id);
    col.style.cssText = `
      position: relative;
      margin-bottom: 30px;
      break-inside: avoid;
      cursor: pointer;
      overflow: hidden;
      border: 1px solid var(--border-glass);
    `;

    col.innerHTML = `
      <img src="${item.image}" alt="${item.title}" style="width:100%; display:block; transition: transform 1.2s ease;" class="gallery-img" loading="lazy">
      <div class="gallery-item-overlay" style="
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(180deg, rgba(10,10,10,0) 30%, rgba(10,10,10,0.95) 100%);
        opacity: 0; transition: opacity 0.4s ease;
        display: flex; flex-direction: column; justify-content: flex-end;
        padding: 3rem;
      ">
        <span style="font-size: 1.1rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0.5rem;">${item.category}</span>
        <h4 style="font-family: var(--font-headings); font-size: 2rem; color: var(--color-white);">${item.title}</h4>
      </div>
    `;

    // Bind hover scale styles in JS to avoid style.css clashes
    col.addEventListener('mouseenter', () => {
      col.querySelector('img').style.transform = 'scale(1.05)';
      col.querySelector('.gallery-item-overlay').style.opacity = '1';
    });
    col.addEventListener('mouseleave', () => {
      col.querySelector('img').style.transform = 'scale(1)';
      col.querySelector('.gallery-item-overlay').style.opacity = '0';
    });

    container.appendChild(col);

    // Apply scroll animations
    setTimeout(() => {
      col.classList.add('revealed');
    }, 50);
  });
}

// Lightbox controller setup
function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIdx = 0;
  let activeList = [];

  // Bind click delegator to gallery grid items
  document.getElementById('gallery-grid').addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;

    const itemId = item.getAttribute('data-id');
    const items = StorageManager.getGallery();
    
    // Determine the active list based on active filter button
    const activeFilterBtn = document.querySelector('.gallery-filter-btn.active');
    const filter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

    if (filter === 'all') {
      activeList = [...items];
    } else {
      activeList = items.filter(i => i.category === filter);
    }

    currentIdx = activeList.findIndex(i => i.id === itemId);
    
    if (currentIdx !== -1) {
      openLightbox(activeList[currentIdx]);
    }
  });

  const openLightbox = (item) => {
    lightboxImg.src = item.image;
    lightboxCaption.textContent = item.title;
    lightbox.classList.add('show');
    document.body.classList.add('no-scroll');
  };

  const closeLightbox = () => {
    lightbox.classList.remove('show');
    document.body.classList.remove('no-scroll');
  };

  const navigate = (dir) => {
    if (activeList.length === 0) return;
    if (dir === 'next') {
      currentIdx = (currentIdx + 1) % activeList.length;
    } else {
      currentIdx = (currentIdx - 1 + activeList.length) % activeList.length;
    }
    const item = activeList[currentIdx];
    lightboxImg.src = item.image;
    lightboxCaption.textContent = item.title;
  };

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigate('prev'));
  nextBtn.addEventListener('click', () => navigate('next'));

  // Close lightbox on clicking dark backdrop mask
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Bind arrow keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigate('next');
    if (e.key === 'ArrowLeft') navigate('prev');
  });
}
