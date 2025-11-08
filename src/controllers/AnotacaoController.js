const Anotacao = require('../models/Anotacao');
const Usuario = require('../models/Usuario');
const NoteVersion = require('../models/NoteVersion');
const Empenho = require('../models/Empenho');
const { ForeignKeyConstraintError } = require('sequelize');

const AnotacaoController = {
  async criarAnotacao(req, res) {
    try {
      const { texto, empenho_id } = req.body;
      const textoLimpo = typeof texto === 'string' ? texto.trim() : '';

      if (!textoLimpo) {
        return res.status(400).json({
          success: false,
          message: 'O texto da anotação é obrigatório'
        });
      }

      let vinculoEmpenho = null;
      if (empenho_id !== undefined && empenho_id !== null && empenho_id !== '') {
        const empenhoIdParse = Number(empenho_id);
        if (!Number.isInteger(empenhoIdParse) || empenhoIdParse <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Seleção de empenho inválida'
          });
        }

        const empenho = await Empenho.findByPk(empenhoIdParse);
        if (!empenho) {
          return res.status(400).json({
            success: false,
            message: 'Empenho vinculado não encontrado'
          });
        }
        vinculoEmpenho = empenho.id;
      }

      const anotacao = await Anotacao.create({
        texto: textoLimpo,
        created_by: req.user.id,
        empenho_id: vinculoEmpenho
      });

      await anotacao.reload({
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'login']
        }, {
          model: Empenho,
          as: 'empenho',
          attributes: ['id', 'numero', 'descricao', 'valor', 'status_geral']
        }]
      });

      res.status(201).json({
        success: true,
        data: anotacao,
        message: 'Anotação criada com sucesso'
      });
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        console.warn('Falha ao vincular empenho na criação da anotação:', error);
        return res.status(400).json({
          success: false,
          message: 'Empenho vinculado não encontrado. Atualize a lista e tente novamente.'
        });
      }

      console.error('Erro ao criar anotação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async listarAnotacoes(req, res) {
    try {
      const anotacoes = await Anotacao.findAll({
        where: {
          is_deleted: false
        },
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'login']
        }, {
          model: Empenho,
          as: 'empenho',
          attributes: ['id', 'numero', 'descricao', 'valor', 'status_geral']
        }],
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'texto', 'created_by', 'empenho_id', 'createdAt', 'updatedAt', 'deleted_at', 'is_deleted']
      });

      res.json({
        success: true,
        data: anotacoes || []
      });
    } catch (error) {
      console.error('Erro ao listar anotações:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async buscarAnotacao(req, res) {
    try {
      const { id } = req.params;
      const anotacao = await Anotacao.findByPk(id, {
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'login']
        }, {
          model: Empenho,
          as: 'empenho',
          attributes: ['id', 'numero', 'descricao', 'valor', 'status_geral']
        }],
        attributes: ['id', 'texto', 'created_by', 'empenho_id', 'createdAt', 'updatedAt', 'deleted_at', 'is_deleted']
      });

      if (!anotacao) {
        return res.status(404).json({
          success: false,
          message: 'Anotação não encontrada'
        });
      }

      if (anotacao.is_deleted) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível editar uma anotação deletada'
        });
      }

      res.json({
        success: true,
        data: anotacao
      });
    } catch (error) {
      console.error('Erro ao buscar anotação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async atualizarAnotacao(req, res) {
    try {
      const { id } = req.params;
      const { texto, motivo, empenho_id } = req.body;

      if (!texto || texto.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'O texto da anotação é obrigatório'
        });
      }

      if (!motivo || motivo.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'O motivo da edição é obrigatório'
        });
      }

      const anotacao = await Anotacao.findByPk(id);

      if (!anotacao) {
        return res.status(404).json({
          success: false,
          message: 'Anotação não encontrada'
        });
      }

      if (anotacao.created_by !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para editar esta anotação'
        });
      }

      if (anotacao.is_deleted) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível editar uma anotação deletada'
        });
      }

      let vinculoEmpenho = anotacao.empenho_id;
      if (empenho_id !== undefined) {
        if (empenho_id === null || empenho_id === '') {
          vinculoEmpenho = null;
        } else {
          const empenhoIdParse = Number(empenho_id);
          if (!Number.isInteger(empenhoIdParse) || empenhoIdParse <= 0) {
            return res.status(400).json({
              success: false,
              message: 'Seleção de empenho inválida'
            });
          }

          const empenho = await Empenho.findByPk(empenhoIdParse);
          if (!empenho) {
            return res.status(400).json({
              success: false,
              message: 'Empenho vinculado não encontrado'
            });
          }
          vinculoEmpenho = empenho.id;
        }
      }

      await NoteVersion.create({
        note_id: anotacao.id,
        body: anotacao.texto,
        edited_by: req.user.id,
        empenho_id: anotacao.empenho_id,
        reason: motivo.trim()
      });

      await anotacao.update({
        texto: texto.trim(),
        empenho_id: vinculoEmpenho
      });

      await anotacao.reload({
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'login']
        }, {
          model: Empenho,
          as: 'empenho',
          attributes: ['id', 'numero', 'descricao', 'valor', 'status_geral']
        }]
      });

      res.json({
        success: true,
        data: anotacao,
        message: 'Anotação atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar anotação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async deletarAnotacao(req, res) {
    try {
      const { id } = req.params;
      const anotacao = await Anotacao.findByPk(id);

      if (!anotacao) {
        return res.status(404).json({
          success: false,
          message: 'Anotação não encontrada'
        });
      }

      if (anotacao.is_deleted) {
        return res.status(400).json({
          success: false,
          message: 'Anotação já foi deletada'
        });
      }

      if (anotacao.created_by !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para deletar esta anotação'
        });
      }

      const agora = new Date();
      const tempoCriacao = new Date(anotacao.createdAt);
      const diferencaSegundos = (agora - tempoCriacao) / 1000;

      if (diferencaSegundos > 60) {
        return res.status(403).json({
          success: false,
          message: 'Não é possível deletar anotações após 60 segundos da criação'
        });
      }

      await anotacao.update({
        is_deleted: true,
        deleted_at: agora
      });

      res.json({
        success: true,
        message: 'Anotação deletada com sucesso. Você tem 60 segundos para desfazer.'
      });
    } catch (error) {
      console.error('Erro ao deletar anotação:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async desfazerDelecao(req, res) {
    try {
      const { id } = req.params;
      const anotacao = await Anotacao.findByPk(id);

      if (!anotacao) {
        return res.status(404).json({
          success: false,
          message: 'Anotação não encontrada'
        });
      }

      if (anotacao.created_by !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para desfazer esta deleção'
        });
      }

      if (!anotacao.is_deleted) {
        return res.status(400).json({
          success: false,
          message: 'Anotação não foi deletada'
        });
      }

      const agora = new Date();
      const tempoDelecao = new Date(anotacao.deleted_at);
      const diferencaSegundos = (agora - tempoDelecao) / 1000;

      if (diferencaSegundos > 60) {
        return res.status(403).json({
          success: false,
          message: 'Não é possível desfazer a deleção após 60 segundos'
        });
      }

      await anotacao.update({
        is_deleted: false,
        deleted_at: null
      });

      res.json({
        success: true,
        message: 'Deleção desfeita com sucesso'
      });
    } catch (error) {
      console.error('Erro ao desfazer deleção:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async hardDeleteAnotacao(req, res) {
    try {
      const { id } = req.params;
      const anotacao = await Anotacao.findByPk(id);

      if (!anotacao) {
        return res.status(404).json({
          success: false,
          message: 'Anotação não encontrada'
        });
      }

      if (req.user.login !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Apenas administradores podem deletar permanentemente anotações'
        });
      }

      await anotacao.destroy();

      res.json({
        success: true,
        message: 'Anotação deletada permanentemente'
      });
    } catch (error) {
      console.error('Erro ao deletar permanentemente:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  },

  async listarVersoes(req, res) {
    try {
      console.log('Iniciando busca de versões para anotação:', req.params.id);

      const { id } = req.params;
      const anotacao = await Anotacao.findByPk(id);

      if (!anotacao) {
        console.log('Anotação não encontrada:', id);
        return res.status(404).json({
          success: false,
          message: 'Anotação não encontrada'
        });
      }

      const versoes = await NoteVersion.findAll({
        where: { note_id: id },
        include: [{
          model: Usuario,
          as: 'editor',
          attributes: ['id', 'nome', 'login']
        }, {
          model: Empenho,
          as: 'empenho',
          attributes: ['id', 'numero', 'descricao', 'valor', 'status_geral']
        }],
        order: [['createdAt', 'DESC']]
      });

      console.log('Versões encontradas:', versoes.length);

      res.json({
        success: true,
        data: versoes,
        message: `${versoes.length} versão(ões) encontrada(s)`
      });
    } catch (error) {
      console.error('Erro ao listar versões:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = AnotacaoController;
