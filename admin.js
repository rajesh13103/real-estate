// js/admin.js
// Owner Dashboard Content Management System (CMS) & CRUD Controller

import { StorageManager } from './storage.js';
import { AuthManager } from './auth.js';
import { formatCurrency } from './layouts.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Route guard check - redirect if unauthenticated
  AuthManager.guardRoute();

  // 2. Setup Nav menu tab switches
  setupDashboardTabs();

  // 3. Bind Logout trigger
  const logoutBtn = document.getElementById('btn-admin-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      AuthManager.logout();
    });
  }

  // 4. Initial panel renders
  renderTelemetryStats();
  renderLayoutsTable();
  renderInquiriesTable();
  renderCrewTable();
  renderGalleryList();
  populateSettingsForms();

  // 5. Setup Action Triggers (Modals, Submissions, Resets)
  setupCRUDModals();
});

// Swapping tab views
function setupDashboardTabs() {
  const tabs = document.querySelectorAll('.admin-nav-item');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-tab');
      
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePane = document.getElementById(targetPaneId);
      if (activePane) activePane.classList.add('active');
    });
  });
}

// 1. Dashboard Metrics and Recent Inquiries
function renderTelemetryStats() {
  const layouts = StorageManager.getLayouts();
  const crew = StorageManager.getCrew();
  const inquiries = StorageManager.getInquiries();
  const gallery = StorageManager.getGallery();

  // Populate numeric metrics
  document.getElementById('stat-total-layouts').innerText = layouts.length;
  document.getElementById('stat-total-crew').innerText = crew.length;
  document.getElementById('stat-total-inquiries').innerText = inquiries.length;
  document.getElementById('stat-total-gallery').innerText = gallery.length;
}

// 2. Layouts CRUD Grid Population
function renderLayoutsTable() {
  const tbody = document.querySelector('#admin-layouts-table tbody');
  if (!tbody) return;

  const layouts = StorageManager.getLayouts();
  tbody.innerHTML = '';

  layouts.forEach(layout => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${layout.image}" alt="${layout.name}"></td>
      <td><strong>${layout.name}</strong></td>
      <td>${layout.location}</td>
      <td>${formatCurrency(layout.price)}</td>
      <td>${layout.availablePlots} Plots</td>
      <td><span class="badge ${getBadgeClass(layout.status)}">${layout.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit-btn" data-id="${layout.id}" title="Edit Layout">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="action-btn delete-btn" data-id="${layout.id}" title="Delete Layout">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    `;
    
    // Bind Action buttons
    tr.querySelector('.edit-btn').addEventListener('click', () => openEditLayoutModal(layout.id));
    tr.querySelector('.delete-btn').addEventListener('click', () => deleteLayoutHandler(layout.id));

    tbody.appendChild(tr);
  });
}

// Helper: Status badge selectors
function getBadgeClass(status) {
  const text = status.toLowerCase();
  if (text === 'available') return 'badge-success';
  if (text === 'limited availability') return 'badge-warning';
  if (text === 'sold out') return 'badge-danger';
  return 'badge-info'; // upcoming
}

// Delete Layout Handler
function deleteLayoutHandler(id) {
  if (confirm('Are you absolutely sure you want to delete this property layout? This action is irreversible.')) {
    StorageManager.deleteLayout(id);
    renderLayoutsTable();
    renderTelemetryStats();
  }
}

