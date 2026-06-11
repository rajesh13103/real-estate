// js/storage.js
// Reusable LocalStorage database engine for the Luxury Real Estate application

const KEYS = {
  LAYOUTS: 'luxury_re_layouts',
  GALLERY: 'luxury_re_gallery',
  TESTIMONIALS: 'luxury_re_testimonials',
  CREW: 'luxury_re_crew',
  SOCIALS: 'luxury_re_socials',
  CONTACT: 'luxury_re_contact',
  OWNER: 'luxury_re_owner',
  INQUIRIES: 'luxury_re_inquiries'
};

// Seed Data
const DEFAULT_OWNER = {
  name: "Vikramaditya Raj",
  designation: "Managing Director & Founder",
  companyName: "Raj Luxury Estates & Design",
  experience: "18+ Years",
  photo: "assets/images/owner.jpg",
  biography: "Vikramaditya Raj is a visionary entrepreneur and real estate strategist with over 18 years of pioneering excellence in luxury land layouts, premium architectural planning, and custom turnkey constructions. Under his leadership, the firm has delivered over 150 high-end residential and commercial estates across South India, setting new benchmarks for quality, sustainability, and aesthetic grandeur. He holds a Master's degree in Real Estate Development and Urban Systems.",
  contactNumber: "+91 98765 43210",
  whatsapp: "+919876543210",
  email: "founder@rajluxury.com",
  officeAddress: "The Gold Arch Suite 501, 80 Feet Road, Koramangala, Bangalore, Karnataka - 560034",
  verifiedBadge: true,
  socials: {
    facebook: "https://facebook.com/rajluxury",
    instagram: "https://instagram.com/rajluxury",
    linkedin: "https://linkedin.com/in/rajluxury",
    youtube: "https://youtube.com/c/rajluxury",
    twitter: "https://twitter.com/rajluxury"
  }
};

const DEFAULT_SOCIALS = {
  facebook: "https://facebook.com/rajluxury",
  instagram: "https://instagram.com/rajluxury",
  linkedin: "https://linkedin.com/in/rajluxury",
  youtube: "https://youtube.com/c/rajluxury",
  twitter: "https://twitter.com/rajluxury",
  whatsapp: "https://wa.me/919876543210",
  telegram: "https://t.me/rajluxury"
};

const DEFAULT_CONTACT = {
  companyName: "Raj Luxury Estates & Design",
  ownerName: "Vikramaditya Raj",
  address: "The Gold Arch Suite 501, 80 Feet Road, Koramangala, Bangalore, Karnataka - 560034",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  email: "inquiries@rajluxury.com"
};

