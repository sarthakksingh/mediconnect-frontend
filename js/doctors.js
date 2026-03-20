// Placeholder for backend integration
// Later:
// fetch(`${API_BASE}/doctors`)
// render cards dynamicallyinitSidebar();

const avatarColors = ['av-teal','av-blue','av-purple','av-amber','av-pink'];
const avatarEmojis = ['👨‍⚕️','👩‍⚕️','🧑‍⚕️','👨‍⚕️','👩‍⚕️'];
let allDoctors = [];

function renderDoctors(doctors) {
  const grid = document.getElementById('doctorsGrid');
  document.getElementById('resultsCount').textContent = `${doctors.length} doctor${doctors.length !== 1 ? 's' : ''} found`;

  if (doctors.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">🔍</div>
      <div class="empty-title">No doctors found</div>
      <div class="empty-sub">Try a different search term or specialization</div>
    </div>`;
    return;
  }

  grid.innerHTML = doctors.map((doc, i) => {
    const color = avatarColors[i % avatarColors.length];
    const emoji = avatarEmojis[i % avatarEmojis.length];
    const slot = doc.availability ? Object.values(doc.availability)[0] : null;
    const isAvailable = !!slot;

    return `
      <div class="doctor-card" onclick="goToBook(${doc.id})">
        <div class="doctor-card-top">
          <div class="doctor-avatar ${color}">${emoji}</div>
          <div class="doctor-meta">
            <div class="doctor-name">Dr. ${doc.name}</div>
            <div class="doctor-spec">${doc.specialization || 'General Medicine'}</div>
            <div class="doctor-exp">${doc.experience_years > 0 ? `${doc.experience_years}+ yrs experience` : 'Experienced specialist'}</div>
          </div>
          <span class="avail-badge ${isAvailable ? 'available' : 'unavailable'}">
            ${isAvailable ? '● Available' : '● Unavailable'}
          </span>
        </div>
        <p class="doctor-desc">${doc.specialization || 'General Medicine'} specialist with ${doc.experience_years > 0 ? `${doc.experience_years}+ years` : 'extensive'} experience.</p>
        <div class="doctor-chips">
          <span class="chip chip-patients">👥 ${doc.patients_count || 0} patients</span>
          ${slot ? `<span class="chip chip-time">🕐 ${slot}</span>` : ''}
        </div>
        <button class="book-btn ${!isAvailable ? 'disabled' : ''}"
          onclick="event.stopPropagation(); ${isAvailable ? `goToBook(${doc.id})` : ''}">
          ${isAvailable ? 'Book Appointment →' : 'Currently Unavailable'}
        </button>
      </div>`;
  }).join('');
}

function filterDoctors() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const spec = document.getElementById('specFilter').value.toLowerCase();
  const filtered = allDoctors.filter(doc =>
    (!query || doc.name.toLowerCase().includes(query) || (doc.specialization || '').toLowerCase().includes(query)) &&
    (!spec || (doc.specialization || '').toLowerCase().includes(spec))
  );
  renderDoctors(filtered);
}

function goToBook(doctorId) {
  localStorage.setItem('selected_doctor_id', doctorId);
  window.location.href = 'book.html';
}

async function loadDoctors() {
  try {
    const res = await fetch(`${API_BASE}/doctors`, { headers: authHeaders() });
    if (!res.ok) throw new Error();
    allDoctors = await res.json();
    renderDoctors(allDoctors);
  } catch {
    document.getElementById('doctorsGrid').innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon">⚠️</div>
      <div class="empty-title">Could not load doctors</div>
      <div class="empty-sub">Please check your connection and try again</div>
    </div>`;
    document.getElementById('resultsCount').textContent = '0 found';
  }
}

loadDoctors();