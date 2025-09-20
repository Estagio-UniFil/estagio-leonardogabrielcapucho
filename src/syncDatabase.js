const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');
const Anotacao = require('./models/Anotacao');
const NoteVersion = require('./models/NoteVersion');
const Empenho = require('./models/Empenho');
const Pagamento = require('./models/Pagamento');
const { criarUsuariosIniciais } = require('./seeders/initialUsers');

async function sincronizarBanco() {
  try {
    console.log('🔄 Iniciando sincronização do banco...');
    
    console.log('🔄 Sincronizando tabelas...');
    await sequelize.sync({ force: true });
    console.log('✅ Tabelas sincronizadas!');
    
    console.log('👥 Criando usuários iniciais...');
    await criarUsuariosIniciais();
    
    console.log('🎉 Sincronização concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
  } finally {
    await sequelize.close();
  }
}

sincronizarBanco();