const DEFAULT_CREW = [
  { id: "crew-1", name: "Ananya Deshmukh", role: "Principal Architect & Partner", experience: "12 Years", skills: "Architectural Planning, Luxury Villa Concept Design, Sustainability", photo: "assets/images/crew1.jpg" },
  { id: "crew-2", name: "Rohan Kapoor", role: "Head of Interior Design", experience: "10 Years", skills: "Italian Kitchen Layouts, Classical European Theme, Space Planning", photo: "assets/images/crew2.jpg" },
  { id: "crew-3", name: "Gurpreet Singh", role: "Chief Construction Engineer", experience: "15 Years", skills: "RCC Framing, High-Rise Foundation, Seismic Safety Standards", photo: "assets/images/crew3.jpg" },
  { id: "crew-4", name: "Meera Nair", role: "Senior Space Planner & Interiorist", experience: "8 Years", skills: "Ergonomics, Living Room Ergonomic Lighting, Color Theory", photo: "assets/images/crew4.jpg" },
  { id: "crew-5", name: "Nikhil Kamath", role: "Project Manager (Turnkey Services)", experience: "9 Years", skills: "CPM/PERT Planning, Vendor Negotiations, Fast-Track Execution", photo: "assets/images/crew5.jpg" },
  { id: "crew-6", name: "Suresh Hegde", role: "Lead Site Supervisor", experience: "14 Years", skills: "Material Quality Control, Concrete Pour Supervision, Safety Audits", photo: "assets/images/crew6.jpg" },
  { id: "crew-7", name: "Priya Sen", role: "Modular Kitchen Specialist", experience: "7 Years", skills: "Hafele Hardware, Acrylic Finishes, Space Optimization", photo: "assets/images/crew7.jpg" },
  { id: "crew-8", name: "Amit Sharma", role: "Estimation & Cost Engineer", experience: "8 Years", skills: "Bill of Quantities (BOQ), Material Procurement, Value Engineering", photo: "assets/images/crew8.jpg" },
  { id: "crew-9", name: "Zara Khan", role: "Lighting & Home Automation Expert", experience: "6 Years", skills: "Lutron Programming, DALI Controls, Acoustic Integration", photo: "assets/images/crew9.jpg" },
  { id: "crew-10", name: "Dinesh Kumar", role: "Structural Analysis consultant", experience: "11 Years", skills: "ETABS, FEM Modeling, Soil Bearing Capacity Analysis", photo: "assets/images/crew10.jpg" },
  { id: "crew-11", name: "Tanvi Rao", role: "Landscaping & Layout Consultant", experience: "9 Years", skills: "Urban Forestry, Contour Site Layouts, Green Belt Planning", photo: "assets/images/crew11.jpg" },
  { id: "crew-12", name: "Vijay Raghunath", role: "Site Supervisor (Plumbing & MEP)", experience: "10 Years", skills: "Drainage Layout Design, HVAC Duct Coordination, Fire Systems", photo: "assets/images/crew12.jpg" },
  { id: "crew-13", name: "Rachel D'Souza", role: "Premium Furniture & Decor Curator", experience: "7 Years", skills: "Bespoke Sofa Framing, Italian Marble Sourcing, Fabric Selection", photo: "assets/images/crew13.jpg" },
  { id: "crew-14", name: "Vikram Malhotra", role: "Finishing Foreman", experience: "12 Years", skills: "Gypsum Plastering, Italian Marble Polishing, Quality Finishing", photo: "assets/images/crew14.jpg" },
  { id: "crew-15", name: "Sunita Reddy", role: "Customer Relations Manager", experience: "5 Years", skills: "Site Visit Coordination, Documentation Liaison, After-Sales Help", photo: "assets/images/crew15.jpg" }
];

const DEFAULT_TESTIMONIALS = [
  {
    id: "test-1",
    name: "Dr. Aravind Swamy",
    projectName: "Golden Crest Boulevard Plot #14",
    review: "The layout development by Raj Luxury is simply impeccable. They delivered wide asphalt roads, underground cabling, and beautifully landscaped parks exactly as promised. Building my dream villa here has been an exceptional experience.",
    rating: 5,
    photo: "assets/images/client1.jpg"
  },
  {
    id: "test-2",
    name: "Karan & Natasha Malhotra",
    projectName: "Modular Villa Interior at Indiranagar",
    review: "The interior design team turned our apartment into a masterfully crafted sanctuary. The attention to detail on the modular kitchen and custom false ceilings is world-class. Absolute value for money.",
    rating: 5,
    photo: "assets/images/client2.jpg"
  },
  {
    id: "test-3",
    name: "Sharat Chander",
    projectName: "3-Storey Luxury Residence Construction",
    review: "Raj Construction delivered our turnkey residential home on time. Vikram and his supervisors managed everything from foundation to the final coat of paint with sheer professionalism. I highly recommend them for high-end turnkey building projects.",
    rating: 5,
    photo: "assets/images/client3.jpg"
  }
];

