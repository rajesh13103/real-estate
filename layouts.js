// js/layouts.js
// Layout Listings, Filter System, Detail Page Renderer & Site Visit Booking Form

import { StorageManager } from './storage.js';
import { Validation } from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
  const isListingPage = document.querySelector('.properties-grid') !== null;
  const isDetailPage = document.getElementById('detail-page-container') !== null;

  if (isListingPage) {
    initListingPage();
  }
  if (isDetailPage) {
    initDetailPage();
  }
});

// 1. LISTING PAGE ENGINE
function initListingPage() {
  const grid = document.querySelector('.properties-grid');
  const searchInput = document.getElementById('search-input');
  const filterBudget = document.getElementById('filter-budget');
  const filterArea = document.getElementById('filter-area');
  const filterStatus = document.getElementById('filter-status');
  const filterLocation = document.getElementById('filter-location');
  const resetBtn = document.getElementById('reset-filters');

  let layouts = StorageManager.getLayouts();

  // Populate dynamic locations dropdown options
  if (filterLocation) {
    const locations = [...new Set(layouts.map(l => l.location.split(',')[0].trim()))];
    locations.forEach(loc => {
      const opt = document.createElement('option');
      opt.value = loc.toLowerCase();
      opt.textContent = loc;
      filterLocation.appendChild(opt);
    });
  }

  // Render cards initially
  renderProperties(layouts, grid);

  // Bind filter events
  const triggerFilters = () => {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const budget = filterBudget ? filterBudget.value : '';
    const area = filterArea ? filterArea.value : '';
    const status = filterStatus ? filterStatus.value : '';
    const location = filterLocation ? filterLocation.value : '';

    const filtered = layouts.filter(item => {
      // 1. Search Query
      const matchQuery = 
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query) ||
        item.pincode.includes(query);

      // 2. Budget Range
      let matchBudget = true;
      if (budget === 'under-1cr') matchBudget = item.price < 10000000;
      else if (budget === '1cr-1.5cr') matchBudget = item.price >= 10000000 && item.price <= 15000000;
      else if (budget === 'above-1.5cr') matchBudget = item.price > 15000000;

      // 3. Area Sizes
      let matchArea = true;
      if (area === 'small') matchArea = item.totalArea < 40000;
      else if (area === 'medium') matchArea = item.totalArea >= 40000 && item.totalArea <= 60000;
      else if (area === 'large') matchArea = item.totalArea > 60000;

      // 4. Status Badge
      let matchStatus = true;
      if (status) matchStatus = item.status.toLowerCase().replace(/\s+/g, '-') === status;

      // 5. City Location
      let matchLocation = true;
      if (location) matchLocation = item.location.toLowerCase().includes(location);

      return matchQuery && matchBudget && matchArea && matchStatus && matchLocation;
    });

    renderProperties(filtered, grid);
  };

  [searchInput, filterBudget, filterArea, filterStatus, filterLocation].forEach(elem => {
    if (elem) {
      elem.addEventListener('input', triggerFilters);
      elem.addEventListener('change', triggerFilters);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (filterBudget) filterBudget.selectedIndex = 0;
      if (filterArea) filterArea.selectedIndex = 0;
      if (filterStatus) filterStatus.selectedIndex = 0;
      if (filterLocation) filterLocation.selectedIndex = 0;
      renderProperties(layouts, grid);
    });
  }
}

// Render dynamic Property Card components
function renderProperties(list, container) {
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = `<div class="no-results-msg">No premium layouts matching your current filters were found.</div>`;
    return;
  }

  list.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = `property-card reveal reveal-fade-up delay-${(index % 3) + 1}`;
    
    const statusClass = item.status.toLowerCase().replace(/\s+/g, '-');
    const formattedPrice = formatCurrency(item.price);

    card.innerHTML = `
      <div class="property-img-wrapper">
        <img src="${item.image}" alt="${item.name}" class="property-img" loading="lazy">
        <span class="property-status-badge ${statusClass}">${item.status}</span>
      </div>
      <div class="property-info">
        <span class="property-location">${item.location}</span>
        <h3 class="property-title">${item.name}</h3>
        <p class="property-desc">${item.description}</p>
        <div class="property-specs">
          <div class="spec-item">
            <span class="spec-label">Plot Sizes</span>
            <span class="spec-val">${item.plotSizes.split(',')[0].trim()}...</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Available Plots</span>
            <span class="spec-val">${item.availablePlots} Units</span>
          </div>
        </div>
        <div class="property-footer">
          <div class="property-price">
            <span class="price-label">Investment Starts</span>
            <span class="price-val">${formattedPrice}</span>
          </div>
          <a href="layout-details.html?id=${item.id}" class="btn btn-gold-outline" style="padding: 1rem 2rem; font-size: 1.1rem;">Explore Spec</a>
        </div>
      </div>
    `;

    container.appendChild(card);
    
    // Trigger scroll animations dynamically for newly injected DOM
    setTimeout(() => {
      card.classList.add('revealed');
    }, 50);
  });
}

