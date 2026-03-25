initSidebar();

let currentProfile = null;

// ── Helpers ───────────────────────────────────────────────────

function val(v, fallback = '—') {
  return v && String(v).trim() ? String(v).trim() : fallback;
}

function emptySpan(v) {
  const text = val(v);
  if (text === '—') return `<span class="detail-val empty">Not provided</span>`;
  return `<span class="detail-val">${text}</span>`;
}

function formatDob(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Render profile data onto the page ─────────────────────────

function renderProfile(p) {
  const name = val(p.name, 'Patient');
  document.getElementById('profileInitial').textContent = name[0].toUpperCase();
  document.getElementById('profileName').textContent    = name;
  document.getElementById('profileEmail').textContent   = val(p.email);
  document.getElementById('profileRole').textContent    = val(p.role, 'PATIENT');

  document.getElementById('detailName').textContent  = val(p.name);
  document.getElementById('detailEmail').textContent = val(p.email);
  document.getElementById('detailRole').textContent  = val(p.role);

  // Fields that may be empty — swap in styled placeholder
  ['detailPhone', 'detailGender', 'detailDob', 'detailBlood'].forEach(id => {
    const el = document.getElementById(id);
    el.className = 'detail-val';
    if (id === 'detailPhone') {
      el.textContent = val(p.phone);
      if (!p.phone) el.classList.add('empty'), el.textContent = 'Not provided';
    }
    if (id === 'detailGender') {
      el.textContent = val(p.gender);
      if (!p.gender) el.classList.add('empty'), el.textContent = 'Not provided';
    }
    if (id === 'detailDob') {
      const formatted = formatDob(p.date_of_birth);
      el.textContent = formatted || 'Not provided';
      if (!formatted) el.classList.add('empty');
    }
    if (id === 'detailBlood') {
      el.textContent = val(p.blood_group);
      if (!p.blood_group) el.classList.add('empty'), el.textContent = 'Not provided';
    }
  });

  // Sync sidebar
  document.getElementById('userName').textContent = name;
  document.getElementById('userRole').textContent = val(p.role);

  // Sync localStorage so other pages stay consistent
  localStorage.setItem('user_name', name);
}

// ── Load profile from API ─────────────────────────────────────

async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE}/users/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error();
    currentProfile = await res.json();
    renderProfile(currentProfile);
  } catch {
    // Fallback: render from localStorage if API fails
    renderProfile({
      name:  localStorage.getItem('user_name'),
      email: null,
      role:  localStorage.getItem('user_role'),
    });
  }

  // Load appointment counts separately (doesn't block profile render)
  loadApptCounts();
}

async function loadApptCounts() {
  const userId = localStorage.getItem('user_id');
  if (!userId) return;
  try {
    const res = await fetch(`${API_BASE}/appointments/my/${userId}`, { headers: authHeaders() });
    if (!res.ok) return;
    const appts = await res.json();
    document.getElementById('totalAppts').textContent     = appts.length;
    document.getElementById('completedAppts').textContent = appts.filter(a => a.status === 'completed').length;
  } catch {
    console.error('Could not load appointment counts');
  }
}

// ── Edit Modal ────────────────────────────────────────────────

function openEditModal() {
  if (!currentProfile) return;
  document.getElementById('editName').value   = currentProfile.name  || '';
  document.getElementById('editPhone').value  = currentProfile.phone || '';
  document.getElementById('editGender').value = currentProfile.gender || '';
  document.getElementById('editBlood').value  = currentProfile.blood_group || '';
  document.getElementById('editDob').value    = currentProfile.date_of_birth || '';
  document.getElementById('saveMsg').textContent = '';
  document.getElementById('saveMsg').className   = 'save-msg';
  document.getElementById('editModalOverlay').classList.add('open');
}

function closeEditModal() {
  document.getElementById('editModalOverlay').classList.remove('open');
}

function closeOnBackdrop(e) {
  if (e.target === document.getElementById('editModalOverlay')) closeEditModal();
}

async function saveProfile() {
  const btn = document.getElementById('saveBtn');
  const msg = document.getElementById('saveMsg');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  const payload = {};
  const name  = document.getElementById('editName').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  const gender = document.getElementById('editGender').value;
  const blood  = document.getElementById('editBlood').value;
  const dob    = document.getElementById('editDob').value;

  if (name)   payload.name         = name;
  if (phone)  payload.phone        = phone;
  if (gender) payload.gender       = gender;
  if (blood)  payload.blood_group  = blood;
  if (dob)    payload.date_of_birth = dob;

  // Allow clearing fields by sending null explicitly if empty
  if (!phone)  payload.phone = null;
  if (!gender) payload.gender = null;
  if (!blood)  payload.blood_group = null;
  if (!dob)    payload.date_of_birth = null;

  try {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      msg.textContent = err.detail || 'Update failed. Please try again.';
      msg.className = 'save-msg error';
      return;
    }

    currentProfile = await res.json();
    renderProfile(currentProfile);

    msg.textContent = '✓ Profile updated successfully!';
    msg.className = 'save-msg success';
    setTimeout(closeEditModal, 1200);

  } catch {
    msg.textContent = 'Could not connect to server. Please try again.';
    msg.className = 'save-msg error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Changes';
  }
}

// ── Keyboard support ──────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeEditModal();
});

loadProfile();