const DEFAULT_LAYOUTS = [
  {
    id: "layout-1",
    name: "Aura Ridge Estates",
    location: "Devanahalli, Bangalore",
    address: "Survey No. 102/4, Off NH 44, Near Kempegowda International Airport",
    district: "Bangalore Rural",
    state: "Karnataka",
    pincode: "562110",
    price: 8400000,
    availablePlots: 14,
    totalArea: 48000,
    plotSizes: "1200, 1500, 2400, 4000 sq.ft.",
    roadWidth: "40 ft & 60 ft Asphalt Wide Roads",
    status: "Limited Availability",
    description: "A prestigious and ultra-exclusive gated layout project in the fast-growing northern sector of Bangalore. Surrounded by natural groves and boasting state-of-the-art infrastructure including subterranean plumbing, high-security gatehouses, and multiple theme-gardens. Fully approved by local urban authorities with individual clear titles.",
    mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15535.48512411894!2d77.7012678!3d13.2335198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1cfe893eb675%3A0xe54e60156d11cd12!2sDevanahalli%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000",
    image: "assets/images/layout1.jpg",
    gallery: [
      "assets/images/layout1_1.jpg",
      "assets/images/layout1_2.jpg",
      "assets/images/layout1_3.jpg"
    ],
    amenities: ["Water Connection", "Subterranean Electricity", "Stormwater Drainage", "24/7 Guards & CCTV", "Jogging Track & Parks", "Clubhouse Arena"],
    nearby: [
      { name: "KIAL Airport", type: "Transport", distance: "9.5" },
      { name: "Orchid Heritage School", type: "Education", distance: "3.2" },
      { name: "Manipal Hospital", type: "Healthcare", distance: "8.0" },
      { name: "Signature Galleria Mall", type: "Commercial", distance: "4.5" }
    ]
  },
  {
    id: "layout-2",
    name: "Golden Crest Boulevard",
    location: "Kanakapura Road, Bangalore",
    address: "Survey No. 45/1A, Next to Art of Living Ashram, Kanakapura Road",
    district: "Bangalore Urban",
    state: "Karnataka",
    pincode: "560082",
    price: 12500000,
    availablePlots: 26,
    totalArea: 72000,
    plotSizes: "1500, 2400, 3200, 5000 sq.ft.",
    roadWidth: "40 ft, 50 ft & 80 ft Concrete Avenue Roads",
    status: "Available",
    description: "An extraordinary premium layout situated in Bangalore's greenest corridor, Kanakapura Road. Experience breathtaking views of the surrounding hills, combined with world-class facilities. This eco-friendly gated township incorporates rainwater harvesting nodes, bio-retention ponds, and fully underground conduits for power and high-speed fiber internet.",
    mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.8522304928236!2d77.5029056!3d12.8528373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae4062f627d353%3A0xe54e60156d11cd12!2sKanakapura%20Rd%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000001",
    image: "assets/images/layout2.jpg",
    gallery: [
      "assets/images/layout2_1.jpg",
      "assets/images/layout2_2.jpg",
      "assets/images/layout2_3.jpg"
    ],
    amenities: ["Water Connection", "Underground Electrical Conduits", "Box Drain Networks", "CCTV Guard System", "Rainwater Harvesting Panels", "Yoga & Meditation Deck"],
    nearby: [
      { name: "Metro Station (Silk Institute)", type: "Transport", distance: "2.1" },
      { name: "Delhi Public School", type: "Education", distance: "4.8" },
      { name: "Fortis Hospital", type: "Healthcare", distance: "11.2" },
      { name: "Metro Cash & Carry", type: "Commercial", distance: "7.0" }
    ]
  },
  {
    id: "layout-3",
    name: "Lakeside Royale Manor",
    location: "Whitefield, Bangalore",
    address: "Survey No. 88, Varthur Lake Road, Whitefield",
    district: "Bangalore Urban",
    state: "Karnataka",
    pincode: "560066",
    price: 18000000,
    availablePlots: 0,
    totalArea: 35000,
    plotSizes: "2400, 4000, 6000 sq.ft.",
    roadWidth: "60 ft Double-lane Asphalt Boulevard",
    status: "Sold Out",
    description: "An ultimate address for ultra-luxury residential plots, right at the edge of the scenic Varthur Lake perimeter in IT corridor Whitefield. The layout features wide paved pathways, bespoke solar streetlights, an fully operational sports pavilion, and round-the-clock patrol security. Now completely sold out and in the construction phase for elite mansions.",
    mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15553.189511653818!2d77.7471183!3d12.9538356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae11e2410a3021%3A0xe54e60156d11cd12!2sWhitefield%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000002",
    image: "assets/images/layout3.jpg",
    gallery: [
      "assets/images/layout3_1.jpg",
      "assets/images/layout3_2.jpg"
    ],
    amenities: ["Self-Reliant Water Tank", "Sub-Surface Wiring System", "Integrated Sewers", "Armored Guard Gatehouse", "Lakeside Promenade", "Swimming Pool & Gym"],
    nearby: [
      { name: "Whitefield Railway Station", type: "Transport", distance: "5.4" },
      { name: "The Deens Academy", type: "Education", distance: "1.8" },
      { name: "Columbia Asia Hospital", type: "Healthcare", distance: "2.5" },
      { name: "Forum Shantiniketan Mall", type: "Commercial", distance: "3.2" }
    ]
  },
  {
    id: "layout-4",
    name: "The Platinum Sereno",
    location: "Sarjapur Road, Bangalore",
    address: "Survey No. 204, Off Sarjapur-Attibele Road",
    district: "Bangalore Urban",
    state: "Karnataka",
    pincode: "562125",
    price: 9800000,
    availablePlots: 12,
    totalArea: 40000,
    plotSizes: "1200, 1500, 2400 sq.ft.",
    roadWidth: "40 ft Asphalt Roads",
    status: "Upcoming",
    description: "Launch of premium boutique plots designed for investors seeking high returns in Sarjapur, the key IT connectivity junction. Featuring fully customized villa designs options, manicured flower beds, smart waste management, and dedicated kids playing areas. Booking slots opening shortly.",
    mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.6974246830536!2d77.7831206!3d12.8628373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae739c9462f627%3A0xe54e60156d11cd12!2sSarjapur%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000003",
    image: "assets/images/layout4.jpg",
    gallery: [
      "assets/images/layout4_1.jpg"
    ],
    amenities: ["Water Lines", "Smart Solar Lighting", "Pre-laid PVC Pipelines", "24/7 Security", "Flower Gardens", "Reflexology Path"],
    nearby: [
      { name: "Heelalige Railway Station", type: "Transport", distance: "8.5" },
      { name: "Greenwood High School", type: "Education", distance: "5.0" },
      { name: "Narayana Health City", type: "Healthcare", distance: "9.2" },
      { name: "Decathlon Sarjapur", type: "Commercial", distance: "6.1" }
    ]
  }
];

