const API_BASE_URL = 'http://localhost:3000/api';
const urlParams = new URLSearchParams(window.location.search);
const empenhoId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    window.location.href = '/';
    return;
  }

  if (!empenhoId) {
    alert('Empenho nao informado.');
    window.location.href = '/ver-empenhos';
    return;
  }

  try {
    const userData = JSON.parse(user);
    const nameEl = document.getElementById('userName');
    if (nameEl) nameEl.textContent = userData.nome;

    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      const photoEl = document.getElementById('profilePhoto');
      if (photoEl) photoEl.src = savedPhoto;
    }

    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
      photoInput.addEventListener('change', trocarFotoPerfil);
    }

    const pdfInput = document.getElementById('pdfInput');
    if (pdfInput) {
      pdfInput.addEventListener('change', mostrarNomePdf);
    }

    const confirmarBtn = document.getElementById('btnConfirmarPagamento');
    if (confirmarBtn) {
      confirmarBtn.addEventListener('click', confirmarPagamento);
    }

    carregarEmpenho(empenhoId);
  } catch (error) {
    console.error('Erro ao carregar dados do usuario:', error);
    alert('Erro ao carregar dados do usuario.');
    logout();
  }
});

function trocarFotoPerfil(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const photoUrl = ev.target && ev.target.result;
    const photoEl = document.getElementById('profilePhoto');
    if (photoEl && typeof photoUrl === 'string') {
      photoEl.src = photoUrl;
      localStorage.setItem('profilePhoto', photoUrl);
    }
  };
  reader.readAsDataURL(file);
}

async function carregarEmpenho(id) {
  try {
    const token = localStorage.getItem('token');
    const resp = await fetch(API_BASE_URL + '/empenhos/' + id, {
      headers: { Authorization: 'Bearer ' + token }
    });

    const empenho = await resp.json();
    if (!resp.ok) throw new Error(empenho && empenho.erro ? empenho.erro : 'Erro ao carregar empenho');

    preencherDados(empenho);
  } catch (error) {
    console.error('Erro ao carregar empenho:', error);
    alert(error.message || 'Erro ao carregar empenho');
  }
}

function preencherDados(empenho) {
  setText('numeroEmpenho', empenho.numero);
  setText('numero', empenho.numero);
  setText('valor', formatCurrency(empenho.valor));
  setText('descricao', empenho.descricao || '-');
  setText('dataVencimento', formatDate(empenho.data_vencimento));
  setText('secretario', (empenho.secretario_nome || '-') + ' - ' + (empenho.secretario_setor || '-'));

  atualizarStatus('statusSecretario', empenho.status_assinatura_secretario || 'Pendente');
  atualizarStatus('statusNotaFiscal', empenho.status_assinatura_nota_fiscal || 'Pendente');
  atualizarStatus('statusFormulario', empenho.status_assinatura_formulario || 'Pendente');

  const statusPag = document.getElementById('statusPagamento');
  if (statusPag) {
    const st = empenho.ultimo_pagamento_status || (empenho.status_geral === 'Pago' ? 'Confirmado' : 'Pendente');
    aplicarBadge(statusPag, st);
  }

  const comprovanteLink = document.getElementById('linkComprovante');
  if (comprovanteLink) {
    if (empenho.ultimo_comprovante_pdf) {
      comprovanteLink.href = empenho.ultimo_comprovante_pdf;
      comprovanteLink.textContent = 'Abrir comprovante';
      comprovanteLink.target = '_blank';
    } else {
      comprovanteLink.removeAttribute('href');
      comprovanteLink.removeAttribute('target');
      comprovanteLink.textContent = 'Nenhum comprovante disponivel.';
    }
  }

  setText('notaNumero', empenho.nota_fiscal_numero || '-');
  setText('notaValor', empenho.nota_fiscal_valor ? formatCurrency(empenho.nota_fiscal_valor) : '-');
  setText('notaData', empenho.nota_fiscal_data ? formatDate(empenho.nota_fiscal_data) : '-');
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value !== undefined && value !== null ? String(value) : '';
}

function atualizarStatus(elementId, status) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const badge = element.querySelector('.status-badge');
  if (!badge) return;
  aplicarBadge(badge, status);
}

function aplicarBadge(badge, status) {
  const texto = status ? String(status) : 'Pendente';
  const mapa = {
    assinado: 'assinado',
    confirmado: 'aprovado',
    pago: 'aprovado',
    aprovado: 'aprovado',
    pendente: 'pendente',
    rejeitado: 'rejeitado'
  };

  badge.textContent = texto;
  badge.className = 'status-badge ' + (mapa[texto.toLowerCase()] || texto.toLowerCase());
}

function formatCurrency(value) {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return '-';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('pt-BR');
}

function mostrarNomePdf(event) {
  const file = event.target.files && event.target.files[0];
  const nameEl = document.getElementById('pdfFileName');
  if (!nameEl) return;
  nameEl.textContent = file ? 'Arquivo selecionado: ' + file.name : 'Nenhum arquivo selecionado.';
}

async function confirmarPagamento() {
  let pagamentoConfirmado = false;
  const input = document.getElementById('pdfInput');
  const btn = document.getElementById('btnConfirmarPagamento');

  const pdfFile = input && input.files ? input.files[0] : null;
  if (!pdfFile) {
    alert('Selecione o comprovante (PDF) antes de confirmar.');
    return;
  }
  if (pdfFile.type !== 'application/pdf') {
    alert('Apenas arquivos PDF sao permitidos.');
    return;
  }
  if (!window.confirm('Confirmar pagamento deste empenho?')) return;

  try {
    if (btn) btn.disabled = true;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('comprovante', pdfFile);

    const resp = await fetch(API_BASE_URL + '/empenhos/' + empenhoId + '/confirmar-pagamento', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: formData
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data && data.erro ? data.erro : 'Falha ao confirmar pagamento.');

    alert('Pagamento confirmado com sucesso!');

    const statusPag = document.getElementById('statusPagamento');
    if (statusPag) aplicarBadge(statusPag, 'Confirmado');

    const link = document.getElementById('linkComprovante');
    if (link && data.pagamento && data.pagamento.comprovante_pdf) {
      link.href = data.pagamento.comprovante_pdf;
      link.textContent = 'Abrir comprovante';
      link.target = '_blank';
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Pagamento Confirmado';
      btn.classList.add('btn-disabled');
    }

    pagamentoConfirmado = true;
    await carregarEmpenho(empenhoId);
  } catch (error) {
    console.error(error);
    alert(error.message || 'Erro ao confirmar pagamento');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Confirmar Pagamento';
      btn.classList.remove('btn-disabled');
    }
  } finally {
    if (!pagamentoConfirmado && btn) {
      btn.disabled = false;
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('profilePhoto');
  window.location.href = '/';
}
