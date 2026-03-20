initSidebar();

const userId = localStorage.getItem('user_id');
const userName = localStorage.getItem('user_name');
const userRole = localStorage.getItem('user_role');

document.getElementById('profileName').textContent = userName || 'Patient';
document.getElementById('profileRole').textContent = userRole || 'PATIENT';
document.getElementById('profileInitial').textContent = (userName || 'P')[0].toUpperCase();

async function loadProfile() {
  try {
    const res = await fetch(`${API_BASE}/appointments/my/${userId}`, { headers: authHeaders() });
    if (!res.ok) return;
    const appts = await res.json();
    document.getElementById('totalAppts').textContent = appts.length;
    document.getElementById('completedAppts').textContent = appts.filter(a => a.status === 'completed').length;
  } catch {
    console.error('Profile load error');
  }
}

loadProfile();