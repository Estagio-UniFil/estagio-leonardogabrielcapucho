# Sistema GACP - Gestão de Anotações, Contratos e Pagamentos

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- PostgreSQL configurado
- Arquivo `.env` com as configurações do banco

### Instalação
```bash
npm install
```

### Configuração do Banco
1. Copie o arquivo `env.example` para `.env`
2. Configure as variáveis de ambiente:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=gacp_db
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   JWT_SECRET=sua_chave_secreta_jwt
   ```

### Executar o Sistema
```bash
node src/index.js
```

O servidor estará disponível em: http://localhost:3000

## 🔐 Sistema de Login

### Usuários Padrão
O sistema vem com usuários pré-configurados:

| Login | Senha | Nome | Função |
|-------|-------|------|--------|
| `admin` | `admin123` | Administrador GACP | Administrador do sistema |
| `joao.silva` | `senha123` | João Silva | Usuário padrão |
| `maria.santos` | `senha123` | Maria Santos | Usuário padrão |
| `pedro.oliveira` | `senha123` | Pedro Oliveira | Usuário padrão |
| `ana.costa` | `senha123` | Ana Costa | Usuário padrão |

### Funcionalidades do Login
- ✅ Validação de formulário em tempo real
- ✅ Autenticação JWT segura
- ✅ Redirecionamento automático se já logado
- ✅ Tratamento de erros amigável
- ✅ Design responsivo e moderno
- ✅ Animações suaves

## 🎨 Interface

### Tela de Login
- Design baseado na identidade visual GACP
- Logo personalizado com ícone de computador
- Campos para usuário e senha
- Botão de login com estados de loading
- Mensagens de erro contextuais
- Credenciais de demonstração visíveis

### Características Visuais
- Frame escuro com bordas arredondadas
- Gradientes modernos
- Tipografia Inter para melhor legibilidade
- Cores corporativas GACP (#004AAD)
- Animações CSS suaves
- Totalmente responsivo

## 🔧 Estrutura do Projeto

```
src/
├── config/          # Configurações do banco
├── controllers/     # Controladores da aplicação
├── middleware/      # Middlewares (autenticação)
├── models/          # Modelos do Sequelize
├── routes/          # Rotas da API
├── seeders/         # Dados iniciais
└── index.js         # Servidor principal

public/
├── css/            # Estilos CSS
├── html/           # Páginas HTML
└── js/             # JavaScript do frontend
```

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/logout` - Logout (requer token)
- `GET /api/auth/verificar` - Verificar token (requer token)

### Usuários
- `GET /api/usuarios` - Listar usuários
- `POST /api/usuarios` - Criar usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Deletar usuário

### Anotações
- `GET /api/anotacoes` - Listar anotações
- `POST /api/anotacoes` - Criar anotação
- `PUT /api/anotacoes/:id` - Atualizar anotação
- `DELETE /api/anotacoes/:id` - Deletar anotação

## 🛡️ Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT com expiração
- Middleware de autenticação para rotas protegidas
- Validação de entrada em todos os endpoints
- CORS configurado para desenvolvimento

## 🚨 Solução de Problemas

### Servidor não inicia
- Verifique se o PostgreSQL está rodando
- Confirme as configurações no arquivo `.env`
- Verifique se a porta 3000 está livre

### Login não funciona
- Confirme se o banco está sincronizado
- Verifique se os usuários foram criados
- Teste a API diretamente: `curl -X POST http://localhost:3000/api/auth/login`

### Página não carrega
- Verifique se o servidor está rodando
- Confirme se os arquivos estáticos estão na pasta `public`
- Verifique o console do navegador para erros JavaScript

## 📝 Desenvolvimento

### Adicionar Novos Usuários
```javascript
// No arquivo src/seeders/initialUsers.js
const novoUsuario = {
  nome: 'Nome do Usuário',
  login: 'login.usuario',
  email: 'usuario@gacp.gov.br',
  senha_hash: await bcrypt.hash('senha123', 10),
  ativo: true
};
```

### Modificar Estilos
- Edite os arquivos em `public/css/`
- Use variáveis CSS para cores corporativas
- Mantenha a responsividade

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Logs do servidor no terminal
2. Console do navegador (F12)
3. Status da API em `/api/auth/verificar`

---

**Sistema GACP** - Desenvolvido para gestão eficiente de contratos e pagamentos
