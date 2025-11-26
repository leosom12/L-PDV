// Tornar funções globais para uso no HTML
window.login = function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));

                // Lógica de redirecionamento
                const user = data.user;

                // Todos os usuários vão para o app
                document.getElementById('auth-screen').style.display = 'none';
                document.getElementById('app-screen').style.display = 'block';

                // Atualizar nome do usuário
                document.getElementById('user-info').textContent = user.username;

                // Recarregar dados se for para o app
                if (typeof loadDashboard === 'function') {
                    loadDashboard();
                    loadProducts();
                }
            } else {
                alert(data.error || 'Erro ao fazer login');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao fazer login');
        });
};

window.maskCPF = function (input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = value;
};

window.register = function (e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const cpf = document.getElementById('register-cpf').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!username || !email || !password || !cpf) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, cpf })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('✓ Conta criada! Faça login para continuar.');
                window.showLogin();
                document.getElementById('login-email').value = email;
            } else {
                alert(data.error || 'Erro ao criar conta');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao criar conta');
        });
};

window.showLogin = function () {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
};

window.showRegister = function () {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
};

// Função para mostrar tela de login de clientes
window.showClientLogin = function () {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('client-login-screen').style.display = 'flex';

    // Copiar status do servidor para a tela de clientes
    const mainStatus = document.getElementById('server-status');
    const clientStatus = document.getElementById('client-server-status');
    if (mainStatus && clientStatus) {
        clientStatus.className = mainStatus.className;
        clientStatus.innerHTML = mainStatus.innerHTML;
    }
};

// Função para voltar ao login principal
window.backToMainLogin = function () {
    document.getElementById('client-login-screen').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'flex';
};

// Função de login para clientes
window.clientLogin = function (e) {
    e.preventDefault();
    const email = document.getElementById('client-email').value;

    // Validar se é um email do Gmail
    if (!email.toLowerCase().endsWith('@gmail.com')) {
        alert('⚠️ Por favor, use um endereço de email do Gmail.');
        return;
    }

    // Aqui você pode adicionar a lógica de autenticação do cliente
    // Por enquanto, vamos apenas mostrar uma mensagem
    alert('🚧 Funcionalidade de login de clientes em desenvolvimento!\n\nEmail: ' + email);

    // Exemplo de como seria a integração futura:
    /*
    fetch('/api/client-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirecionar para área do cliente
            console.log('Cliente autenticado:', data);
        } else {
            alert(data.error || 'Erro ao fazer login');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao fazer login');
    });
    */
};


