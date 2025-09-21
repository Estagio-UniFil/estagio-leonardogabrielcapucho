# 📌 Sistema GACP - Gestão de Anotações, Contratos e Pagamentos

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
1. Copie o arquivo `.env.example` para `.env`
2. Configure as variáveis de ambiente:
   ```env
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

📍 O servidor estará disponível em: [http://localhost:3000](http://localhost:3000)

---

## 🔐 Sistema de Login

### Usuários Padrão

| Login          | Senha     | Nome                | Função                  |
|----------------|-----------|---------------------|-------------------------|
| admin          | admin123  | Administrador GACP  | Administrador do sistema |
| joao.silva     | senha123  | João Silva          | Usuário padrão          |
| maria.santos   | senha123  | Maria Santos        | Usuário padrão          |
| pedro.oliveira | senha123  | Pedro Oliveira      | Usuário padrão          |
| ana.costa      | senha123  | Ana Costa           | Usuário padrão          |

✅ Funcionalidades:
- Validação de formulário em tempo real  
- Autenticação JWT segura  
- Redirecionamento automático se já logado  
- Tratamento de erros amigável  
- Design responsivo e moderno  
- Animações suaves  

---

## 🎨 Interface

- Tela de login baseada na identidade visual GACP  
- Logo personalizado  
- Campos para usuário e senha  
- Botão de login com estados de loading  
- Mensagens de erro contextuais  
- Layout responsivo com cores corporativas **#004AAD**  

---

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
├── css/             # Estilos CSS
├── html/            # Páginas HTML
└── js/              # JavaScript do frontend
```

---

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/login` → Login do usuário  
- `POST /api/auth/logout` → Logout (requer token)  
- `GET /api/auth/verificar` → Verificar token (requer token)  

### Usuários
- `GET /api/usuarios` → Listar usuários  
- `POST /api/usuarios` → Criar usuário  
- `PUT /api/usuarios/:id` → Atualizar usuário  
- `DELETE /api/usuarios/:id` → Deletar usuário  

### Anotações
- `GET /api/anotacoes` → Listar anotações  
- `POST /api/anotacoes` → Criar anotação  
- `PUT /api/anotacoes/:id` → Atualizar anotação  
- `DELETE /api/anotacoes/:id` → Deletar anotação  

---

## 🛡️ Segurança
- Senhas criptografadas com **bcrypt**  
- Autenticação JWT com expiração  
- Middleware de autenticação para rotas protegidas  
- Validação de entrada em todos os endpoints  
- CORS configurado para desenvolvimento  
