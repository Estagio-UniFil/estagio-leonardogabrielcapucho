const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empenho = sequelize.define('Empenho', {
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  data_vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status_assinatura_secretario: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pendente'
  },
  status_assinatura_nota_fiscal: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pendente'
  },
  status_assinatura_formulario: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pendente'
  },
  secretario_nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  secretario_setor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status_geral: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pendente'
  },
  nota_fiscal_numero: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nota_fiscal_valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  nota_fiscal_data: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'empenhos',
  timestamps: true,
  freezeTableName: true
});

module.exports = Empenho;
