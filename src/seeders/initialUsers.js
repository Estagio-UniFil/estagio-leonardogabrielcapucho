const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const criarUsuariosIniciais = async () => {
  try {
    console.log('Criando usuários iniciais...');

    const usuarioExistente = await Usuario.findOne();
    if (usuarioExistente) {
      console.log('Usuários já existem, pulando criação...');
      return;
    }

    const usuarios = [
      {
        nome: 'Administrador GACP',
        login: 'admin',
        email: 'admin@gacp.gov.br',
        senha_hash: await bcrypt.hash('admin123', 10),
        ativo: true
      },
      {
        nome: 'João Silva',
        login: 'joao.silva',
        email: 'joao.silva@gacp.gov.br',
        senha_hash: await bcrypt.hash('senha123', 10),
        ativo: true
      },
      {
        nome: 'Maria Santos',
        login: 'maria.santos',
        email: 'maria.santos@gacp.gov.br',
        senha_hash: await bcrypt.hash('senha123', 10),
        ativo: true
      },
      {
        nome: 'Pedro Oliveira',
        login: 'pedro.oliveira',
        email: 'pedro.oliveira@gacp.gov.br',
        senha_hash: await bcrypt.hash('senha123', 10),
        ativo: true
      },
      {
        nome: 'Ana Costa',
        login: 'ana.costa',
        email: 'ana.costa@gacp.gov.br',
        senha_hash: await bcrypt.hash('senha123', 10),
        ativo: true
      }
    ];

    await Usuario.bulkCreate(usuarios);

    console.log('Usuários criados com sucesso!');
    console.log('Credenciais de acesso:');
    console.log('Admin: login=admin, senha=admin123');
    console.log('Outros usuários: senha=senha123');
    
  } catch (error) {
    console.error('Erro ao criar usuários iniciais:', error);
  }
};

module.exports = { criarUsuariosIniciais };
