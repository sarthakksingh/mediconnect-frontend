initSidebar();

const userId = localStorage.getItem('user_id');
const doctorId = localStorage.getItem('selected_doctor_id');
if (!doctorId) window.location.href = 'doctors.html';

document.getElementById('apptDate').min = new Date().toISOString().split('T')[0];

const defaultSlots = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM'];
let selectedSlot = null;
let doctorData = null;

function renderSlots(slots) {
  document.getElementById('slotsGrid').innerHTML = slots.map(slot =>
    `<button class="slot-btn" onclick="selectSlot('${slot}', this)">${slot}</button>`
  ).join('');
}

function selectSlot(slot, el) {
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  selectedSlot = slot;
  updateSummary();
}

function updateSummary() {
  const date = document.getElementById('apptDate').value;
  const reason = document.getElementById('apptReason').value;
  if (!date || !selectedSlot) return;

  document.getElementById('summaryBox').classList.add('visible');
  document.getElementById('sumDoctor').textContent = doctorData ? `Dr. ${doctorData.name}` : '—';
  document.getElementById('sumDate').textContent = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById('sumTime').textContent = selectedSlot;
  document.getElementById('sumReason').textContent = reason || 'Not specified';
}

async function loadDoctor() {
  try {
    const res = await fetch(`${API_BASE}/doctors`, { headers: authHeaders() });
    const doctors = await res.json();
    doctorData = doctors.find(d => d.id == doctorId);
    if (!doctorData) { window.location.href = 'doctors.html'; return; }

    const slot = doctorData.availability ? Object.values(doctorData.availability)[0] : null;
    document.getElementById('doctorBanner').innerHTML = `
      <div class="banner-avatar">👨‍⚕️</div>
      <div>
        <div class="banner-name">Dr. ${doctorData.name}</div>
        <div class="banner-spec">${doctorData.specialization || 'General Medicine'} · ${doctorData.experience_years || 0}+ years</div>
        <div class="banner-chips">
          <span class="banner-chip">👥 ${doctorData.patients_count || 0} patients</span>
          <span class="banner-chip">● Available</span>
          ${slot ? `<span class="banner-chip">🕐 ${slot}</span>` : ''}
        </div>
      </div>`;

    const slots = slot ? slot.split(',').map(s => s.trim()) : defaultSlots;
    renderSlots(slots.length > 0 ? slots : defaultSlots);
  } catch {
    document.getElementById('errorMsg').textContent = 'Could not load doctor info.';
    document.getElementById('errorMsg').className = 'alert error';
  }
}

async function bookAppointment() {
  const date = document.getElementById('apptDate').value;
  const reason = document.getElementById('apptReason').value;

  if (!date) { showError('Please select a date.'); return; }
  if (!selectedSlot) { showError('Please select a time slot.'); return; }

  // Build ISO datetime
  const isPM = selectedSlot.includes('PM');
  const isAM = selectedSlot.includes('AM');
  const timeStr = selectedSlot.replace(' AM','').replace(' PM','');
  let [h, m] = timeStr.split(':').map(Number);
  if (isPM && h !== 12) h += 12;
  if (isAM && h === 12) h = 0;
  const dateTime = `${date}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`;

  const btn = document.getElementById('confirmBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Booking...';

  try {
    const res = await fetch(`${API_BASE}/appointments/book`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        patient_id: parseInt(userId),
        doctor_id: parseInt(doctorId),
        date_time: dateTime,
        reason: reason || null
      })
    });

    const data = await res.json();
    if (!res.ok) { showError(data.detail || 'Booking failed.'); return; }

    document.getElementById('successOverlay').classList.add('visible');
    localStorage.removeItem('selected_doctor_id');

  } catch {
    showError('Could not connect to server. Please try again.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Confirm Appointment';
  }
}

function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.className = 'alert error';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

loadDoctor();