// 3. Site visit booking lists
function renderInquiriesTable() {
  const tbody = document.querySelector('#admin-inquiries-table tbody');
  if (!tbody) return;

  const inquiries = StorageManager.getInquiries();
  tbody.innerHTML = '';

  if (inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No visit inquiries or contact messages logged yet.</td></tr>`;
    return;
  }

  inquiries.forEach(inq => {
    const tr = document.createElement('tr');
    
    const formattedDate = new Date(inq.timestamp).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const isVisit = inq.type === 'site_visit';
    const detailText = isVisit 
      ? `<strong>Visit Request:</strong> ${inq.layoutName}<br>Date: ${inq.date} | Time: ${inq.time}`
      : `<strong>Service:</strong> ${inq.serviceType}<br>${inq.message}`;

    tr.innerHTML = `
      <td><span class="badge ${isVisit ? 'badge-success' : 'badge-info'}">${isVisit ? 'SITE VISIT' : 'MESSAGE'}</span></td>
      <td><strong>${inq.name}</strong></td>
      <td>${inq.mobile || inq.phone}</td>
      <td>${inq.email}</td>
      <td>${detailText}</td>
      <td>${formattedDate}</td>
      <td>
        <button class="action-btn delete-btn" data-id="${inq.id}">
          <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </td>
    `;

    tr.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Delete this inquiry record?')) {
        StorageManager.deleteInquiry(inq.id);
        renderInquiriesTable();
        renderTelemetryStats();
      }
    });

    tbody.appendChild(tr);
  });
}

// 4. Crew Members Table CRUD
function renderCrewTable() {
  const tbody = document.querySelector('#admin-crew-table tbody');
  if (!tbody) return;

  const crew = StorageManager.getCrew();
  tbody.innerHTML = '';

  crew.forEach(member => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><img src="${member.photo}" class="round-avatar" alt="${member.name}"></td>
      <td><strong>${member.name}</strong></td>
      <td>${member.role}</td>
      <td>${member.experience}</td>
      <td><div style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${member.skills}</div></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit-btn" data-id="${member.id}" title="Edit Crew">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="action-btn delete-btn" data-id="${member.id}" title="Delete Crew">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </td>
    `;

    tr.querySelector('.edit-btn').addEventListener('click', () => openEditCrewModal(member.id));
    tr.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm(`Remove ${member.name} from active crew roster?`)) {
        StorageManager.deleteCrewMember(member.id);
        renderCrewTable();
        renderTelemetryStats();
      }
    });

    tbody.appendChild(tr);
  });
}

// 5. Gallery Grid CRUD
function renderGalleryList() {
  const container = document.getElementById('admin-gallery-list');
  if (!container) return;

  const items = StorageManager.getGallery();
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.style.cssText = `
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
    `;

    card.innerHTML = `
      <img src="${item.image}" style="width:100%; height:150px; object-fit:cover; border: 1px solid var(--border-glass);" alt="${item.title}">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h5 style="margin:0; font-size:1.4rem;">${item.title}</h5>
          <span style="font-size:1.1rem; color:var(--color-gold); text-transform:uppercase;">${item.category}</span>
        </div>
        <button class="action-btn delete-btn" style="color:#EF4444;" title="Delete Image">
          <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </button>
      </div>
    `;

    card.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Delete this image from gallery portfolios?')) {
        StorageManager.deleteGalleryImage(item.id);
        renderGalleryList();
        renderTelemetryStats();
      }
    });

    container.appendChild(card);
  });
}

// 6. Settings and owner details populates
function populateSettingsForms() {
  const contact = StorageManager.getContact();
  const socials = StorageManager.getSocials();
  const owner = StorageManager.getOwner();

  // Contact settings fields
  document.getElementById('settings-company').value = contact.companyName;
  document.getElementById('settings-phone').value = contact.phone;
  document.getElementById('settings-email').value = contact.email;
  document.getElementById('settings-address').value = contact.address;
  document.getElementById('settings-whatsapp').value = contact.whatsapp;

  // Social anchors fields
  document.getElementById('settings-fb').value = socials.facebook || '';
  document.getElementById('settings-ig').value = socials.instagram || '';
  document.getElementById('settings-li').value = socials.linkedin || '';
  document.getElementById('settings-yt').value = socials.youtube || '';
  document.getElementById('settings-tw').value = socials.twitter || '';
  document.getElementById('settings-wa-link').value = socials.whatsapp || '';
  document.getElementById('settings-tg').value = socials.telegram || '';

  // Owner fields
  document.getElementById('owner-name').value = owner.name;
  document.getElementById('owner-role').value = owner.designation;
  document.getElementById('owner-exp').value = owner.experience;
  document.getElementById('owner-bio').value = owner.biography;
  document.getElementById('owner-phone').value = owner.contactNumber;
  document.getElementById('owner-wa').value = owner.whatsapp;
  document.getElementById('owner-email').value = owner.email;
}

