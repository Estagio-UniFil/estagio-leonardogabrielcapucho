const API_BASE_URL = 'http://localhost:3000/api';
const STATUS_CLASS_MAP = {
  pago: 'pago',
  confirmado: 'pago',
  pendente: 'pendente'
};

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

    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
      photoInput.addEventListener('change', trocarFotoPerfil);
    }

    carregarEmpenhos();
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error);
    logout();
  }
});

function trocarFotoPerfil(event) {
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
}

async function carregarEmpenhos() {
  const lista = document.getElementById('listaEmpenhos');
  if (!lista) return;

  lista.innerHTML = '<div class="loading">Carregando empenhos...</div>';

  try {
    const response = await fetch(`${API_BASE_URL}/empenhos`);
    if (!response.ok) {
      throw new Error('Não foi possível carregar os empenhos.');
    }

    const dados = await response.json();
    const empenhos = Array.isArray(dados) ? dados : [];

    if (empenhos.length === 0) {
      lista.innerHTML = '<div class="empty-state">Nenhum empenho cadastrado até o momento.</div>';
      return;
    }

    const fragment = document.createDocumentFragment();

    empenhos.forEach((empenho) => {
      fragment.appendChild(criarCardEmpenho(empenho));
    });

    lista.innerHTML = '';
    lista.appendChild(fragment);
  } catch (error) {
    console.error(error);
    lista.innerHTML = '<div class="error-message">Erro ao carregar empenhos. Tente novamente mais tarde.</div>';
  }
}

function criarCardEmpenho(empenho) {
  const card = document.createElement('article');
  card.className = 'empenho-item';

  const statusGeral = (empenho.status_geral || 'Pendente').toString();
  const statusKey = statusGeral.toLowerCase();
  const badgeClass = STATUS_CLASS_MAP[statusKey] || 'outro';

  const ultimoPagamento = empenho.ultimo_pagamento;
  const statusPagamento = ultimoPagamento?.status_pagamento || '-';

  card.innerHTML = `
    <div class="empenho-header">
      <span class="empenho-numero">Empenho ${escapeHtml(empenho.numero)}</span>
      <span class="status-badge ${badgeClass}">${escapeHtml(capitalize(statusGeral))}</span>
    </div>
    <p class="empenho-descricao">${escapeHtml(empenho.descricao || '-')}</p>
    <div class="empenho-meta">
      <div class="meta-item">
        <span class="meta-label">Valor:</span>
        <span>${formatCurrency(empenho.valor)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Vencimento:</span>
        <span>${formatDate(empenho.data_vencimento)}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Pagamento:</span>
        <span>${escapeHtml(statusPagamento)}</span>
      </div>
    </div>
    <button class="btn-acessar" type="button">Ver detalhes</button>
  `;

  card.querySelector('.btn-acessar')?.addEventListener('click', (event) => {
    event.stopPropagation();
    acessarEmpenho(empenho.id);
  });

  card.addEventListener('click', () => acessarEmpenho(empenho.id));

  return card;
}

function formatCurrency(value) {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numberValue);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function capitalize(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function acessarEmpenho(id) {
  window.location.href = `/detalhes-empenho?id=${encodeURIComponent(id)}`;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('profilePhoto');
  window.location.href = '/';
}
