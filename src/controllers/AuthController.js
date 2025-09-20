const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { JWT_SECRET } = require('../middleware/auth');

class AuthController {
  static async login(req, res) {
    try {
      const { login, senha } = req.body;

      if (!login || !senha) {
        return res.status(400).json({ erro: 'Login e senha são obrigatórios' });
      }

      const usuario = await Usuario.findOne({ 
        where: { login, ativo: true } 
      });

      if (!usuario) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
      }

      const token = jwt.sign(
        { 
          id: usuario.id, 
          login: usuario.login 
        }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );

      res.status(200).json({
        mensagem: 'Login realizado com sucesso',
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          login: usuario.login,
          email: usuario.email
        }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async logout(req, res) {
    try {
      res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  static async verificarToken(req, res) {
    try {
      res.status(200).json({
        usuario: req.user
      });
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = AuthController;
