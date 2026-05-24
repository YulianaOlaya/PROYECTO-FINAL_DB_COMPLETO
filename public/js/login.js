document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:5000';
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('correo');
  const passwordInput = document.getElementById('contraseña');
  const loginError = document.getElementById('loginError');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginError.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      loginError.textContent = 'Please complete email and password.';
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        loginError.textContent = data.error || 'Unable to login.';
        return;
      }

      window.location.href = 'catalogo.html';
    } catch (error) {
      console.error('Error login:', error);
      loginError.textContent = 'Server connection error. Please try again.';
    }
  });
});