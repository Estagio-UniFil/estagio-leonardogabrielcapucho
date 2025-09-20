const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  login: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  },
  senha_hash: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  underscored: true,
  timestamps: true
});

module.exports = Usuario;
