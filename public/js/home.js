const API_BASE_URL = 'http://localhost:3000/api';
const RECENT_STORAGE_KEY = 'recentEmpenhos';
let cachedEmpenhos = null;

document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    window.location.href = '/';
    return;
  }

  try {
    const userData = JSON.parse(user);
    const userName = document.getElementById('userName');
    const welcomeName = document.getElementById('welcomeUserName');
    if (userName) userName.textContent = userData.nome;
    if (welcomeName) welcomeName.textContent = userData.nome;

    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      const photoEl = document.getElementById('profilePhoto');
      if (photoEl) {
        photoEl.src = savedPhoto;
      }
    }

    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
      photoInput.addEventListener('change', atualizarFotoPerfil);
    }

    carregarEmpenhosRecentes();
    carregarLembretesPagamentos();
  } catch (error) {
    console.error('Erro ao carregar dados do usuario:', error);
    logout();
  }
});

function atualizarFotoPerfil(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const photoUrl = e.target && e.target.result;
    const photoEl = document.getElementById('profilePhoto');
    if (photoUrl && photoEl) {
      photoEl.src = photoUrl;
      localStorage.setItem('profilePhoto', photoUrl);
    }
  };
  reader.readAsDataURL(file);
}

async function carregarEmpenhosRecentes() {
  const container = document.getElementById('empenhosRecentes');
  if (!container) {
    return;
  }

  container.innerHTML = '<div class="loading">Carregando historico...</div>';

  try {
    const [empenhos, historicoLocal] = await Promise.all([
      buscarEmpenhos(),
      Promise.resolve(obterHistoricoLocal())
    ]);

    const mapaEmpenhos = new Map(empenhos.map((item) => [String(item.id), item]));
    const recentes = historicoLocal
      .map((registro) => mapaEmpenhos.get(String(registro.id)))
      .filter(Boolean);

    const lista = (recentes.length > 0 ? recentes : empenhos).slice(0, 5);

    if (lista.length === 0) {
      container.innerHTML = '<div class="empty-state">Nenhum empenho cadastrado.</div>';
      return;
    }

    exibirEmpenhosRecentes(lista, container);
  } catch (error) {
    console.error('Erro ao carregar empenhos recentes:', error);
    container.innerHTML = '<div class="error-message">Nao foi possivel carregar o historico.</div>';
  }
}

async function carregarLembretesPagamentos() {
  const container = document.getElementById('lembreteContent');
  if (!container) {
    return;
  }

  container.innerHTML = '<div class="loading">Carregando lembretes...</div>';

  try {
    const empenhos = await buscarEmpenhos();
    const pendentes = empenhos
      .filter((empenho) => (empenho.status_geral || '').toLowerCase() !== 'pago')
      .sort((a, b) => ordenarPorVencimento(a.data_vencimento, b.data_vencimento))
      .slice(0, 5);

    if (!pendentes.length) {
      container.innerHTML = '<div class="empty-state">Nenhum pagamento pendente.</div>';
      return;
    }

    container.innerHTML = '';
    pendentes.forEach((empenho) => container.appendChild(criarLembreteItem(empenho)));
  } catch (error) {
    console.error('Erro ao carregar lembretes de pagamento:', error);
    container.innerHTML = '<div class="error-message">Nao foi possivel carregar os lembretes.</div>';
  }
}

async function buscarEmpenhos(forceRefresh = false) {
  if (!forceRefresh && Array.isArray(cachedEmpenhos)) {
    return cachedEmpenhos;
  }

  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: 'Bearer ' + token } : {};
  const response = await fetch(`${API_BASE_URL}/empenhos`, { headers });

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os empenhos.');
  }

  const payload = await response.json();
  cachedEmpenhos = Array.isArray(payload) ? payload : [];
  return cachedEmpenhos;
}

function obterHistoricoLocal() {
  try {
    const armazenados = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '[]');
    if (!Array.isArray(armazenados)) {
      return [];
    }

    return armazenados
      .filter((registro) => registro && typeof registro.id !== 'undefined')
      .sort((a, b) => {
        const dataA = new Date(a.acessadoEm || 0).getTime();
        const dataB = new Date(b.acessadoEm || 0).getTime();
        return dataB - dataA;
      });
  } catch (error) {
    console.warn('Nao foi possivel ler o historico local:', error);
    return [];
  }
}

function exibirEmpenhosRecentes(empenhos, container) {
  container.innerHTML = '';

  empenhos.slice(0, 5).forEach((empenho) => {
    const link = document.createElement('a');
    link.href = `/detalhes-empenho?id=${encodeURIComponent(empenho.id)}`;
    link.className = 'empenho-link';
    link.innerHTML = `
      <strong>Empenho ${escapeHtml(empenho.numero || '')}</strong><br>
      <small>${escapeHtml(truncarDescricao(empenho.descricao || 'Sem descricao'))}</small>
    `;
    container.appendChild(link);
  });
}

function criarLembreteItem(empenho) {
  const item = document.createElement('div');
  item.className = 'lembrete-item';
  const secretaria = empenho.secretario_setor || empenho.secretario_nome || 'Secretaria nao informada';

  item.innerHTML = `
    <strong>Empenho ${escapeHtml(empenho.numero || '')}</strong> - ${escapeHtml(secretaria)}<br>
    <small>Vence em ${formatDate(empenho.data_vencimento)} - ${formatCurrency(empenho.valor)}</small>
  `;

  item.addEventListener('click', () => {
    window.location.href = `/detalhes-empenho?id=${encodeURIComponent(empenho.id)}`;
  });

  return item;
}

function ordenarPorVencimento(dataA, dataB) {
  return obterValorData(dataA) - obterValorData(dataB);
}

function obterValorData(valor) {
  if (!valor) {
    return Number.MAX_SAFE_INTEGER;
  }
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? Number.MAX_SAFE_INTEGER : data.getTime();
}

function formatCurrency(value) {
  const numero = Number(value);
  if (Number.isNaN(numero)) {
    return '-';
  }
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero);
}

function formatDate(dateString) {
  if (!dateString) {
    return '-';
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleDateString('pt-BR');
}

function truncarDescricao(texto, limite = 50) {
  if (!texto) {
    return '';
  }
  return texto.length > limite ? texto.slice(0, limite).trimEnd() + '...' : texto;
}

function escapeHtml(valor) {
  return String(valor)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('profilePhoto');
  window.location.href = '/';
}
