const Pagamento = require('../models/Pagamento');
const Empenho = require('../models/Empenho');

module.exports = {
  async criarPagamento(req, res) {
    try {
      const pagamento = await Pagamento.create(req.body);
      res.status(201).json(pagamento);
    } catch (err) {
      res.status(400).json({ erro: err.message });
    }
  },

  async listarPagamentos(req, res) {
    try {
      const pagamentos = await Pagamento.findAll({
        include: [{ model: Empenho }],
        order: [['createdAt', 'DESC']]
      });
      res.json(pagamentos);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar pagamentos.' });
    }
  }
};
