function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b, i) => {
    b.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'register' && i === 1));
  });
  document.getElementById('loginPanel').classList.toggle('active', tab === 'login');
  document.getElementById('registerPanel').classList.toggle('active', tab === 'register');
}

function showMsg(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `msg ${type}`;
}

async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showMsg('loginMsg', 'Please enter your email and password.', 'error');
    return;
  }

  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Signing in...';

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showMsg('loginMsg', data.detail || 'Invalid email or password.', 'error');
      return;
    }

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('user_name', data.name);
    localStorage.setItem('user_role', data.role);

    window.location.href = 'dashboard.html';

  } catch (e) {
    showMsg('loginMsg', 'Could not connect to server. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Sign In';
  }
}

async function register() {
  const name = document.getElementById('regName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;

  if (!name || !email || !password) {
    showMsg('registerMsg', 'Please fill in all required fields.', 'error');
    return;
  }

  if (password.length < 8) {
    showMsg('registerMsg', 'Password must be at least 8 characters.', 'error');
    return;
  }

  const btn = document.getElementById('registerBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>Creating account...';

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, password, role })
    });

    const data = await res.json();

    if (!res.ok) {
      showMsg('registerMsg', data.detail || 'Registration failed.', 'error');
      return;
    }

    showMsg('registerMsg', 'Account created! Please sign in.', 'success');
    setTimeout(() => switchTab('login'), 1500);

  } catch (e) {
    showMsg('registerMsg', 'Could not connect to server. Please try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Create Account';
  }
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const active = document.querySelector('.form-panel.active').id;
  if (active === 'loginPanel') login();
  else register();
});