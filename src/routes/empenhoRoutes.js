const express = require('express');
const router = express.Router();
const EmpenhoController = require('../controllers/EmpenhoController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '..', '..', 'uploads', 'comprovantes');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const original = file.originalname || 'comprovante.pdf';
    const ext = path.extname(original) || '.pdf';
    const base = path
      .basename(original, ext)
      .replace(/\s+/g, '_')
      .replace(/[^\w.-]/g, '');
    const cleanedBase = base || 'comprovante';
    const finalName = Date.now() + '-' + req.params.id + '-' + cleanedBase + ext;
    cb(null, finalName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    return cb(null, true);
  }
  return cb(new Error('Apenas arquivos PDF sao permitidos.'), false);
};

const upload = multer({ storage, fileFilter });

const uploadMiddleware = (req, res, next) => {
  upload.single('comprovante')(req, res, (err) => {
    if (!err) {
      return next();
    }

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ erro: err.message });
    }

    return res.status(400).json({ erro: err.message || 'Falha ao processar arquivo.' });
  });
};

router.post('/', EmpenhoController.criarEmpenho);
router.get('/', EmpenhoController.listarEmpenhos);
router.get('/:id', EmpenhoController.obterEmpenhoPorId);
router.post('/:id/confirmar-pagamento', uploadMiddleware, EmpenhoController.confirmarPagamento);

module.exports = router;
