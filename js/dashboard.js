initSidebar();

const userId = localStorage.getItem('user_id');

// Set greeting and date
document.getElementById('headerName').textContent = localStorage.getItem('user_name') || 'Patient';
document.getElementById('headerDate').textContent = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

async function loadDashboard() {
  try {
    const res = await fetch(`${API_BASE}/appointments/my/${userId}`, {
      headers: authHeaders()
    });

    if (!res.ok) return;

    const data = await res.json();
    const upcoming = data.filter(a => a.status === 'booked' || a.status === 'rescheduled');

    // Appointment count
    document.getElementById('apptCount').textContent = upcoming.length;

    // Next appointment
    if (upcoming.length > 0) {
      const next = upcoming[0];
      const dt = new Date(next.date_time);
      document.getElementById('nextDoctor').textContent = `Dr. ${next.doctor_name}`;
      document.getElementById('nextSpec').textContent = next.doctor_specialization || '';
      document.getElementById('nextTime').innerHTML = `
        <span>📅 ${dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        <span>🕐 ${dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>`;
    }

    // Activity feed
    if (data.length > 0) {
      const colors = { booked: 'green', rescheduled: 'blue', completed: 'purple', cancelled: 'blue' };
      const icons  = { booked: '✔', rescheduled: '🔄', completed: '✅', cancelled: '✖' };
      document.getElementById('activityList').innerHTML = data.slice(0, 4).map(a => {
        const dt = new Date(a.date_time);
        return `
          <div class="activity-item">
            <div class="activity-dot ${colors[a.status] || 'blue'}">${icons[a.status] || '📅'}</div>
            <div class="activity-info">
              <div class="activity-text">Appointment with Dr. ${a.doctor_name}</div>
              <div class="activity-time">${dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · ${a.status}</div>
            </div>
          </div>`;
      }).join('');
    }

  } catch (e) {
    console.error('Dashboard load error:', e);
  }
}

loadDashboard();