// Helper: Indian Currency Formatter (e.g. ₹75 Lakh or ₹1.2 Crore)
export function formatCurrency(num) {
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Crore`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

// 2. PROPERTY DETAILS PAGE ENGINE
function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const layoutId = params.get('id');
  const layouts = StorageManager.getLayouts();
  const item = layouts.find(l => l.id === layoutId);

  if (!item) {
    // Redirect to lists if layout id invalid
    window.location.href = 'layouts.html';
    return;
  }

  // Bind dynamic specs details
  document.getElementById('detail-title').innerText = item.name;
  document.getElementById('detail-location').innerText = `${item.address}, ${item.location}`;
  document.getElementById('detail-price').innerText = formatCurrency(item.price);
  
  // Set price estimate label
  const areaSqft = parseInt(item.plotSizes.match(/\d+/)) || 1200;
  const perSqft = Math.round(item.price / areaSqft);
  document.getElementById('detail-price-sqft').innerText = `Est. ~₹${perSqft}/sq.ft. onward`;

  // Render specifications
  document.getElementById('spec-area').innerText = `${item.totalArea.toLocaleString()} sq.ft.`;
  document.getElementById('spec-plots').innerText = `${item.availablePlots} Available`;
  document.getElementById('spec-road').innerText = item.roadWidth.split(' ')[0] + ' ' + item.roadWidth.split(' ')[1];
  
  const statusBadge = document.getElementById('spec-status');
  statusBadge.innerText = item.status;
  statusBadge.className = `property-status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}`;

  document.getElementById('detail-desc').innerText = item.description;

  // Render Map Iframe
  const mapIframe = document.querySelector('.iframe-map-wrapper iframe');
  if (mapIframe) {
    mapIframe.src = item.mapsUrl;
  }

  // Populate dynamic maps button links
  const mapUrlBtn = document.getElementById('btn-map-url');
  if (mapUrlBtn) {
    mapUrlBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + item.location)}`;
  }
  
  // 3. Render gallery slider images
  const slider = document.querySelector('.detail-gallery-main');
  const arrows = document.querySelector('.gallery-arrows');
  slider.innerHTML = ''; // Clear skeleton
  
  // Include main preview photo + gallery array photos
  const imgList = [item.image, ...(item.gallery || [])];
  
  imgList.forEach((src, idx) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${item.name} Showcase ${idx + 1}`;
    img.className = `detail-gallery-img ${idx === 0 ? 'active' : ''}`;
    slider.appendChild(img);
  });
  slider.appendChild(arrows); // Put navigation back on top

  // Bind carousel slider listeners
  let currentSlide = 0;
  const slides = document.querySelectorAll('.detail-gallery-img');
  
  const changeSlide = (dir) => {
    slides[currentSlide].classList.remove('active');
    if (dir === 'next') {
      currentSlide = (currentSlide + 1) % slides.length;
    } else {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }
    slides[currentSlide].classList.add('active');
  };

  document.getElementById('btn-slide-prev').addEventListener('click', () => changeSlide('prev'));
  document.getElementById('btn-slide-next').addEventListener('click', () => changeSlide('next'));

  // 4. Render amenities
  const amenitiesGrid = document.querySelector('.amenities-grid');
  if (amenitiesGrid) {
    amenitiesGrid.innerHTML = '';
    item.amenities.forEach(amenity => {
      const card = document.createElement('div');
      card.className = 'amenity-card reveal reveal-fade-up';
      card.innerHTML = `
        <div class="amenity-icon-box">
          <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
        </div>
        <span class="amenity-name">${amenity}</span>
      `;
      amenitiesGrid.appendChild(card);
    });
  }

  // 5. Render nearby places table
  const nearbyBody = document.querySelector('.nearby-table tbody');
  if (nearbyBody) {
    nearbyBody.innerHTML = '';
    item.nearby.forEach(place => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${place.name}</strong></td>
        <td><span class="nearby-cat-badge">${place.type}</span></td>
        <td><span class="nearby-dist-val">${place.distance} KM</span></td>
      `;
      nearbyBody.appendChild(row);
    });
  }

  // 6. Bind Site Visit Form Submission & validations
  const bookingForm = document.getElementById('detail-booking-form');
  if (bookingForm) {
    const layoutInput = document.getElementById('booking-layout');
    if (layoutInput) {
      layoutInput.value = item.name; // pre-fill input
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('booking-name').value.trim();
      const mobile = document.getElementById('booking-phone').value.trim();
      const email = document.getElementById('booking-email').value.trim();
      const date = document.getElementById('booking-date').value;
      const time = document.getElementById('booking-time').value;

      // Reset error statuses
      document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('has-error'));

      let isValid = true;

      if (!Validation.required(name)) {
        showFieldError('booking-name', 'Please input your name.');
        isValid = false;
      }
      if (!Validation.phone(mobile)) {
        showFieldError('booking-phone', 'Please enter a valid 10-digit mobile number.');
        isValid = false;
      }
      if (!Validation.email(email)) {
        showFieldError('booking-email', 'Please enter a valid email address.');
        isValid = false;
      }
      if (!Validation.required(date)) {
        showFieldError('booking-date', 'Please choose a preferred visit date.');
        isValid = false;
      } else if (!Validation.futureDate(date)) {
        showFieldError('booking-date', 'Booking date cannot be in the past.');
        isValid = false;
      }
      if (!Validation.required(time)) {
        showFieldError('booking-time', 'Please select a preferred slot time.');
        isValid = false;
      }

      if (isValid) {
        // Save visit to local storage inquiries
        StorageManager.addInquiry({
          type: 'site_visit',
          name,
          mobile,
          email,
          date,
          time,
          layoutName: item.name
        });

        // Trigger visual success modal overlay
        showBookingSuccessOverlay();
        bookingForm.reset();
        if (layoutInput) layoutInput.value = item.name;
      }
    });
  }
}

