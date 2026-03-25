initSidebar();

const userId = localStorage.getItem('user_id');

// ── Greeting ──────────────────────────────────────────────────

const hour = new Date().getHours();
const greeting = hour < 12 ? 'Good morning 👋'
               : hour < 17 ? 'Good afternoon 👋'
               : 'Good evening 👋';
document.getElementById('headerGreeting').textContent = greeting;
document.getElementById('headerName').textContent = localStorage.getItem('user_name') || 'Patient';
document.getElementById('headerDate').textContent  = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});


// ── Appointments ──────────────────────────────────────────────

async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE}/appointments/my/${userId}`, {
      headers: authHeaders()
    });
    if (!res.ok) return;
    const data = await res.json();

    const upcoming = data.filter(a =>
      ['pending', 'confirmed', 'rescheduled'].includes(a.status) &&
      new Date(a.date_time) > new Date()
    );

    document.getElementById('apptCount').textContent     = upcoming.length;
    document.getElementById('totalApptCount').textContent = data.length;

    // Next appointment card
    if (upcoming.length > 0) {
      const next = upcoming[0];
      const dt = new Date(next.date_time);
      document.getElementById('nextDoctor').textContent = `Dr. ${next.doctor_name}`;
      document.getElementById('nextSpec').textContent   = next.doctor_specialization || '';
      document.getElementById('nextTime').innerHTML     = `
        <span>📅 ${dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        <span>🕐 ${dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>`;
    }

    // Activity feed
    if (data.length > 0) {
      const colors = { pending: 'blue', confirmed: 'green', rescheduled: 'blue', completed: 'purple', cancelled: 'blue' };
      const icons  = { pending: '⏳', confirmed: '✔', rescheduled: '🔄', completed: '✅', cancelled: '✖' };
      document.getElementById('activityList').innerHTML = data.slice(0, 4).map(a => {
        const dt = new Date(a.date_time);
        return `
          <div class="activity-item">
            <div class="activity-dot ${colors[a.status] || 'blue'}">${icons[a.status] || '📅'}</div>
            <div class="activity-info">
              <div class="activity-text">Appointment with Dr. ${a.doctor_name}</div>
              <div class="activity-time">${dt.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })} · ${a.status}</div>
            </div>
          </div>`;
      }).join('');
    }

  } catch (e) {
    console.error('Dashboard load error:', e);
  }
}


// ── Medicine Tracker ──────────────────────────────────────────

let medicines = [];

function renderMedicines() {
  const list = document.getElementById('medList');
  const active = medicines.filter(m => m.is_active);

  document.getElementById('medCount').textContent = active.length;
  document.getElementById('medChip').textContent  = active.length > 0 ? 'Active' : 'None';

  if (medicines.length === 0) {
    list.innerHTML = `<div class="med-empty">No medicines added yet.<br>
      <button class="add-med-btn" style="margin:8px auto 0;display:inline-flex" onclick="openAddMed()">
        + Add your first medicine
      </button></div>`;
    return;
  }

  list.innerHTML = medicines.map(med => `
    <div class="med-item">
      <div class="med-icon">💊</div>
      <div class="med-info">
        <div class="med-name">${med.name}${!med.is_active ? '' : ''}</div>
        <div class="med-meta">
          ${med.dosage ? `<strong>${med.dosage}</strong>` : ''}
          ${med.frequency ? `· ${med.frequency}` : ''}
          ${med.notes ? `· ${med.notes}` : ''}
        </div>
      </div>
      ${!med.is_active ? '<span class="chip-inactive">Inactive</span>' : ''}
      <div class="med-actions">
        ${med.is_active
          ? `<button class="med-del-btn" title="Mark inactive" onclick="toggleMedActive(${med.id}, false)">⏸</button>`
          : `<button class="med-del-btn" title="Mark active"   onclick="toggleMedActive(${med.id}, true)">▶</button>`
        }
        <button class="med-del-btn" title="Delete" onclick="deleteMedicine(${med.id})">🗑</button>
      </div>
    </div>`).join('');
}

async function loadMedicines() {
  try {
    const res = await fetch(`${API_BASE}/medicines/my`, { headers: authHeaders() });
    if (!res.ok) return;
    medicines = await res.json();
    renderMedicines();
  } catch {
    document.getElementById('medList').innerHTML =
      '<div class="med-empty">Could not load medicines.</div>';
  }
}

async function addMedicine() {
  const name = document.getElementById('medName').value.trim();
  if (!name) { alert('Medicine name is required.'); return; }

  const btn = document.getElementById('addMedBtn');
  btn.disabled = true;
  btn.textContent = 'Adding…';

  const payload = {
    name,
    dosage:    document.getElementById('medDosage').value.trim() || null,
    frequency: document.getElementById('medFreq').value || null,
    start_date: document.getElementById('medStart').value || null,
    end_date:   document.getElementById('medEnd').value || null,
    notes:      document.getElementById('medNotes').value.trim() || null,
  };

  try {
    const res = await fetch(`${API_BASE}/medicines`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error();
    closeAddMed();
    await loadMedicines();
    await loadHealthScore(); // score changes when medicines added
  } catch {
    alert('Could not add medicine. Please try again.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Add Medicine';
  }
}

async function deleteMedicine(id) {
  if (!confirm('Remove this medicine?')) return;
  try {
    await fetch(`${API_BASE}/medicines/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    await loadMedicines();
    await loadHealthScore();
  } catch {
    alert('Could not remove medicine.');
  }
}

