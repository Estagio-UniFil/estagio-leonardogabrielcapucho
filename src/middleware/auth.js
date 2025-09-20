const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'gacp-secret-key-2024';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ erro: 'Token de acesso não fornecido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ erro: 'Usuário não encontrado ou inativo' });
    }

    req.user = {
      id: usuario.id,
      nome: usuario.nome,
      login: usuario.login,
      email: usuario.email
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ erro: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ erro: 'Token expirado' });
    }
    res.status(500).json({ erro: 'Erro na autenticação' });
  }
};

module.exports = { authMiddleware, JWT_SECRET };
