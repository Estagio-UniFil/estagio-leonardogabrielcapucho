const Empenho = require('../models/Empenho');
const Pagamento = require('../models/Pagamento');

function serializePagamento(instance) {
  if (!instance) {
    return null;
  }

  const data = instance.toJSON();

  return {
    id: data.id,
    empenho_id: data.empenho_id,
    valor_pago: data.valor_pago != null ? Number(data.valor_pago) : null,
    data_pagamento: data.data_pagamento || null,
    status_pagamento: data.status_pagamento || null,
    comprovante_pdf: data.comprovante_pdf || null,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null
  };
}

function deriveAssinaturaStatus(statusAtual, isPago) {
  const texto = (statusAtual || '').toString().trim();

  if (!texto) {
    return isPago ? 'Assinado' : 'Pendente';
  }

  const lower = texto.toLowerCase();
  if (isPago && (lower === 'pendente' || lower === 'confirmado')) {
    return 'Assinado';
  }

  return statusAtual;
}

function normalizeEmpenho(empenho, ultimoPagamento) {
  const plain = empenho.toJSON();
  const statusGeral = (plain.status_geral || '').toString();
  const isPago = statusGeral.toLowerCase() === 'pago';

  const statusSecretario = deriveAssinaturaStatus(plain.status_assinatura_secretario, isPago);
  const statusNotaFiscal = deriveAssinaturaStatus(plain.status_assinatura_nota_fiscal, isPago);
  const statusFormulario = deriveAssinaturaStatus(plain.status_assinatura_formulario, isPago);

  return {
    ...plain,
    valor: plain.valor != null ? Number(plain.valor) : null,
    status_geral: statusGeral || 'Pendente',
    status_assinatura_secretario: statusSecretario,
    status_assinatura_nota_fiscal: statusNotaFiscal,
    status_assinatura_formulario: statusFormulario,
    ultimo_pagamento: ultimoPagamento,
    ultimo_pagamento_status: ultimoPagamento?.status_pagamento || null,
    ultimo_pagamento_valor: ultimoPagamento?.valor_pago ?? null,
    ultimo_pagamento_data: ultimoPagamento?.data_pagamento ?? null,
    ultimo_comprovante_pdf: ultimoPagamento?.comprovante_pdf ?? null
  };
}

async function criarEmpenho(req, res) {
  try {
    const empenho = await Empenho.create(req.body);
    res.status(201).json(normalizeEmpenho(empenho, null));
  } catch (err) {
    console.error('Erro ao criar empenho:', err);
    res.status(400).json({ erro: err.message });
  }
}

async function listarEmpenhos(req, res) {
  try {
    const empenhos = await Empenho.findAll({ order: [['createdAt', 'DESC']] });
    const payload = empenhos.map((empenho) => normalizeEmpenho(empenho, null));
    res.json(payload);
  } catch (err) {
    console.error('Erro ao listar empenhos:', err);
    res.status(500).json({ erro: 'Erro ao buscar empenhos.' });
  }
}

async function obterEmpenhoPorId(req, res) {
  try {
    const { id } = req.params;
    const empenho = await Empenho.findByPk(id);

    if (!empenho) {
      return res.status(404).json({ erro: 'Empenho nao encontrado.' });
    }

    const ultimoPagamentoInst = await Pagamento.findOne({
      where: { empenho_id: id },
      order: [['createdAt', 'DESC']]
    });
    const ultimoPagamento = serializePagamento(ultimoPagamentoInst);

    return res.json(normalizeEmpenho(empenho, ultimoPagamento));
  } catch (err) {
    console.error('Erro ao buscar empenho por ID:', err);
    return res.status(500).json({ erro: 'Erro interno ao buscar empenho.' });
  }
}

async function confirmarPagamento(req, res) {
  try {
    const { id } = req.params;
    const empenho = await Empenho.findByPk(id);

    if (!empenho) {
      return res.status(404).json({ erro: 'Empenho nao encontrado.' });
    }

    if (!req.file) {
      return res.status(400).json({ erro: 'Comprovante (PDF) e obrigatorio.' });
    }

    const pagamentoExistente = await Pagamento.findOne({
      where: {
        empenho_id: id,
        status_pagamento: 'Confirmado'
      }
    });

    if (pagamentoExistente) {
      return res.status(400).json({
        erro: 'Este empenho ja possui um pagamento confirmado.'
      });
    }

    const valor_pago = req.body?.valor_pago ?? empenho.valor;
    const data_pagamento = req.body?.data_pagamento ?? new Date().toISOString().slice(0, 10);
    const comprovantePath = `/uploads/comprovantes/${req.file.filename}`;

    const pagamento = await Pagamento.create({
      empenho_id: empenho.id,
      valor_pago,
      data_pagamento,
      status_pagamento: 'Confirmado',
      comprovante_pdf: comprovantePath
    });

    const assinaturaStatus = req.body?.status_assinaturas || 'Assinado';

    await empenho.update({
      status_geral: 'Pago',
      status_assinatura_secretario: assinaturaStatus,
      status_assinatura_nota_fiscal: assinaturaStatus,
      status_assinatura_formulario: assinaturaStatus
    });

    await pagamento.reload();
    await empenho.reload();

    const pagamentoSerializado = serializePagamento(pagamento);
    const empenhoNormalizado = normalizeEmpenho(empenho, pagamentoSerializado);

    return res.status(201).json({
      mensagem: 'Pagamento confirmado.',
      pagamento: pagamentoSerializado,
      empenho: empenhoNormalizado
    });
  } catch (err) {
    console.error('Erro ao confirmar pagamento:', err);
    return res.status(500).json({ erro: 'Erro interno ao confirmar pagamento.' });
  }
}

module.exports = {
  criarEmpenho,
  listarEmpenhos,
  obterEmpenhoPorId,
  confirmarPagamento
};

