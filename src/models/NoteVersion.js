const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NoteVersion = sequelize.define('NoteVersion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  note_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'anotacoes',
      key: 'id'
    }
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  edited_by: {
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

  reason: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Motivo da edição'
  }
}, {
  tableName: 'note_versions',
  underscored: true,
  timestamps: true
});

module.exports = NoteVersion;


