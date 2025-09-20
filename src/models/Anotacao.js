const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Anotacao = sequelize.define('Anotacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  empenho_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'empenhos',
      key: 'id'
    }
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'anotacoes',
  underscored: true,
  timestamps: true,
  paranoid: false
});

module.exports = Anotacao;
