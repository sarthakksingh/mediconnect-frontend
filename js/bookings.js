initSidebar();

const userId = localStorage.getItem('user_id');
let allBookings = [];

function statusChip(status) {
  const map = {
    booked:      'chip chip-green',
    rescheduled: 'chip chip-blue',
    completed:   'chip chip-purple',
    cancelled:   'chip chip-red'
  };
  return `<span class="${map[status] || 'chip chip-gray'}">${status}</span>`;
}

function renderBookings(bookings) {
  const list = document.getElementById('bookingsList');

  if (bookings.length === 0) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-icon">📅</div>
      <div class="empty-title">No appointments found</div>
      <div class="empty-sub"><a href="doctors.html" style="color:var(--teal)">Book your first appointment →</a></div>
    </div>`;
    return;
  }

  list.innerHTML = bookings.map(b => {
    const dt = new Date(b.date_time);
    const day = dt.toLocaleDateString('en-IN', { day: 'numeric' });
    const mon = dt.toLocaleDateString('en-IN', { month: 'short' });
    const time = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const canCancel = b.status === 'booked' || b.status === 'rescheduled';

    return `
      <div class="booking-card">
        <div class="booking-date-box">
          <div class="booking-date-day">${day}</div>
          <div class="booking-date-mon">${mon}</div>
        </div>
        <div class="booking-info">
          <div class="booking-doctor">Dr. ${b.doctor_name}</div>
          <div class="booking-spec">${b.doctor_specialization || 'General Medicine'}</div>
          <div class="booking-meta">
            <span>🕐 ${time}</span>
            ${b.reason ? `<span>📝 ${b.reason}</span>` : ''}
            ${statusChip(b.status)}
          </div>
        </div>
        <div class="booking-actions">
          ${canCancel ? `<button class="action-sm danger" onclick="cancelBooking(${b.appointment_id})">Cancel</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

function filterByStatus(status) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const filtered = status === 'all' ? allBookings : allBookings.filter(b => b.status === status);
  renderBookings(filtered);
}

async function cancelBooking(appointmentId) {
  if (!confirm('Are you sure you want to cancel this appointment?')) return;

  try {
    const res = await fetch(`${API_BASE}/appointments/cancel/${appointmentId}`, {
      method: 'PUT',
      headers: authHeaders()
    });

    if (res.ok) {
      await loadBookings(); // refresh
    }
  } catch {
    alert('Could not cancel appointment. Please try again.');
  }
}

async function loadBookings() {
  try {
    const res = await fetch(`${API_BASE}/appointments/my/${userId}`, { headers: authHeaders() });
    if (!res.ok) throw new Error();
    allBookings = await res.json();
    renderBookings(allBookings);
    document.getElementById('totalCount').textContent = allBookings.length;
    document.getElementById('upcomingCount').textContent = allBookings.filter(b => b.status === 'booked').length;
  } catch {
    document.getElementById('bookingsList').innerHTML = `<div class="empty-state">
      <div class="empty-icon">⚠️</div>
      <div class="empty-title">Could not load bookings</div>
      <div class="empty-sub">Please refresh the page</div>
    </div>`;
  }
}

loadBookings();