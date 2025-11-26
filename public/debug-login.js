
async function debugLogin(event) {
    event.preventDefault();
    const logEl = document.getElementById('debug-log');
    logEl.style.display = 'block';
    logEl.innerHTML += '<div>[START] Tentando login...</div>';

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    logEl.innerHTML += `<div>[INFO] Email: ${email}</div>`;

    try {
        logEl.innerHTML += '<div>[FETCH] POST /api/auth/login</div>';
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        logEl.innerHTML += `<div>[RESPONSE] Status: ${response.status}</div>`;

        const data = await response.json();
        logEl.innerHTML += `<div>[DATA] ${JSON.stringify(data)}</div>`;

        if (response.ok) {
            logEl.innerHTML += '<div style="color: green">[SUCCESS] Login OK! Salvando token...</div>';
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            logEl.innerHTML += `<div style="color: red">[ERROR] ${data.error}</div>`;
        }
    } catch (error) {
        logEl.innerHTML += `<div style="color: red">[EXCEPTION] ${error.message}</div>`;
    }
}
