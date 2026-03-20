
function initSidebar() {
  const token = localStorage.getItem('token');
  if (!token) { window.location.href = 'index.html'; return; }
  const nameEl = document.getElementById('userName');
  const roleEl = document.getElementById('userRole');
  if (nameEl) nameEl.textContent = localStorage.getItem('user_name') || 'Patient';
  if (roleEl) roleEl.textContent = localStorage.getItem('user_role') || 'PATIENT';
}

function logout() {
  localStorage.clear();
  window.location.href = 'index.html';
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };
}