// Setup Form bindings, add click actions, file uploads, resets
function setupCRUDModals() {
  const layoutsModal = document.getElementById('modal-layouts');
  const crewModal = document.getElementById('modal-crew');
  const galleryModal = document.getElementById('modal-gallery');

  const addLayoutBtn = document.getElementById('btn-add-layout');
  const addCrewBtn = document.getElementById('btn-add-crew');
  const addGalleryBtn = document.getElementById('btn-add-gallery');

  // Close binds
  document.querySelectorAll('.admin-modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.admin-modal').classList.remove('show');
    });
  });

  // Modal displays
  if (addLayoutBtn) addLayoutBtn.addEventListener('click', () => openNewLayoutModal());
  if (addCrewBtn) addCrewBtn.addEventListener('click', () => openNewCrewModal());
  if (addGalleryBtn) addGalleryBtn.addEventListener('click', () => openNewGalleryModal());

  // Layout save form submission listener
  const formLayout = document.getElementById('form-layout-save');
  if (formLayout) {
    formLayout.addEventListener('submit', (e) => {
      e.preventDefault();
      saveLayoutAction();
    });
  }

  // Crew save form submission listener
  const formCrew = document.getElementById('form-crew-save');
  if (formCrew) {
    formCrew.addEventListener('submit', (e) => {
      e.preventDefault();
      saveCrewAction();
    });
  }

  // Gallery save form submission listener
  const formGallery = document.getElementById('form-gallery-save');
  if (formGallery) {
    formGallery.addEventListener('submit', (e) => {
      e.preventDefault();
      saveGalleryAction();
    });
  }

  // Settings Save forms
  const settingsForm = document.getElementById('form-settings-save');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const companyName = document.getElementById('settings-company').value.trim();
      const phone = document.getElementById('settings-phone').value.trim();
      const email = document.getElementById('settings-email').value.trim();
      const address = document.getElementById('settings-address').value.trim();
      const whatsapp = document.getElementById('settings-whatsapp').value.trim();

      StorageManager.updateContact({ companyName, phone, email, address, whatsapp });

      const facebook = document.getElementById('settings-fb').value.trim();
      const instagram = document.getElementById('settings-ig').value.trim();
      const linkedin = document.getElementById('settings-li').value.trim();
      const youtube = document.getElementById('settings-yt').value.trim();
      const twitter = document.getElementById('settings-tw').value.trim();
      const tg = document.getElementById('settings-tg').value.trim();
      const waLink = document.getElementById('settings-wa-link').value.trim();

      StorageManager.updateSocials({ facebook, instagram, linkedin, youtube, twitter, whatsapp: waLink, telegram: tg });

      alert('Contact and social configuration values have been updated successfully.');
      populateSettingsForms();
    });
  }

  // Owner Form Save
  const ownerForm = document.getElementById('form-owner-save');
  if (ownerForm) {
    ownerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('owner-name').value.trim();
      const designation = document.getElementById('owner-role').value.trim();
      const experience = document.getElementById('owner-exp').value.trim();
      const biography = document.getElementById('owner-bio').value.trim();
      const contactNumber = document.getElementById('owner-phone').value.trim();
      const whatsapp = document.getElementById('owner-wa').value.trim();
      const email = document.getElementById('owner-email').value.trim();

      const imageFile = document.getElementById('owner-photo-file');

      const saveOwner = (photoUrl) => {
        const payload = { name, designation, experience, biography, contactNumber, whatsapp, email };
        if (photoUrl) payload.photo = photoUrl;
        StorageManager.updateOwner(payload);
        alert('Owner profile configuration has been successfully updated.');
      };

      if (imageFile.files && imageFile.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => saveOwner(event.target.result);
        reader.readAsDataURL(imageFile.files[0]);
      } else {
        saveOwner(null);
      }
    });
  }

  // Reset Application Data button trigger
  const resetBtn = document.getElementById('btn-reset-db');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('DANGER: Resetting will clear all client site-visit logs and custom layouts, reverting to default seeded data. Continue?')) {
        StorageManager.resetAll();
        window.location.reload();
      }
    });
  }
}

