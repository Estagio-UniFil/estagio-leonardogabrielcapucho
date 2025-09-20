const API_BASE_URL = 'http://localhost:3000/api';

const form = document.getElementById('formEmpenho');
const messageEl = document.getElementById('formMessage');
const submitBtn = document.getElementById('btnSubmit');

function setMessage(text, variant = 'info') {
  if (!messageEl) return;
  messageEl.textContent = text;
  messageEl.style.color = variant === 'error' ? '#c5272c' : '#5a6a7f';
}

function toggleSubmitting(isSubmitting) {
  if (!submitBtn) return;
  submitBtn.disabled = isSubmitting;
  submitBtn.textContent = isSubmitting ? 'Salvando...' : 'Salvar empenho';
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    window.location.href = '/';
    return;
  }

  try {
    const userData = JSON.parse(user);
    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = userData.nome;

    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      const photo = document.getElementById('profilePhoto');
      if (photo) photo.src = savedPhoto;
    }
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    logout();
  }
});

document.getElementById('photoInput')?.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const photoUrl = ev.target?.result;
    const photo = document.getElementById('profilePhoto');
    if (photo) photo.src = photoUrl;
    localStorage.setItem('profilePhoto', photoUrl);
  };
  reader.readAsDataURL(file);
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const secretarioValue = document.getElementById('secretario').value;
  const [secretario_nome, secretario_setor] = secretarioValue.split('|');

  const payload = {
    numero: document.getElementById('numero').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    valor: document.getElementById('valor').value,
    data_vencimento: document.getElementById('data_vencimento').value,
    status_assinatura_secretario: 'Pendente',
    status_assinatura_nota_fiscal: 'Pendente',
    status_assinatura_formulario: 'Pendente',
    secretario_nome,
    secretario_setor,
    nota_fiscal_numero: document.getElementById('nota_numero').value.trim() || null,
    nota_fiscal_valor: document.getElementById('nota_valor').value || null,
    nota_fiscal_data: document.getElementById('nota_data').value || null
  };

  toggleSubmitting(true);
  setMessage('Enviando dados...');

  try {
    const response = await fetch(`${API_BASE_URL}/empenhos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ erro: 'Erro ao cadastrar empenho.' }));
      throw new Error(data.erro || 'Erro ao cadastrar o empenho.');
    }

    alert('Empenho cadastrado com sucesso!');
    window.location.href = '/ver-empenhos';
  } catch (error) {
    console.error(error);
    setMessage(error.message || 'Erro ao cadastrar empenho.', 'error');
  } finally {
    toggleSubmitting(false);
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('profilePhoto');
  window.location.href = '/';
}
