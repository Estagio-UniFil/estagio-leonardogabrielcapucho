const express = require('express');
const router = express.Router();
const AnotacaoController = require('../controllers/AnotacaoController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/:id/desfazer-delecao', AnotacaoController.desfazerDelecao);
router.delete('/:id/permanente', AnotacaoController.hardDeleteAnotacao);
router.get('/:id/versoes', AnotacaoController.listarVersoes);

router.post('/', AnotacaoController.criarAnotacao);
router.get('/', AnotacaoController.listarAnotacoes);
router.get('/:id', AnotacaoController.buscarAnotacao);
router.put('/:id', AnotacaoController.atualizarAnotacao);
router.delete('/:id', AnotacaoController.deletarAnotacao);

module.exports = router;

