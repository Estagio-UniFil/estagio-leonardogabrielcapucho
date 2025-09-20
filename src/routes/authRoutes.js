const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/auth');

router.post('/login', AuthController.login);

router.post('/logout', authMiddleware, AuthController.logout);

router.get('/verificar', authMiddleware, AuthController.verificarToken);

module.exports = router;