// LAYOUT SAVE DETAILS CRUD
let activeLayoutId = null; // tracking if edit or add

function openNewLayoutModal() {
  activeLayoutId = null;
  document.getElementById('layout-modal-title').innerText = 'Add New Luxury Layout';
  document.getElementById('form-layout-save').reset();
  document.getElementById('layout-image-preview').innerHTML = '';
  document.getElementById('modal-layouts').classList.add('show');
}

function openEditLayoutModal(id) {
  activeLayoutId = id;
  const layouts = StorageManager.getLayouts();
  const item = layouts.find(l => l.id === id);

  if (!item) return;

  document.getElementById('layout-modal-title').innerText = 'Edit Property Layout Details';
  
  // Fill inputs
  document.getElementById('layout-name').value = item.name;
  document.getElementById('layout-location').value = item.location;
  document.getElementById('layout-address').value = item.address;
  document.getElementById('layout-district').value = item.district;
  document.getElementById('layout-state').value = item.state;
  document.getElementById('layout-pincode').value = item.pincode;
  document.getElementById('layout-price').value = item.price;
  document.getElementById('layout-plots').value = item.availablePlots;
  document.getElementById('layout-area').value = item.totalArea;
  document.getElementById('layout-sizes').value = item.plotSizes;
  document.getElementById('layout-road').value = item.roadWidth;
  document.getElementById('layout-status').value = item.status;
  document.getElementById('layout-desc').value = item.description;
  document.getElementById('layout-maps').value = item.mapsUrl;
  
  // Fill textareas comma separates
  document.getElementById('layout-amenities').value = item.amenities.join(', ');
  
  const nearbyStr = item.nearby.map(n => `${n.name}:${n.type}:${n.distance}`).join(', ');
  document.getElementById('layout-nearby').value = nearbyStr;

  // Render photo preview
  document.getElementById('layout-image-preview').innerHTML = `<img src="${item.image}" style="width:100px;height:75px;object-fit:cover;">`;

  document.getElementById('modal-layouts').classList.add('show');
}

function saveLayoutAction() {
  const name = document.getElementById('layout-name').value.trim();
  const location = document.getElementById('layout-location').value.trim();
  const address = document.getElementById('layout-address').value.trim();
  const district = document.getElementById('layout-district').value.trim();
  const state = document.getElementById('layout-state').value.trim();
  const pincode = document.getElementById('layout-pincode').value.trim();
  const price = parseFloat(document.getElementById('layout-price').value);
  const availablePlots = parseInt(document.getElementById('layout-plots').value);
  const totalArea = parseFloat(document.getElementById('layout-area').value);
  const plotSizes = document.getElementById('layout-sizes').value.trim();
  const roadWidth = document.getElementById('layout-road').value.trim();
  const status = document.getElementById('layout-status').value;
  const description = document.getElementById('layout-desc').value.trim();
  const mapsUrl = document.getElementById('layout-maps').value.trim();

  // Parsing Lists
  const amenities = document.getElementById('layout-amenities').value.split(',').map(s => s.trim()).filter(s => s);
  
  const nearbyInput = document.getElementById('layout-nearby').value;
  const nearby = nearbyInput.split(',').map(s => {
    const parts = s.split(':').map(p => p.trim());
    if (parts.length === 3) {
      return { name: parts[0], type: parts[1], distance: parts[2] };
    }
    return null;
  }).filter(n => n);

  const fileInput = document.getElementById('layout-image-file');

  const executeSave = (photoUrl) => {
    const payload = {
      name, location, address, district, state, pincode, price,
      availablePlots, totalArea, plotSizes, roadWidth, status,
      description, mapsUrl, amenities, nearby
    };

    if (photoUrl) {
      payload.image = photoUrl;
      payload.gallery = [photoUrl]; // init gallery with main photo
    }

    if (activeLayoutId) {
      StorageManager.editLayout(activeLayoutId, payload);
    } else {
      // Set a placeholder image if not uploaded
      if (!payload.image) {
        payload.image = 'assets/images/layout1.jpg';
        payload.gallery = ['assets/images/layout1.jpg'];
      }
      StorageManager.addLayout(payload);
    }

    document.getElementById('modal-layouts').classList.remove('show');
    renderLayoutsTable();
    renderTelemetryStats();
    alert('Layout saved successfully.');
  };

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => executeSave(e.target.result);
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    executeSave(null);
  }
}

