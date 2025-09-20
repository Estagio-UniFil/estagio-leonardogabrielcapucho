const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Empenho = require('./Empenho');

const Pagamento = sequelize.define('Pagamento', {
  valor_pago: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  data_pagamento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status_pagamento: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pendente'
  },
  
  comprovante_pdf: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Pagamento.belongsTo(Empenho, { foreignKey: 'empenho_id' });
Empenho.hasMany(Pagamento, { foreignKey: 'empenho_id' });

module.exports = Pagamento;