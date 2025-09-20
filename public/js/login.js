const API_BASE_URL = 'http://localhost:3000/api';

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.querySelector('.login-btn');
const errorMessage = document.getElementById('errorMessage');

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideError() {
    errorMessage.style.display = 'none';
}

function setLoading(loading) {
    if (loading) {
        loginBtn.disabled = true;
        loginBtn.classList.add('loading');
        loginBtn.textContent = 'Entrando...';
    } else {
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
        loginBtn.textContent = 'Entrar';
    }
}

function validateForm() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!username) {
        showError('Por favor, insira o nome de usuário');
        usernameInput.focus();
        return false;
    }
    
    if (!password) {
        showError('Por favor, insira a senha');
        passwordInput.focus();
        return false;
    }
    
    return true;
}

async function performLogin(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login: username,
                senha: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.erro || 'Erro no servidor');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.usuario));
        
        window.location.href = '/home';
        
    } catch (error) {
        console.error('Erro no login:', error);
        
        if (error.message.includes('fetch')) {
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        } else {
            showError(error.message);
        }
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    hideError();
    
    setLoading(true);
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    await performLogin(username, password);
    
    setLoading(false);
});

usernameInput.addEventListener('input', hideError);
passwordInput.addEventListener('input', hideError);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !loginBtn.disabled) {
        loginForm.dispatchEvent(new Event('submit'));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch(`${API_BASE_URL}/auth/verificar`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/home';
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        })
        .catch(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        });
    }
});

async function testConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/verificar`);
        return response.ok;
    } catch {
        return false;
    }
}

window.addEventListener('load', async () => {
    const isConnected = await testConnection();
    if (!isConnected) {
        console.warn('Servidor não está rodando ou não está acessível');
    }
});
