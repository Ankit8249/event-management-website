(function() {
  // ---------- EVENT DATA ----------
  const events = [
    {
      id: 1,
      title: "FutureTech Summit 2025",
      category: "conference",
      date: "2025-06-18",
      displayDate: "Wed, Jun 18 · 9:00 AM",
      venue: "Silicon Valley Convention Center",
      description: "Explore the latest in AI, cloud and edge computing with industry leaders.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "UI/UX Masterclass",
      category: "workshop",
      date: "2025-07-05",
      displayDate: "Sat, Jul 5 · 10:00 AM",
      venue: "DesignLab, Brooklyn",
      description: "Hands-on workshop on design systems, prototyping and accessibility.",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "Summer Beats Festival",
      category: "music",
      date: "2025-08-22",
      displayDate: "Fri, Aug 22 · 6:00 PM",
      venue: "Sunset Park Amphitheater",
      description: "An open-air concert featuring top indie and electronic artists.",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 4,
      title: "City Marathon 2025",
      category: "sports",
      date: "2025-09-14",
      displayDate: "Sun, Sep 14 · 7:00 AM",
      venue: "Downtown Riverside",
      description: "Annual charity marathon – 5K, 10K and half marathon options.",
      image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 5,
      title: "Modern Art Expo",
      category: "art",
      date: "2025-10-02",
      displayDate: "Thu, Oct 2 · 11:00 AM",
      venue: "Metropolitan Gallery",
      description: "Contemporary paintings, digital art and interactive installations.",
      image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&auto=format&fit=crop&q=60"
    },
    {
      id: 6,
      title: "AI & Ethics Forum",
      category: "conference",
      date: "2025-11-10",
      displayDate: "Mon, Nov 10 · 1:00 PM",
      venue: "Innovation Hub, Boston",
      description: "Panel discussion on responsible AI and future regulations.",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=60"
    }
  ];

  // ---------- STATE ----------
  let currentCategory = 'all';
  let currentSearch = '';
  let registeredEvents = JSON.parse(localStorage.getItem('registeredEvents')) || [];

  // DOM
  const eventsGrid = document.getElementById('eventsGrid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');

  // ---------- RENDER ----------
  function getFilteredEvents() {
    return events.filter(event => {
      const matchesCategory = currentCategory === 'all' || event.category === currentCategory;
      const searchLower = currentSearch.toLowerCase();
      const matchesSearch =
        event.title.toLowerCase().includes(searchLower) ||
        event.venue.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }

  function renderEvents() {
    const filtered = getFilteredEvents();
    if (filtered.length === 0) {
      eventsGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-secondary);">
        <i class="fas fa-calendar-times" style="font-size:2rem; margin-bottom:1rem; display:block;"></i>
        <p>No events match your search. Try different keywords.</p>
      </div>`;
      return;
    }

    eventsGrid.innerHTML = filtered.map(event => {
      const isRegistered = registeredEvents.includes(event.id);
      return `
        <div class="event-card" data-id="${event.id}">
          <div class="card-image" style="background-image: url('${event.image}');">
            <span class="category-badge">${event.category}</span>
          </div>
          <div class="card-content">
            <div class="event-date">
              <i class="far fa-calendar-alt"></i> ${event.displayDate}
            </div>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-venue">
              <i class="fas fa-map-marker-alt"></i> ${event.venue}
            </div>
            <p class="event-desc">${event.description}</p>
            <button class="btn-register" data-id="${event.id}" ${isRegistered ? 'disabled style="opacity:0.6;cursor:default;"' : ''}>
              <i class="fas ${isRegistered ? 'fa-check-circle' : 'fa-pen'}"></i>
              ${isRegistered ? 'Registered ✓' : 'Register now'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.btn-register:not([disabled])').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openRegistrationModal(Number(btn.dataset.id));
      });
    });
  }

  // ---------- MODAL ----------
  function openRegistrationModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event || registeredEvents.includes(eventId)) return;

    modalContent.innerHTML = `
      <button class="close-modal" id="closeModalBtn"><i class="fas fa-times"></i></button>
      <h2>Register</h2>
      <div class="event-name-modal">${event.title}</div>
      <form id="registrationForm">
        <div class="form-group" id="nameGroup">
          <label for="regName">Full name</label>
          <input type="text" id="regName" placeholder="John Doe" autocomplete="name">
          <div class="error" id="nameError">Please enter your full name (min 2 characters).</div>
        </div>
        <div class="form-group" id="emailGroup">
          <label for="regEmail">Email address</label>
          <input type="email" id="regEmail" placeholder="john@example.com" autocomplete="email">
          <div class="error" id="emailError">Please enter a valid email address.</div>
        </div>
        <div class="form-group" id="phoneGroup">
          <label for="regPhone">Phone number</label>
          <input type="tel" id="regPhone" placeholder="+1 234 567 8900" autocomplete="tel">
          <div class="error" id="phoneError">Enter a valid phone number (10–15 digits).</div>
        </div>
        <button type="submit" class="btn-submit">Confirm registration</button>
      </form>
    `;

    modalOverlay.classList.add('active');
    document.getElementById('closeModalBtn').addEventListener('click', closeModal);

    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm()) {
        if (!registeredEvents.includes(eventId)) {
          registeredEvents.push(eventId);
          localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
        }
        modalContent.innerHTML = `
          <button class="close-modal" id="closeSuccessBtn"><i class="fas fa-times"></i></button>
          <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>You're registered!</h3>
            <p>Thank you for registering for <strong>${event.title}</strong>. A confirmation email has been sent.</p>
            <button class="btn-submit" id="doneBtn" style="width: auto; padding: 0.7rem 2rem;">Done</button>
          </div>
        `;
        document.getElementById('closeSuccessBtn').addEventListener('click', () => { closeModal(); renderEvents(); });
        document.getElementById('doneBtn').addEventListener('click', () => { closeModal(); renderEvents(); });
      }
    });

    const nameInput = document.getElementById('regName');
    const emailInput = document.getElementById('regEmail');
    const phoneInput = document.getElementById('regPhone');
    nameInput.addEventListener('input', () => validateField(nameInput, 'nameGroup', isValidName));
    emailInput.addEventListener('input', () => validateField(emailInput, 'emailGroup', isValidEmail));
    phoneInput.addEventListener('input', () => validateField(phoneInput, 'phoneGroup', isValidPhone));
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  // ---------- VALIDATION ----------
  function isValidName(value) { return value.trim().length >= 2; }
  function isValidEmail(value) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value.trim());
  }
  function isValidPhone(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
  }
  function validateField(input, groupId, validator) {
    const group = document.getElementById(groupId);
    const isValid = validator(input.value);
    group.classList.toggle('invalid', !isValid);
    return isValid;
  }
  function validateForm() {
    const nameValid = validateField(document.getElementById('regName'), 'nameGroup', isValidName);
    const emailValid = validateField(document.getElementById('regEmail'), 'emailGroup', isValidEmail);
    const phoneValid = validateField(document.getElementById('regPhone'), 'phoneGroup', isValidPhone);
    return nameValid && emailValid && phoneValid;
  }

  // ---------- SEARCH & FILTER ----------
  function updateSearch() {
    currentSearch = searchInput.value.trim();
    renderEvents();
  }
  searchBtn.addEventListener('click', updateSearch);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') updateSearch();
    else updateSearch();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderEvents();
    });
  });

  // ---------- THEME ----------
  function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      themeLabel.textContent = 'Light';
      themeToggle.querySelector('i').className = 'fas fa-sun';
    }
  }
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeLabel.textContent = isDark ? 'Light' : 'Dark';
    themeToggle.querySelector('i').className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  });

  // ---------- INIT ----------
  loadTheme();
  renderEvents();

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
  });
})();