/**
 * initSidebar — call at top of every protected page.
 * Pass allowed roles to restrict access, e.g. initSidebar(['DOCTOR'])
 * Default (no args) allows any authenticated user.
 */
function initSidebar(allowedRoles = null) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  const role = localStorage.getItem('user_role') || 'PATIENT';

  // Role guard — redirect if page is role-restricted
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'DOCTOR') {
      window.location.href = 'doctor-dashboard.html';
    } else if (role === 'ADMIN') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'dashboard.html';
    }
    return;
  }

  const nameEl = document.getElementById('userName');
  const roleEl = document.getElementById('userRole');
  if (nameEl) nameEl.textContent = localStorage.getItem('user_name') || 'User';
  if (roleEl) roleEl.textContent = role;
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