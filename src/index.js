console.log('>>> INÍCIO DO INDEX <<<');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');
const Anotacao = require('./models/Anotacao');
const NoteVersion = require('./models/NoteVersion');
const Empenho = require('./models/Empenho');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const empenhoRoutes = require('./routes/empenhoRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const anotacaoRoutes = require('./routes/anotacaoRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// CORS para desenvolvimento
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/empenhos', empenhoRoutes);
app.use('/api/pagamentos', pagamentoRoutes);
app.use('/api/anotacoes', anotacaoRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'login.html'));
});

// Rotas para páginas HTML específicas
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'home.html'));
});

app.get('/adicionar-empenho', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'adicionar-empenho.html'));
});

app.get('/ver-empenhos', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'ver-empenhos.html'));
});

app.get('/anotacoes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'anotacoes.html'));
});

app.get('/adicionar-pagamento', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'adicionar-pagamento.html'));
});

app.get('/ver-pagamentos', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'ver-pagamentos.html'));
});

app.get('/detalhes-empenho', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'detalhes-empenho.html'));
});

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'perfil.html'));
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco PostgreSQL com sucesso!');
    
    // Definir relacionamentos ANTES de sincronizar
    console.log('🔗 Definindo relacionamentos...');
    
    // Usuario -> Anotacao (1:N)
    Usuario.hasMany(Anotacao, { 
      foreignKey: 'created_by', 
      as: 'anotacoes',
      onDelete: 'CASCADE'
    });
    
    Anotacao.belongsTo(Usuario, { 
      foreignKey: 'created_by', 
      as: 'usuario',
      onDelete: 'CASCADE'
    });

    // Anotacao -> NoteVersion (1:N)
    Anotacao.hasMany(NoteVersion, {
      foreignKey: 'note_id',
      as: 'versoes',
      onDelete: 'CASCADE'
    });

    NoteVersion.belongsTo(Anotacao, {
      foreignKey: 'note_id',
      as: 'anotacao'
    });

    // Usuario -> NoteVersion (1:N) - quem editou
    Usuario.hasMany(NoteVersion, {
      foreignKey: 'edited_by',
      as: 'edicoes_realizadas',
      onDelete: 'CASCADE'
    });

    NoteVersion.belongsTo(Usuario, {
      foreignKey: 'edited_by',
      as: 'editor'
    });

    Empenho.hasMany(NoteVersion, {
      foreignKey: 'empenho_id',
      as: 'versoes_registradas',
      onDelete: 'SET NULL'
    });

    NoteVersion.belongsTo(Empenho, {
      foreignKey: 'empenho_id',
      as: 'empenho'
    });

    Empenho.hasMany(Anotacao, {
      foreignKey: 'empenho_id',
      as: 'anotacoes_vinculadas',
      onDelete: 'SET NULL'
    });

    Anotacao.belongsTo(Empenho, {
      foreignKey: 'empenho_id',
      as: 'empenho'
    });
    
    console.log('✅ Relacionamentos definidos!');
    
    // Sincronizar tabelas (alter: true para não perder dados)
    await sequelize.sync({ alter: true });
    console.log('✅ Tabelas sincronizadas com sucesso!');
    
  } catch (err) {
    console.error('❌ Erro ao conectar ou sincronizar banco:', err);
  }

  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log('📝 Sistema GACP - Autenticação por usuários ativada');
});






