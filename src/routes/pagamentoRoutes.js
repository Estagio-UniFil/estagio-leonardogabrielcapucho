const express = require('express');
const router = express.Router();
const PagamentoController = require('../controllers/PagamentoController');

router.post('/', PagamentoController.criarPagamento);
router.get('/', PagamentoController.listarPagamentos);

module.exports = router;
