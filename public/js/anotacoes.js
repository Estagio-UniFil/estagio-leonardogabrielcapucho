(function() {
  function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  class AnotacoesPage {
    constructor() {
      this.textarea = document.getElementById('textoAnotacao');
      this.empenhoSelect = document.getElementById('empenhoSelect');
      this.lista = document.getElementById('listaAnotacoes');
      this.btnSalvar = document.getElementById('btnSalvar');

      this.modalEdicao = document.getElementById('modalEdicao');
      this.modalConfirmacao = document.getElementById('modalConfirmacao');
      this.modalVersoes = document.getElementById('modalVersoes');

      this.editTextarea = document.getElementById('editTextarea');
      this.editEmpenhoSelect = document.getElementById('editEmpenhoSelect');
      this.motivoEdicao = document.getElementById('motivoEdicao');

      this.anotacaoEditando = null;
      this.anotacaoDeletando = null;
      this.empenhos = [];

      this.init();
    }

    async init() {
      if (!this.validarUsuario()) return;
      this.configurarPerfil();
      this.configurarEventos();
      await this.carregarEmpenhos();
      await this.carregarAnotacoes();
    }

    validarUsuario() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (!token || !user) {
        window.location.href = '/';
        return false;
      }
      try {
        const data = JSON.parse(user);
        const nomeEl = document.getElementById('userName');
        if (nomeEl) nomeEl.textContent = data.nome;
        return true;
      } catch (err) {
        console.error('Erro ao ler usuario:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return false;
      }
    }

    configurarPerfil() {
      const savedPhoto = localStorage.getItem('profilePhoto');
      const photoEl = document.getElementById('profilePhoto');
      if (savedPhoto && photoEl) {
        photoEl.src = savedPhoto;
      }
      const input = document.getElementById('photoInput');
      if (input) {
        input.addEventListener('change', (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (e) => {
            const url = e.target.result;
            if (photoEl) photoEl.src = url;
            localStorage.setItem('profilePhoto', url);
          };
          reader.readAsDataURL(file);
        });
      }
    }

    configurarEventos() {
      if (this.btnSalvar) {
        this.btnSalvar.addEventListener('click', () => this.criarAnotacao());
      }
      if (this.textarea) {
        this.textarea.addEventListener('keydown', (event) => {
          if (event.ctrlKey && event.key === 'Enter') {
            this.criarAnotacao();
          }
        });
      }

      const closeEdicao = this.modalEdicao?.querySelector('.close');
      closeEdicao?.addEventListener('click', () => this.fecharModal(this.modalEdicao));
      document.getElementById('btnCancelarEdicao')?.addEventListener('click', () => this.fecharModal(this.modalEdicao));
      document.getElementById('btnSalvarEdicao')?.addEventListener('click', () => this.salvarEdicao());

      document.getElementById('btnCancelarDelecao')?.addEventListener('click', () => this.fecharModal(this.modalConfirmacao));
      document.getElementById('btnConfirmarDelecao')?.addEventListener('click', () => this.confirmarDelecao());

      const closeVersoes = this.modalVersoes?.querySelector('.close');
      closeVersoes?.addEventListener('click', () => this.fecharModal(this.modalVersoes));
    }

    async carregarEmpenhos() {
      try {
        const response = await fetch('/api/empenhos', { headers: getAuthHeaders() });
        if (!response.ok) throw new Error('Falha ao carregar lista de empenhos');
        this.empenhos = await response.json();
      } catch (err) {
        console.warn('Erro carregando empenhos:', err);
        this.empenhos = [];
      }
      this.popularSelect(this.empenhoSelect);
      this.popularSelect(this.editEmpenhoSelect);
    }

    popularSelect(select, selectedId) {
      if (!select) return;
      select.innerHTML = '';
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'Sem vinculo';
      select.appendChild(option);
      this.empenhos.forEach((empenho) => {
        if (!empenho || empenho.id == null) return;
        const opt = document.createElement('option');
        opt.value = String(empenho.id);
        const numero = empenho.numero ? String(empenho.numero) : `#${empenho.id}`;
        const descricao = empenho.descricao ? ` - ${empenho.descricao}` : '';
        opt.textContent = `Empenho ${numero}${descricao}`;
        select.appendChild(opt);
      });
      if (selectedId) {
        select.value = String(selectedId);
      }
    }

    async criarAnotacao() {
      const texto = this.textarea?.value.trim();
      if (!texto) {
        this.mostrarMensagem('Digite uma anotacao.', 'error');
        return;
      }
      if (this.btnSalvar) {
        this.btnSalvar.disabled = true;
        this.btnSalvar.textContent = 'Salvando...';
      }
      try {
        const payload = { texto };
        if (this.empenhoSelect && this.empenhoSelect.value) {
          payload.empenho_id = Number(this.empenhoSelect.value);
        }
        const response = await fetch('/api/anotacoes', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (response.ok && result.success) {
          this.mostrarMensagem('Anotacao criada com sucesso!', 'success');
          if (this.textarea) this.textarea.value = '';
          if (this.empenhoSelect) this.empenhoSelect.value = '';
          await this.carregarAnotacoes();
        } else {
          this.mostrarMensagem(result.message || 'Erro ao criar anotacao.', 'error');
        }
      } catch (err) {
        console.error('Erro:', err);
        this.mostrarMensagem('Erro de conexao. Tente novamente.', 'error');
      } finally {
        if (this.btnSalvar) {
          this.btnSalvar.disabled = false;
          this.btnSalvar.textContent = 'Salvar anotacao';
        }
      }
    }

    async carregarAnotacoes() {
      if (this.lista) {
        this.lista.innerHTML = '<div class="loading">Carregando anotacoes...</div>';
      }
      try {
        const response = await fetch('/api/anotacoes', { headers: getAuthHeaders() });
        const result = await response.json();
        if (response.ok && result.success) {
          this.exibirAnotacoes(result.data || []);
        } else {
          this.mostrarMensagem('Erro ao carregar anotacoes.', 'error');
        }
      } catch (err) {
        console.error('Erro:', err);
        this.mostrarMensagem('Erro de conexao ao carregar anotacoes.', 'error');
      }
    }

    exibirAnotacoes(anotacoes) {
      if (!this.lista) return;
      if (!anotacoes.length) {
        this.lista.innerHTML = `
          <div class="anotacao-vazia">
            Nenhuma anotacao encontrada.<br>
            Crie sua primeira anotacao acima!
          </div>`;
        return;
      }
      this.lista.innerHTML = anotacoes.map((anotacao) => this.criarCard(anotacao)).join('');
      this.registrarEventosLista();
    }

    criarCard(anotacao) {
      const usuario = anotacao.usuario ? anotacao.usuario.nome : 'Usuario';
      const foiEditada = anotacao.updatedAt && anotacao.updatedAt !== anotacao.createdAt;
      const data = formatDate(anotacao.createdAt);
      const empenhoHtml = this.renderEmpenho(anotacao.empenho);
      return `
        <div class="anotacao-card" data-id="${anotacao.id}">
          <div class="anotacao-texto">
            ${this.escapeHtml(anotacao.texto || '')}
            ${foiEditada ? '<span class="anotacao-editada">(editado)</span>' : ''}
          </div>
          ${empenhoHtml}
          <div class="anotacao-meta">
            <span class="anotacao-data">${data}</span>
            <span class="anotacao-autor">${this.escapeHtml(usuario)}</span>
            <div class="anotacao-acoes">
              <button class="btn-editar-anotacao" data-id="${anotacao.id}" title="Editar anotacao">Editar</button>
              <button class="btn-deletar-anotacao" data-id="${anotacao.id}" title="Deletar anotacao">Deletar</button>
              <button class="btn-ver-versoes" data-id="${anotacao.id}" title="Ver historico de versoes">Historico</button>
            </div>
          </div>
        </div>`;
    }

    renderEmpenho(empenho) {
      if (!empenho) {
        return '<div class="anotacao-empenho sem-vinculo">Sem empenho vinculado</div>';
      }
      const url = `/detalhes-empenho?id=${encodeURIComponent(empenho.id)}`;
      const numero = empenho.numero ? String(empenho.numero) : `#${empenho.id}`;
      const descricao = empenho.descricao ? ` - ${this.escapeHtml(empenho.descricao)}` : '';
      return `
        <div class="anotacao-empenho">
          <span class="empenho-label">Empenho:</span>
          <a class="empenho-link" href="${url}" target="_blank" rel="noopener">Empenho ${this.escapeHtml(numero)}${descricao}</a>
        </div>`;
    }

    registrarEventosLista() {
      document.querySelectorAll('.btn-editar-anotacao').forEach((btn) => {
        btn.addEventListener('click', () => this.iniciarEdicao(btn.getAttribute('data-id')));
      });
      document.querySelectorAll('.btn-deletar-anotacao').forEach((btn) => {
        btn.addEventListener('click', () => this.iniciarDelecao(btn.getAttribute('data-id')));
      });
      document.querySelectorAll('.btn-ver-versoes').forEach((btn) => {
        btn.addEventListener('click', () => this.verVersoes(btn.getAttribute('data-id')));
      });
    }

    async iniciarEdicao(id) {
      try {
        const response = await fetch(`/api/anotacoes/${id}`, { headers: getAuthHeaders() });
        const result = await response.json();
        if (!response.ok || !result.success) {
          this.mostrarMensagem(result.message || 'Erro ao carregar anotacao.', 'error');
          return;
        }
        const anotacao = result.data;
        this.anotacaoEditando = id;
        if (this.editTextarea) this.editTextarea.value = anotacao.texto || '';
        this.popularSelect(this.editEmpenhoSelect, anotacao.empenho_id || (anotacao.empenho?.id));
        if (this.motivoEdicao) this.motivoEdicao.value = '';
        this.abrirModal(this.modalEdicao);
      } catch (err) {
        console.error('Erro:', err);
        this.mostrarMensagem('Erro de conexao.', 'error');
      }
    }

    async salvarEdicao() {
      if (!this.anotacaoEditando) return;
      const texto = this.editTextarea?.value.trim();
      const motivo = this.motivoEdicao?.value.trim();
      if (!texto) {
        this.mostrarMensagem('O texto da anotacao nao pode estar vazio.', 'error');
        return;
      }
      if (!motivo) {
        this.mostrarMensagem('Informe o motivo da edicao.', 'error');
        return;
      }
      const payload = { texto, motivo };
      if (this.editEmpenhoSelect) {
        const selecionado = this.editEmpenhoSelect.value;
        if (selecionado === '') {
          payload.empenho_id = null;
        } else if (!Number.isNaN(Number(selecionado))) {
          payload.empenho_id = Number(selecionado);
        }
      }
      try {
        const response = await fetch(`/api/anotacoes/${this.anotacaoEditando}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (response.ok && result.success) {
          this.mostrarMensagem('Anotacao atualizada com sucesso!', 'success');
          this.fecharModal(this.modalEdicao);
          this.carregarAnotacoes();
        } else {
          this.mostrarMensagem(result.message || 'Erro ao atualizar anotacao.', 'error');
        }
      } catch (err) {
        console.error('Erro:', err);
        this.mostrarMensagem('Erro de conexao ao atualizar anotacao.', 'error');
      }
    }

    iniciarDelecao(id) {
      this.anotacaoDeletando = id;
      this.abrirModal(this.modalConfirmacao);
    }

    async confirmarDelecao() {
      if (!this.anotacaoDeletando) return;
      try {
        const response = await fetch(`/api/anotacoes/${this.anotacaoDeletando}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        const result = await response.json();
        if (response.ok && result.success) {
          this.mostrarMensagem(result.message || 'Anotacao deletada.', 'success');
          this.fecharModal(this.modalConfirmacao);
          this.carregarAnotacoes();
        } else {
          this.mostrarMensagem(result.message || 'Erro ao deletar anotacao.', 'error');
        }
      } catch (err) {
        console.error('Erro:', err);
        this.mostrarMensagem('Erro de conexao ao deletar anotacao.', 'error');
      }
    }

    async verVersoes(id) {
      try {
        const response = await fetch(`/api/anotacoes/${id}/versoes`, { headers: getAuthHeaders() });
        const result = await response.json();
        if (response.ok && result.success) {
          this.exibirVersoes(result.data || []);
          this.abrirModal(this.modalVersoes);
        } else {
          this.mostrarMensagem(result.message || 'Erro ao carregar versoes.', 'error');
        }
      } catch (err) {
        console.error('Erro:', err);
        this.mostrarMensagem('Erro de conexao ao carregar versoes.', 'error');
      }
    }

    exibirVersoes(versoes) {
      const lista = document.getElementById('listaVersoes');
      if (!lista) return;
      if (!versoes.length) {
        lista.innerHTML = '<p>Nenhuma versao encontrada.</p>';
        return;
      }
      lista.innerHTML = versoes.map((versao) => {
        const texto = this.escapeHtml(versao.body || '');
        const motivo = this.escapeHtml(versao.reason || 'Sem motivo informado');
        const editor = versao.editor ? this.escapeHtml(versao.editor.nome) : 'Usuario';
        const data = formatDate(versao.createdAt);
        const empenhoRotulo = versao.empenho ? this.escapeHtml(`Empenho ${versao.empenho.numero || versao.empenho.id}`) : 'Sem vinculo';
        const empenhoLink = versao.empenho ? `<a class="versao-empenho-link" href="/detalhes-empenho?id=${encodeURIComponent(versao.empenho.id)}" target="_blank" rel="noopener">${empenhoRotulo}</a>` : `<span class="versao-empenho-sem-vinculo">${empenhoRotulo}</span>`;
        return `
          <div class="versao-item">
            <div class="versao-texto">${texto}</div>
            <div class="versao-meta">
              <span class="versao-motivo">Motivo: ${motivo}</span>
              <span class="versao-empenho">Empenho: ${empenhoLink}</span>
              <span class="versao-data">${data}</span>
              <span class="versao-editor">Por: ${editor}</span>
            </div>
          </div>`;
      }).join('');
    }

    abrirModal(modal) {
      if (modal) modal.style.display = 'block';
    }

    fecharModal(modal) {
      if (!modal) return;
      modal.style.display = 'none';
      if (modal === this.modalEdicao) {
        this.anotacaoEditando = null;
        if (this.editTextarea) this.editTextarea.value = '';
        if (this.editEmpenhoSelect) this.editEmpenhoSelect.value = '';
        if (this.motivoEdicao) this.motivoEdicao.value = '';
      }
      if (modal === this.modalConfirmacao) {
        this.anotacaoDeletando = null;
      }
    }

    mostrarMensagem(texto, tipo) {
      document.querySelectorAll('.page-message').forEach(el => el.remove());
      const mensagem = document.createElement('div');
      mensagem.className = `page-message ${tipo}`;
      mensagem.textContent = texto;
      const container = document.querySelector('.main-content h1')?.parentElement || document.body;
      container.insertAdjacentElement('afterbegin', mensagem);
      setTimeout(() => mensagem.remove(), 4000);
    }

    escapeHtml(texto) {
      const div = document.createElement('div');
      div.textContent = texto ?? '';
      return div.innerHTML;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new AnotacoesPage();
  });
})();