// Field validation indicator
function showFieldError(fieldId, errorMsg) {
  const inputEl = document.getElementById(fieldId);
  const group = inputEl.closest('.form-group');
  const errorEl = group.querySelector('.form-error');

  if (errorEl) {
    errorEl.innerText = errorMsg;
  }
  group.classList.add('has-error');
}

// Visual Alert Popup
function showBookingSuccessOverlay() {
  const successModal = document.createElement('div');
  successModal.style.cssText = `
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(10,10,10,0.96);
    backdrop-filter: blur(15px);
    z-index: 10001;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.5s ease;
  `;

  successModal.innerHTML = `
    <div style="text-align: center; padding: 4rem; max-width: 500px; border: 1px solid var(--border-glass-gold); background: var(--color-dark-gray);">
      <svg viewBox="0 0 24 24" style="width: 80px; height: 80px; fill: var(--color-gold); margin-bottom: 2.5rem;"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
      <h3 style="font-family: var(--font-headings); font-size: 3rem; margin-bottom: 1.5rem; color: var(--color-white);">Reservation Lodged</h3>
      <p style="color: var(--color-silver); font-size: 1.5rem; margin-bottom: 3rem; line-height: 1.6;">Your private site visit schedule request has been logged successfully. Our Relationship Manager will contact you shortly to coordinate transportation.</p>
      <button class="btn btn-primary btn-close-success" style="padding: 1.2rem 3rem;">Acknowledge</button>
    </div>
  `;

  document.body.appendChild(successModal);

  setTimeout(() => successModal.style.opacity = '1', 50);

  successModal.querySelector('.btn-close-success').addEventListener('click', () => {
    successModal.style.opacity = '0';
    setTimeout(() => successModal.remove(), 500);
  });
}