async function toggleMedActive(id, active) {
  try {
    await fetch(`${API_BASE}/medicines/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ is_active: active })
    });
    await loadMedicines();
    await loadHealthScore();
  } catch {
    alert('Could not update medicine.');
  }
}

// Modal helpers
function openAddMed() {
  ['medName','medDosage','medNotes'].forEach(id => document.getElementById(id).value = '');
  ['medFreq','medStart','medEnd'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('medStart').value = new Date().toISOString().split('T')[0];
  document.getElementById('addMedOverlay').classList.add('open');
}
function closeAddMed() {
  document.getElementById('addMedOverlay').classList.remove('open');
}
function closeMedOnBackdrop(e) {
  if (e.target === document.getElementById('addMedOverlay')) closeAddMed();
}


// ── Health Score ──────────────────────────────────────────────

function setHealthRing(score) {
  const circumference = 238.76;
  const offset = circumference - (score / 100) * circumference;
  document.getElementById('healthRingFill').style.strokeDashoffset = offset;
  document.getElementById('healthRingNum').textContent = score;

  // Change ring color based on score
  const color = score >= 75 ? 'var(--teal,#0d9488)'
              : score >= 50 ? '#f59e0b'
              : '#ef4444';
  document.getElementById('healthRingFill').style.stroke = color;
  document.getElementById('healthRingNum').style.color   = color;

  // Update stat card
  document.getElementById('healthScore').textContent = score + '%';
  const chip = document.getElementById('healthChip');
  chip.textContent  = score >= 75 ? 'Good' : score >= 50 ? 'Fair' : 'Low';
  chip.className    = `chip ${score >= 75 ? 'chip-green' : score >= 50 ? 'chip-amber' : 'chip-red'}`;
}

function setBar(id, valId, value) {
  document.getElementById(id).style.width  = value + '%';
  document.getElementById(valId).textContent = Math.round(value) + '%';
}

async function loadHealthScore() {
  try {
    const res = await fetch(`${API_BASE}/health-score`, { headers: authHeaders() });
    if (!res.ok) return;
    const data = await res.json();

    setHealthRing(data.score);
    setBar('bar-completion', 'val-completion', data.completion_rate);
    setBar('bar-adherence',  'val-adherence',  data.adherence_score);
    setBar('bar-streak',     'val-streak',     data.streak_score);

  } catch {
    console.error('Health score load error');
  }
}


// ── Init ──────────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAddMed();
});

Promise.all([
  loadDashboard(),
  loadMedicines(),
  loadHealthScore()
]);