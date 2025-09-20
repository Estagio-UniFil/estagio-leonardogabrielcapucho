const sequelize = require('./src/config/database');
const Usuario = require('./src/models/Usuario');
const Anotacao = require('./src/models/Anotacao');

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com banco...');
    await sequelize.authenticate();
    console.log('✅ Banco conectado com sucesso!');

    console.log('\n🔍 Verificando estrutura das tabelas...');
    
    // Verificar se as tabelas existem
    const tables = await sequelize.showAllSchemas();
    console.log('📋 Tabelas encontradas:', tables.map(t => t.name));

    console.log('\n🔍 Verificando modelo Usuario...');
    const usuarioCount = await Usuario.count();
    console.log(`👥 Usuários no banco: ${usuarioCount}`);

    if (usuarioCount > 0) {
      const usuarios = await Usuario.findAll({
        attributes: ['id', 'nome', 'login', 'email']
      });
      console.log('📝 Usuários:', usuarios.map(u => ({ id: u.id, nome: u.nome, login: u.login })));
    }

    console.log('\n🔍 Verificando modelo Anotacao...');
    const anotacaoCount = await Anotacao.count();
    console.log(`📝 Anotações no banco: ${anotacaoCount}`);

    console.log('\n🔍 Testando relacionamento...');
    
    // Testar se conseguimos fazer uma consulta com include
    try {
      const anotacoes = await Anotacao.findAll({
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nome', 'login']
        }],
        limit: 5
      });
      console.log('✅ Relacionamento funcionando!');
      console.log('📊 Anotações com usuários:', anotacoes.length);
    } catch (relError) {
      console.error('❌ Erro no relacionamento:', relError.message);
      
      // Verificar se os relacionamentos estão definidos
      console.log('\n🔍 Verificando definição dos relacionamentos...');
      console.log('Usuario.associations:', Object.keys(Usuario.associations));
      console.log('Anotacao.associations:', Object.keys(Anotacao.associations));
    }

    console.log('\n🔍 Verificando estrutura da tabela anotacoes...');
    try {
      const result = await sequelize.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'anotacoes' ORDER BY ordinal_position;");
      console.log('📋 Colunas da tabela anotacoes:');
      result[0].forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    } catch (queryError) {
      console.error('❌ Erro ao consultar estrutura:', queryError.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  } finally {
    await sequelize.close();
    console.log('\n🔒 Conexão fechada.');
  }
}

testDatabase();