// CREW CMS CRUD
let activeCrewId = null;

function openNewCrewModal() {
  activeCrewId = null;
  document.getElementById('crew-modal-title').innerText = 'Add Crew Member';
  document.getElementById('form-crew-save').reset();
  document.getElementById('crew-image-preview').innerHTML = '';
  document.getElementById('modal-crew').classList.add('show');
}

function openEditCrewModal(id) {
  activeCrewId = id;
  const crew = StorageManager.getCrew();
  const member = crew.find(c => c.id === id);

  if (!member) return;

  document.getElementById('crew-modal-title').innerText = 'Edit Crew Member Details';
  document.getElementById('crew-name').value = member.name;
  document.getElementById('crew-role').value = member.role;
  document.getElementById('crew-exp').value = member.experience;
  document.getElementById('crew-skills').value = member.skills;

  document.getElementById('crew-image-preview').innerHTML = `<img src="${member.photo}" style="width:80px;height:80px;object-fit:cover;border-radius:50%;">`;
  document.getElementById('modal-crew').classList.add('show');
}

function saveCrewAction() {
  const name = document.getElementById('crew-name').value.trim();
  const role = document.getElementById('crew-role').value.trim();
  const experience = document.getElementById('crew-exp').value.trim();
  const skills = document.getElementById('crew-skills').value.trim();

  const fileInput = document.getElementById('crew-image-file');

  const executeSave = (photoUrl) => {
    const payload = { name, role, experience, skills };
    if (photoUrl) payload.photo = photoUrl;

    if (activeCrewId) {
      StorageManager.editCrewMember(activeCrewId, payload);
    } else {
      if (!payload.photo) payload.photo = 'assets/images/crew1.jpg'; // default placeholder
      StorageManager.addCrewMember(payload);
    }

    document.getElementById('modal-crew').classList.remove('show');
    renderCrewTable();
    renderTelemetryStats();
    alert('Crew records updated.');
  };

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => executeSave(e.target.result);
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    executeSave(null);
  }
}

// GALLERY CMS CRUD
function openNewGalleryModal() {
  document.getElementById('form-gallery-save').reset();
  document.getElementById('modal-gallery').classList.add('show');
}

function saveGalleryAction() {
  const title = document.getElementById('gallery-title').value.trim();
  const category = document.getElementById('gallery-category').value;
  const fileInput = document.getElementById('gallery-image-file');

  if (!fileInput.files || !fileInput.files[0]) {
    alert('Please choose an image file to upload.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const photoUrl = e.target.result;
    StorageManager.addGalleryImage({ title, category, image: photoUrl });
    
    document.getElementById('modal-gallery').classList.remove('show');
    renderGalleryList();
    renderTelemetryStats();
    alert('Image added to active portfolio gallery.');
  };
  reader.readAsDataURL(fileInput.files[0]);
}
