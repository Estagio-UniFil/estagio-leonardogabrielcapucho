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
          message: 'O texto da anotacao e obrigatorio'
        });
      }

      let vinculoEmpenho = null;
      if (empenho_id !== undefined && empenho_id !== null && empenho_id !== '') {
        const empenhoIdParse = Number(empenho_id);
        if (!Number.isInteger(empenhoIdParse) || empenhoIdParse <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Selecao de empenho invalida'
          });
        }

        const empenho = await Empenho.findByPk(empenhoIdParse);
        if (!empenho) {
          return res.status(400).json({
            success: false,
            message: 'Empenho vinculado nao encontrado'
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
        message: 'Anotacao criada com sucesso'
      });
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        console.warn('Falha ao vincular empenho na criacao da anotacao:', error);
        return res.status(400).json({
          success: false,
          message: 'Empenho vinculado nao encontrado. Atualize a lista e tente novamente.'
        });
      }

      console.error('Erro ao criar anotacao:', error);
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
      console.error('Erro ao listar anotaÃƒÂ§ÃƒÂµes:', error);
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
          message: 'AnotaÃƒÂ§ÃƒÂ£o nÃƒÂ£o encontrada' 
        });
      }

      if (anotacao.is_deleted) {
        return res.status(400).json({ 
          success: false, 
          message: 'NÃƒÂ£o ÃƒÂ© possÃƒÂ­vel editar uma anotaÃƒÂ§ÃƒÂ£o deletada' 
        });
      }

      res.json({
        success: true,
        data: anotacao
      });
    } catch (error) {
      console.error('Erro ao buscar anotaÃƒÂ§ÃƒÂ£o:', error);
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
          message: 'O texto da anotacao e obrigatorio' 
        });
      }

      if (!motivo || motivo.trim() === '') {
        return res.status(400).json({ 
          success: false, 
          message: 'O motivo da edicao e obrigatorio' 
        });
      }

      const anotacao = await Anotacao.findByPk(id);
      
      if (!anotacao) {
        return res.status(404).json({ 
          success: false, 
          message: 'Anotacao nao encontrada' 
        });
      }

      if (anotacao.created_by !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'Voce nao tem permissao para editar esta anotacao' 
        });
      }

      if (anotacao.is_deleted) {
        return res.status(400).json({ 
          success: false, 
          message: 'Nao e possivel editar uma anotacao deletada' 
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
              message: 'Selecao de empenho invalida'
            });
          }

          const empenho = await Empenho.findByPk(empenhoIdParse);
          if (!empenho) {
            return res.status(400).json({
              success: false,
              message: 'Empenho vinculado nao encontrado'
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
        message: 'AnotaÃƒÂ§ÃƒÂ£o atualizada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar anotaÃƒÂ§ÃƒÂ£o:', error);
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
          message: 'AnotaÃƒÂ§ÃƒÂ£o nÃƒÂ£o encontrada' 
        });
      }

      if (anotacao.is_deleted) {
        return res.status(400).json({ 
          success: false, 
          message: 'AnotaÃƒÂ§ÃƒÂ£o jÃƒÂ¡ foi deletada' 
        });
      }

      if (anotacao.created_by !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'VocÃƒÂª nÃƒÂ£o tem permissÃƒÂ£o para deletar esta anotaÃƒÂ§ÃƒÂ£o' 
        });
      }

      const agora = new Date();
      const tempoCriacao = new Date(anotacao.createdAt);
      const diferencaSegundos = (agora - tempoCriacao) / 1000;

      if (diferencaSegundos > 60) {
        return res.status(403).json({ 
          success: false, 
          message: 'NÃƒÂ£o ÃƒÂ© possÃƒÂ­vel deletar anotaÃƒÂ§ÃƒÂµes apÃƒÂ³s 60 segundos da criaÃƒÂ§ÃƒÂ£o' 
        });
      }

      await anotacao.update({
        is_deleted: true,
        deleted_at: agora
      });

      res.json({ 
        success: true, 
        message: 'AnotaÃƒÂ§ÃƒÂ£o deletada com sucesso. VocÃƒÂª tem 60 segundos para desfazer.' 
      });
    } catch (error) {
      console.error('Erro ao deletar anotaÃƒÂ§ÃƒÂ£o:', error);
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
          message: 'AnotaÃƒÂ§ÃƒÂ£o nÃƒÂ£o encontrada' 
        });
      }

      if (anotacao.created_by !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'VocÃƒÂª nÃƒÂ£o tem permissÃƒÂ£o para desfazer esta deleÃƒÂ§ÃƒÂ£o' 
        });
      }

      if (!anotacao.is_deleted) {
        return res.status(400).json({ 
          success: false, 
          message: 'AnotaÃƒÂ§ÃƒÂ£o nÃƒÂ£o foi deletada' 
        });
      }

      const agora = new Date();
      const tempoDelecao = new Date(anotacao.deleted_at);
      const diferencaSegundos = (agora - tempoDelecao) / 1000;

      if (diferencaSegundos > 60) {
        return res.status(403).json({ 
          success: false, 
          message: 'NÃƒÂ£o ÃƒÂ© possÃƒÂ­vel desfazer a deleÃƒÂ§ÃƒÂ£o apÃƒÂ³s 60 segundos' 
        });
      }

      await anotacao.update({
        is_deleted: false,
        deleted_at: null
      });

      res.json({ 
        success: true, 
        message: 'DeleÃƒÂ§ÃƒÂ£o desfeita com sucesso' 
      });
    } catch (error) {
      console.error('Erro ao desfazer deleÃƒÂ§ÃƒÂ£o:', error);
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
          message: 'AnotaÃƒÂ§ÃƒÂ£o nÃƒÂ£o encontrada' 
        });
      }

      if (req.user.login !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'Apenas administradores podem deletar permanentemente anotaÃƒÂ§ÃƒÂµes' 
        });
      }

      await anotacao.destroy();

      res.json({ 
        success: true, 
        message: 'AnotaÃƒÂ§ÃƒÂ£o deletada permanentemente' 
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
      console.log('Ã°Å¸â€Â Iniciando busca de versÃƒÂµes para anotaÃƒÂ§ÃƒÂ£o:', req.params.id);
      
      const { id } = req.params;
      const anotacao = await Anotacao.findByPk(id);
      
      if (!anotacao) {
        console.log('Ã¢ÂÅ’ AnotaÃƒÂ§ÃƒÂ£o nÃƒÂ£o encontrada:', id);
        return res.status(404).json({ 
          success: false, 
          message: 'AnotaÃƒÂ§ÃƒÂ£o nÃƒÂ£o encontrada' 
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

      console.log('Ã¢Å“â€¦ VersÃƒÂµes encontradas:', versoes.length);

      res.json({
        success: true,
        data: versoes,
        message: `${versoes.length} versÃƒÂ£o(ÃƒÂµes) encontrada(s)`
      });
    } catch (error) {
      console.error('Ã¢ÂÅ’ Erro ao listar versÃƒÂµes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
};

module.exports = AnotacaoController;





















