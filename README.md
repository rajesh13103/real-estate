# Luxury Real Estate & Design Enterprise Web Application

An ultra-premium, production-ready corporate web application built for a high-end real estate entrepreneur selling layouts/plots, luxury interior designs, and custom residential/commercial building constructions. 

Featuring cinematic dark branding with gold accents, advanced scroll-reveal animations, custom mouse cursor tracks, 3D card rotating mechanics, draggable before/after space remodels, and a secure client-side admin content management dashboard.

---

## Technical Architecture & Design System

- **Core Engine:** HTML5, CSS3 (CSS variables, Grid, Flexbox), and Vanilla JavaScript (ES6 Modules).
- **No Frameworks/Libraries:** Built completely without React, Angular, Vue, jQuery, Bootstrap, or Tailwind to maintain pure native compliance, fast loading speeds, and clean structural integrity.
- **Design Typography:** Google Fonts - Headings: `Playfair Display`, Body: `Poppins`.
- **Theme Palette:**
  - Primary Deep Black: `#0A0A0A`
  - Luxury Gold Accent: `#D4AF37`
  - Champagne Accent: `#E6C87A`
  - Secondary Slate Gray: `#111827`
  - Silver Text: `#C0C0C0`
  - Frosted Glassmorphism: `rgba(255, 255, 255, 0.04)` with backdrop blur filters.

---

## Directory Organization

```text
Luxury-Real-Estate/
├── index.html            # Cinematic Home landing
├── layouts.html          # Interactive search & filter listings
├── layout-details.html   # Specifications sheet, plot maps, and visit scheduler
├── services.html         # Three corporate pillars overview
├── interior.html         # Interior room catalog & Before/After draggable slider
├── construction.html     # Construction workflow stages timeline & material charts
├── gallery.html          # Tabbed masonry image grid with modal lightboxes
├── testimonials.html     # Customer reviews archive
├── contact.html          # Corporate coordinates, support forms, and active maps
├── login.html            # Owner panel 3D flip card access gate
├── admin.html            # CMS content control panel & booking inquiries tracker
│
├── css/
│   ├── style.css         # Global variables, sticky headers, cursors and footers
│   ├── animations.css    # Keyframes, hover-glow and viewport scroll entrance reveals
│   ├── components.css    # Preloaders, buttons, card widgets, forms, and lightboxes
│   ├── layouts.css       # Listing controls, details specification columns
│   ├── admin.css         # Dashboards, metrics grid, data logs, and modal styles
│   └── responsive.css    # Safe-areas and media overrides for mobile and landscape viewports
│
├── js/
│   ├── main.js           # Core controller, menu toggles, and cursor position tracking
│   ├── animations.js     # Viewport Intersection Observers & card mouse-tilt controls
│   ├── layouts.js        # Search filters matching & detail sliders
│   ├── gallery.js        # Masonry categorizations & lightbox slide keybinds
│   ├── contact.js        # Contact validations & submission overlays
│   ├── storage.js        # Reusable localDB simulator (CRUD & pre-seeded items)
│   ├── auth.js           # Session auth controls & route protection guards
│   ├── validation.js     # Shared inputs email, phone and date checkers
│   └── admin.js          # Telemetry counters, CRUD triggers and Base64 file loaders
│
├── assets/
│   └── images/           # High-res luxury branding photography
├── sitemap.xml           # SEO search engine sitemap
├── robots.txt            # Search engine crawler instructions
└── README.md             # Project documentation guide
```

---

## Security & Database Simulation

- **Pre-seeded Database:** On initial launch, `js/storage.js` populates `localStorage` with:
  - 4 Premium property layouts (complete with locations, prices, specifications, and landmarks lists).
  - 15 Expert crew members (name, role, experience, skills, avatar photo).
  - 3 Luxury customer testimonials.
  - 9 Portfolio gallery projects.
- **Admin Dashboard CRUD:** The owner can add/edit/delete layout listings, crew rosters, testimonials, and portfolio items.
- **Base64 Photo Uploads:** File selectors in the admin panel convert images into persistent Base64 Data URLs, enabling dynamic image changes directly in the client browser without a backend file server.
- **Site Visit Scheduler:** Booking inquiries on layouts are stored in `localStorage` and viewable under the admin **Site Visits Logs** tab.
- **Session Guards:** Secure admin routes redirect unauthenticated users back to `login.html`.

---

## Admin Panel Credentials

Access the dashboard via `/login.html`:
- **Username:** `admin`
- **Password:** `admin123`

---

## Local Serve Setup

> [!WARNING]
> Because this application is modular and imports ES6 JavaScript modules (`type="module"`), opening `index.html` directly using the `file://` protocol in the browser will result in **CORS browser blocking**. The project must be served over an HTTP local server.

### Option 1: Python Local Server (Recommended)
If you have Python installed, open terminal/PowerShell inside the project root directory and run:
```bash
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

### Option 2: Node.js Serve
If you have Node.js installed, run:
```bash
npx serve
```
Then navigate to: `http://localhost:3000` or the port displayed in your terminal.

---

## GitHub Pages Deployment

Since the application is 100% static (HTML, CSS, Vanilla JS, and LocalStorage), it is **fully compatible with GitHub Pages** and can be deployed without modifications:

1. Push this codebase to a GitHub Repository (e.g. `yourusername/luxury-real-estate`).
2. Go to the repository **Settings** tab.
3. Select **Pages** from the sidebar.
4. Set the Build and deployment source to **Deploy from a branch**.
5. Select the branch (e.g., `main` or `master`) and folder (select `/` root).
6. Click **Save**. Within 1-2 minutes, your website will be live at `https://yourusername.github.io/luxury-real-estate/`.