const DEFAULT_GALLERY = [
  { id: "gal-1", title: "Sunset view at Aura Ridge Plots", category: "layouts", image: "assets/images/gal1.jpg" },
  { id: "gal-2", title: "Modern Villa Structural concrete frame", category: "construction", image: "assets/images/gal2.jpg" },
  { id: "gal-3", title: "Glassmorphic Living Room Lounge", category: "interiors", image: "assets/images/gal3.jpg" },
  { id: "gal-4", title: "Avenue Roads of Golden Crest", category: "layouts", image: "assets/images/gal4.jpg" },
  { id: "gal-5", title: "Modular Premium Kitchen Cabinetry", category: "interiors", image: "assets/images/gal5.jpg" },
  { id: "gal-6", title: "Commercial Office Complex Facade", category: "construction", image: "assets/images/gal6.jpg" },
  { id: "gal-7", title: "Cozy Bedroom Accent Lighting", category: "interiors", image: "assets/images/gal7.jpg" },
  { id: "gal-8", title: "Lakeside Promenade Paving Work", category: "layouts", image: "assets/images/gal8.jpg" },
  { id: "gal-9", title: "Villa Turnkey Plastering Phase", category: "construction", image: "assets/images/gal9.jpg" }
];

// LocalStorage Helper functions
export const StorageManager = {
  init() {
    if (!localStorage.getItem(KEYS.OWNER)) {
      localStorage.setItem(KEYS.OWNER, JSON.stringify(DEFAULT_OWNER));
    }
    if (!localStorage.getItem(KEYS.SOCIALS)) {
      localStorage.setItem(KEYS.SOCIALS, JSON.stringify(DEFAULT_SOCIALS));
    }
    if (!localStorage.getItem(KEYS.CONTACT)) {
      localStorage.setItem(KEYS.CONTACT, JSON.stringify(DEFAULT_CONTACT));
    }
    if (!localStorage.getItem(KEYS.CREW)) {
      localStorage.setItem(KEYS.CREW, JSON.stringify(DEFAULT_CREW));
    }
    if (!localStorage.getItem(KEYS.TESTIMONIALS)) {
      localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(DEFAULT_TESTIMONIALS));
    }
    if (!localStorage.getItem(KEYS.LAYOUTS)) {
      localStorage.setItem(KEYS.LAYOUTS, JSON.stringify(DEFAULT_LAYOUTS));
    }
    if (!localStorage.getItem(KEYS.GALLERY)) {
      localStorage.setItem(KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
    }
    if (!localStorage.getItem(KEYS.INQUIRIES)) {
      localStorage.setItem(KEYS.INQUIRIES, JSON.stringify([]));
    }
  },

  // GETTERS
  getOwner() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.OWNER));
  },
  getSocials() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.SOCIALS));
  },
  getContact() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.CONTACT));
  },
  getCrew() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.CREW));
  },
  getTestimonials() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.TESTIMONIALS));
  },
  getLayouts() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.LAYOUTS));
  },
  getGallery() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.GALLERY));
  },
  getInquiries() {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.INQUIRIES));
  },

  // SETTERS / UPDATERS / CRUD

  // Owner
  updateOwner(ownerData) {
    const current = this.getOwner();
    const updated = { ...current, ...ownerData };
    localStorage.setItem(KEYS.OWNER, JSON.stringify(updated));
    return updated;
  },

  // Socials
  updateSocials(socialData) {
    const current = this.getSocials();
    const updated = { ...current, ...socialData };
    localStorage.setItem(KEYS.SOCIALS, JSON.stringify(updated));
    return updated;
  },

  // Contact Info
  updateContact(contactData) {
    const current = this.getContact();
    const updated = { ...current, ...contactData };
    localStorage.setItem(KEYS.CONTACT, JSON.stringify(updated));
    return updated;
  },

  // Layouts CRUD
  addLayout(layout) {
    const layouts = this.getLayouts();
    const newLayout = {
      id: 'layout-' + Date.now(),
      ...layout
    };
    layouts.push(newLayout);
    localStorage.setItem(KEYS.LAYOUTS, JSON.stringify(layouts));
    return newLayout;
  },
  editLayout(id, updatedLayout) {
    const layouts = this.getLayouts();
    const index = layouts.findIndex(l => l.id === id);
    if (index !== -1) {
      layouts[index] = { ...layouts[index], ...updatedLayout };
      localStorage.setItem(KEYS.LAYOUTS, JSON.stringify(layouts));
      return layouts[index];
    }
    return null;
  },
  deleteLayout(id) {
    let layouts = this.getLayouts();
    layouts = layouts.filter(l => l.id !== id);
    localStorage.setItem(KEYS.LAYOUTS, JSON.stringify(layouts));
  },

  // Crew CRUD
  addCrewMember(member) {
    const crew = this.getCrew();
    const newMember = {
      id: 'crew-' + Date.now(),
      ...member
    };
    crew.push(newMember);
    localStorage.setItem(KEYS.CREW, JSON.stringify(crew));
    return newMember;
  },
  editCrewMember(id, updatedMember) {
    const crew = this.getCrew();
    const index = crew.findIndex(c => c.id === id);
    if (index !== -1) {
      crew[index] = { ...crew[index], ...updatedMember };
      localStorage.setItem(KEYS.CREW, JSON.stringify(crew));
      return crew[index];
    }
    return null;
  },
  deleteCrewMember(id) {
    let crew = this.getCrew();
    crew = crew.filter(c => c.id !== id);
    localStorage.setItem(KEYS.CREW, JSON.stringify(crew));
  },

  // Gallery CRUD
  addGalleryImage(img) {
    const gallery = this.getGallery();
    const newImg = {
      id: 'gal-' + Date.now(),
      ...img
    };
    gallery.push(newImg);
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(gallery));
    return newImg;
  },
  deleteGalleryImage(id) {
    let gallery = this.getGallery();
    gallery = gallery.filter(g => g.id !== id);
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(gallery));
  },

  // Testimonials CRUD
  addTestimonial(test) {
    const testimonials = this.getTestimonials();
    const newTest = {
      id: 'test-' + Date.now(),
      ...test
    };
    testimonials.push(newTest);
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
    return newTest;
  },
  editTestimonial(id, updatedTest) {
    const testimonials = this.getTestimonials();
    const index = testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
      testimonials[index] = { ...testimonials[index], ...updatedTest };
      localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
      return testimonials[index];
    }
    return null;
  },
  deleteTestimonial(id) {
    let testimonials = this.getTestimonials();
    testimonials = testimonials.filter(t => t.id !== id);
    localStorage.setItem(KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  },

  // Inquiries / Booking Management
  addInquiry(inquiry) {
    const inquiries = this.getInquiries();
    const newInquiry = {
      id: 'inq-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'new',
      ...inquiry
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries));
    return newInquiry;
  },
  deleteInquiry(id) {
    let inquiries = this.getInquiries();
    inquiries = inquiries.filter(i => i.id !== id);
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(inquiries));
  },

  // Reset helper to revert to seed databases
  resetAll() {
    localStorage.removeItem(KEYS.OWNER);
    localStorage.removeItem(KEYS.SOCIALS);
    localStorage.removeItem(KEYS.CONTACT);
    localStorage.removeItem(KEYS.CREW);
    localStorage.removeItem(KEYS.TESTIMONIALS);
    localStorage.removeItem(KEYS.LAYOUTS);
    localStorage.removeItem(KEYS.GALLERY);
    localStorage.removeItem(KEYS.INQUIRIES);
    this.init();
  }
};
