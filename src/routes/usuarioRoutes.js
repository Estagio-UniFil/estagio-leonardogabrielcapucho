const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

router.post('/', async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

router.get('/', async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
});

module.exports = router;
