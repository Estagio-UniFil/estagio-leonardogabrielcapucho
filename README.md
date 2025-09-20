# Sistema GACP - Gestão de Anotações, Contratos e Pagamentos

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- PostgreSQL configurado
- Arquivo .env com as configurações do banco

### Instalação
`ash
npm install
`

### Configuração do Banco
1. Copie o arquivo env.example para .env
2. Configure as variáveis de ambiente:
   `
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=gacp_db
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   JWT_SECRET=sua_chave_secreta_jwt
   `

### Executar o Sistema
`ash
node src/index.js
`

O servidor estará disponível em: http://localhost:3000

## 🔐 Sistema de Login

### Usuários Padrão
O sistema vem com usuários pré-configurados:

| Login | Senha | Nome | Função |
|-------|-------|------|--------|
| dmin | dmin123 | Administrador GACP | Administrador do sistema |
| joao.silva | senha123 | João Silva | Usuário padrão |
| maria.santos | senha123 | Maria Santos | Usuário padrão |
| pedro.oliveira | senha123 | Pedro Oliveira | Usuário padrão |
| na.costa | senha123 | Ana Costa | Usuário padrão |

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

`
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
`

## 📡 API Endpoints

### Autenticação
- POST /api/auth/login - Login do usuário
- POST /api/auth/logout - Logout (requer token)
- GET /api/auth/verificar - Verificar token (requer token)

### Usuários
- GET /api/usuarios - Listar usuários
- POST /api/usuarios - Criar usuário
- PUT /api/usuarios/:id - Atualizar usuário
- DELETE /api/usuarios/:id - Deletar usuário

### Anotações
- GET /api/anotacoes - Listar anotações
- POST /api/anotacoes - Criar anotação
- PUT /api/anotacoes/:id - Atualizar anotação
- DELETE /api/anotacoes/:id - Deletar anotação

## 🛡️ Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT com expiração
- Middleware de autenticação para rotas protegidas
- Validação de entrada em todos os endpoints
- CORS configurado para desenvolvimento

## 🚨 Solução de Problemas

### Servidor não inicia
- Verifique se o PostgreSQL está rodando
- Confirme as configurações no arquivo .env
- Verifique se a porta 3000 está livre

### Login não funciona
- Confirme se o banco está sincronizado
- Verifique se os usuários foram criados
- Teste a API diretamente: curl -X POST http://localhost:3000/api/auth/login

### Página não carrega
- Verifique se o servidor está rodando
- Confirme se os arquivos estáticos estão na pasta public
- Verifique o console do navegador para erros JavaScript

## 📝 Desenvolvimento

### Adicionar Novos Usuários
`javascript
// No arquivo src/seeders/initialUsers.js
const novoUsuario = {
  nome: 'Nome do Usuário',
  login: 'login.usuario',
  email: 'usuario@gacp.gov.br',
  senha_hash: await bcrypt.hash('senha123', 10),
  ativo: true
};
`

### Modificar Estilos
- Edite os arquivos em public/css/
- Use variáveis CSS para cores corporativas
- Mantenha a responsividade

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Logs do servidor no terminal
2. Console do navegador (F12)
3. Status da API em /api/auth/verificar

---
### 📚 Documentação Acadêmica
O conteúdo abaixo foi mantido do repositório-base e organiza toda a documentação obrigatória do estágio. Atualize-o conforme evoluir o projeto.
---
# ­ƒôî Menu do Projeto

## ­ƒù║ Diagramas

- [­ƒö╣ Diagrama de Caso de Uso](docs/diagramas/Diagrama%20de%20Caso%20de%20Uso.md)
- [­ƒö╣ Diagrama de Classe](docs/diagramas/Diagrama%20de%20Classe.md)
- [­ƒö╣ Diagrama de Entidade-Relacionamento](docs/diagramas/Diagrama%20de%20Entidade-Relacionamento.md)
- [­ƒö╣ Diagrama de Estado](docs/diagramas/Diagrama%20de%20Estado.md)
- [­ƒö╣ Diagrama de Implanta├º├úo](docs/diagramas/Diagrama%20de%20implantacao.md)
- [­ƒö╣ Workflow AS-IS e TO-BE](docs/diagramas/Workflow%20AS-IS%20e%20TO-BE.md)

## ­ƒôä Artefatos

- [­ƒôä Especifica├º├úo Complementar](docs/artefatos/Especificacao%20Complementar.md)
- [­ƒôä Pedido do Investidor](docs/artefatos/Pedido%20do%20investidor.md)
- [­ƒôä Vis├úo do Projeto](docs/artefatos/Visao%20do%20Projeto.md)
- [­ƒôä Gloss├írio](docs/artefatos/glossario.md)
- [­ƒôä Plano de Est├ígio](docs/artefatos/Plano%20de%20estagio.md)


## ­ƒôÜ Artefatos de Casos de Uso

### Caso de Uso A

- [­ƒö╣ Diagrama de Sequ├¬ncia](docs/casos_de_uso/Caso-de-uso-A/Diagrama%20de%20Sequencia-a.md)
- [­ƒôä Especifica├º├úo Caso de Uso](docs/casos_de_uso/Caso-de-uso-A/Especificacao%20Caso%20de%20Uso-a.md)

### Caso de Uso Y

- [­ƒö╣ Diagrama de Sequ├¬ncia](docs/casos_de_uso/Caso-de-uso-Y/Diagrama%20de%20Sequencia-b.md)
- [­ƒôä Especifica├º├úo Caso de Uso](docs/casos_de_uso/Caso-de-uso-Y/Especificacao%20Caso%20de%20Uso-b.md)


# Atualiza├º├úo Importante a partir de 27/02/2025: Migra├º├úo de Documentos e Novo Workflow

## Documentos Migrados da Wiki para o Reposit├│rio Principal

Todos os documentos que anteriormente estavam na Wiki foram migrados para o reposit├│rio principal, dentro da pasta `/docs` e o menu enconta-se no README. Essa mudan├ºa foi necess├íria porque a Wiki agora n├úo ├® mantida automaticamente ao gerar uma TAG, o que pode causar inconsist├¬ncias nas vers├Áes dos documentos.

## Novo Workflow de Convers├úo para PDF

Implementamos um workflow do GitHub Actions que converte automaticamente os arquivos Markdown em PDF com alta qualidade. 

Voc├¬ pode encontrar o arquivo de workflow em `.github/workflows/convert-md-to-pdf.yml`.

## Instru├º├Áes para Entrega das Atividades

Para as atividades de documenta├º├úo no Google Classroom, siga estas orienta├º├Áes:

- **Entrega em PDF:** Fa├ºa o upload do arquivo PDF gerado com a documenta├º├úo.  
- **N├úo envie links do Google Classroom:** A entrega deve ser exclusivamente o arquivo PDF.
- **Sem necessidade de TAGs:** N├úo ├® preciso criar TAGs para as entregas; basta entregar o documento diretamente.
- **Refer├¬ncia ao Reposit├│rio:** Sempre anexe tamb├®m o link do reposit├│rio GitHub para facilitar a verifica├º├úo e acompanhamento.

## Migra├º├úo da Vers├úo Antiga para a Nova

Para migrar da vers├úo antiga para a nova estrutura, siga os passos abaixo:

1. **Clone o Diret├│rio `/docs`:** Fa├ºa o clone da pasta `/docs` do reposit├│rio principal para garantir que voc├¬ tenha todos os documentos atualizados. Al├®m disso, copie o MENU deste README.
2. **Atualize ou Remova a Wiki:** Se preferir, remova a Wiki antiga. Caso decida mant├¬-la, lembre-se que ela precisar├í ser atualizada manualmente sempre que houver altera├º├Áes.
3. **Adicione o Workflow:** Certifique-se de que o workflow de convers├úo para PDF (localizado em `.github/workflows/convert-md-to-pdf.yml`) est├í presente no reposit├│rio.
4. **Entrega no Classroom:** Para cada atividade, gere o PDF com os documentos atualizados, fa├ºa o upload no Google Classroom e anexe o link do GitHub para refer├¬ncia.

Agradecemos a colabora├º├úo de todos durante essa transi├º├úo para garantir que os documentos estejam sempre atualizados e que o processo de entrega seja o mais eficiente poss├¡vel.



# ­ƒÜÇ Est├ígio Supervisionado UniFil - Guia ├ügil para Alunos
Este reposit├│rio ├® um template no GitHub para que voc├¬ possa criar seu pr├│prio reposit├│rio de est├ígio supervisionado a partir dele. Para us├í-lo:

- Clique no bot├úo "Use this template" para gerar uma c├│pia personalizada.
- Renomeie e ajuste a estrutura conforme as necessidades do seu projeto.
- Atualize os documentos de acordo com as entregas do seu est├ígio.


As regras aqui s├úo apenas diretrizes e n├úo substituem as orienta├º├Áes do seu orientador e coordenador de est├ígio.

**Bem-vindo ao seu Est├ígio Supervisionado!**  
Aqui, voc├¬ desenvolver├í um projeto real usando metodologias ├ígeis, dividido em **4 unidades curriculares sequenciais**. Para simplicar, chamaremos a unidades curriculares de "unidades". Cada unidade ├® uma **"Jornada ├ügil"** com sprints flex├¡veis, mas entregas obrigat├│rias. Seu orientador atuar├í como *Agile Master* (PO + Scrum Master), e **todo progresso deve ser registrado no GitHub e validado via Google Classroom**. ­ƒøá´©Å  

---

## ÔÜá´©Å Regras Cruciais (N├úo Pule Essa Parte!)
1. **Unidades 1 e 3**: Avaliadas **diretamente pelo orientador** (nota final).  
2. **Unidades 2 e 4**: Avaliadas por **banca examinadora**. Para apresentar, voc├¬ precisar├í de um **atestado de aptid├úo do orientador**.  
3. **Documenta├º├úo progressiva**: At├® a Unidade 2, voc├¬ deve ter **toda a documenta├º├úo b├ísica pronta**, exceto diagramas de novos casos de uso desenvolvidos posteriormente.  

---

## ­ƒôî Vis├úo Geral do Est├ígio
| Unidade | Avalia├º├úo | Pr├®-Requisitos para Banca | Artefatos-Chave |
|---------|-----------|----------------------------|------------------|
| 1´©ÅÔâú **An├ílise** | Nota do Orientador | - | CRUD, Documento de Vis├úo, Workflow As-Is/To-Be e etc... |
| 2´©ÅÔâú **Projeto** | Banca | Atestado do Orientador + 1 Caso de Uso Funcional + **Todos os Diagramas** | Especifica├º├úo de Caso de Uso, Diagramas de Sequ├¬ncia e etc... |
| 3´©ÅÔâú **Implementa├º├úo I** | Nota do Orientador | - | 50-80% dos Casos de Uso |
| 4´©ÅÔâú **Implementa├º├úo II** | Banca Final | Atestado do Orientador + Sistema 100% Funcional | Relat├│rio Final, todos os artefatos e todos os diagramas  |


---

## ­ƒº® Processo de Avalia├º├úo por Unidade

O est├ígio ├® dividido em **4 unidades**, cada uma com objetivos e entregas espec├¡ficas. Para garantir o sucesso, voc├¬ deve se organizar em **sprints** (ciclos de trabalho) e planejar um **cronograma detalhado**. Lembre-se: **flexibilidade ├® permitida, mas comunica├º├úo ├® obrigat├│ria**. Qualquer mudan├ºa no planejamento deve ser **comunicada imediatamente ao orientador**, que atuar├í como seu guia e avaliador.

### Como Funciona o Planejamento?
1. **Defina suas Sprints**:  
   Cada sprint deve ter um objetivo claro (ex: desenvolver um CRUD, documentar um caso de uso).  
   - Sugest├úo: Sprints de **1 ou 2 semanas** s├úo ideais para manter o foco e a produtividade.  
   - Use ferramentas como o **GitHub Projects (RECOMENDADO)** ou um quadro Kanban f├¡sico para visualizar as tarefas.  

2. **Crie um Cronograma**:  
   - Estime o tempo necess├írio para cada tarefa.  
   - Reserve um tempo para **revis├Áes e ajustes** (imprevistos acontecem!).  
   - Compartilhe o cronograma com seu orientador no in├¡cio de cada unidade.  

3. **Comunique Mudan├ºas**:  
   - Se algo sair do planejado (ex: atrasos, dificuldades t├®cnicas), **informe seu orientador imediatamente**.  
   - Juntos, voc├¬s podem ajustar o cronograma e priorizar tarefas.  


### ­ƒÄ» Unidade 1: An├ílise (EST230168)
- **Avalia├º├úo**: Nota do orientador.  
- **Entregas**:
  - Cronograma.
  - CRUD funcional.
  - Plano de est├ígio.
  - Documenta├º├úo b├ísica: Vis├úo, Pedido do Investidor, Workflow As-Is/To-Be.  

---

### ­ƒÄ» Unidade 2: Projeto (EST230169) ÔåÆ **Banca!**  
- **Pr├®-requisitos para Banca**:  
  - Atestado do orientador confirmando:  
    - Pelo menos 1 Caso de Uso **100% funcional**. ÔÜá´©Å ATEN├ç├âO ├ë prefer├¡vel n├úo se limitar a um caso de uso para otimiza├º├úo de tempo.  
    - **Todos os diagramas** (Sequ├¬ncia, Estados, Classe) do caso de uso apresentado.  
  - Documenta├º├úo completa (exceto novos casos de uso desenvolvidos depois).
  - Material para apresenta├º├úo da banca.
  - Voc├¬ deve conseguir um atestado de qualifica├º├úo com seu orientador para realizar a banca.
- **O que a Banca Avalia**:  
  - Qualidade do c├│digo.  
  - Clareza dos diagramas.
  - Apresenta├º├úo.
  - Caso de uso funcionando.
  - Organiza├º├úo da documenta├º├úo.  

---

### ­ƒÄ» Unidade 3: Implementa├º├úo I (EST230170)  
- **Avalia├º├úo**: Nota do orientador.  
- **Entregas**:  
  - 50-80% dos casos de uso implementados.  
  - **Novos diagramas** apenas para funcionalidades implementadas nesta unidade (ex: novo caso de uso ÔåÆ novo diagrama de sequ├¬ncia e especifica├º├úo de caso de uso).  

---

### ­ƒÄ» Unidade 4: Implementa├º├úo II (EST230171) ÔåÆ **Banca Final!**  
- **Pr├®-requisitos**:  
  - Atestado do orientador confirmando o sistema **100% funcional**.
  - Relat├│rio final.
  - Todos os diagramas atualizados (incluindo novos casos de uso).
  - Material para apresenta├º├úo da banca.
- **O que a Banca Avalia**:  
  - Funcionalidade total do sistema.
  - Apresenta├º├úo
  - Qualidade do relat├│rio final.  
  - Diagrama de implanta├º├úo.  

---



## ­ƒôä Documenta├º├úo Progressiva (Atualize os docs!)

| Documento/Artefato               | Descri├º├úo |
|----------------------------------|-----------|
| **Documento de Vis├úo**           | Descreve o prop├│sito, objetivos, escopo e stakeholders do projeto. |
| **Documento do Pedido do Investidor** | Detalha as necessidades do cliente e os requisitos do projeto. |
| **Gloss├írio**                    | Lista de termos t├®cnicos e conceitos usados no projeto. |
| **Especifica├º├úo de Caso de Uso** | Descreve os fluxos principais e alternativos de cada funcionalidade. |
| **Diagramas de Sequ├¬ncia**       | Mostra a intera├º├úo entre os componentes do sistema para cada caso de uso. |
| **Diagramas de Estados**         | Representa os estados e transi├º├Áes de um objeto (se aplic├ível). |
| **Diagrama de Classes**          | Representa a estrutura do sistema, com classes, atributos e m├®todos. |
| **DER L├│gico**                   | Modelo do banco de dados, com tabelas, chaves e relacionamentos. |
| **Telas**       | Prot├│tipos das interfaces do sistema e refinamentos. |
| **Workflow As-Is e To-Be**       | Descreve o processo atual (As-Is) e o processo desejado (To-Be). |
| **Diagrama de Implanta├º├úo**      | Mostra a infraestrutura necess├íria para o deploy do sistema. |

### ÔØù Importante: A pasta de documenta├º├úo ├® a Fonte Oficial
- **Toda documenta├º├úo deve ser mantida na pasta Docs do GitHub**. Outras fontes (Google Drive, documentos locais, etc.) **n├úo ser├úo consideradas**.  
- **Atualize os Docs continuamente**: Sempre que um documento ou artefato for criado ou modificado, ele deve ser imediatamente atualizado na pasta Docs.  
- **Organize o *Sidebar***: Use o arquivo `_sidebar.md` para criar um menu de navega├º├úo claro. Exemplo:  
  ```markdown
  - [Documento de Vis├úo](/Visao)
  - [Casos de Uso](/CasosDeUso)
  - [Diagramas](/Diagramas)
  ```  

­ƒîƒ **Dica**: A Docs ├® seu di├írio de bordo. Mantenha-a organizada e atualizada para garantir que todas as entregas sejam validadas corretamente! ­ƒÜÇ  




## ÔÜá´©Å Avisos Importantes

1. **Docs ├® a ├Ünica Fonte V├ílida**:  
   - Toda documenta├º├úo **deve estar na Docs do GitHub**. Links externos, arquivos locais ou outras plataformas *n├úo ser├úo aceitos*.  
   - Mantenha o *sidebar* organizado e atualizado. Se n├úo estiver vis├¡vel, seu trabalho pode ser considerado incompleto.  
  

2. **Papel do Orientador**:  
   - Ele ├® seu **Agile Master** (PO + Scrum Master).  
   - Voc├¬ *n├úo pode* apresentar nas bancas (Unidades 2 e 4) sem um **atestado de aptid├úo** assinado por ele.
   - Faltar a orienta├º├Áes (25%) gera reprova├º├úo.

3. **Comunica├º├úo ├® Chave**:  
   - Mudan├ºas no cronograma? Bloqueios t├®cnicos? **Avise seu orientador imediatamente**.  
   - Falta de comunica├º├úo recorrente = **reprova├º├úo**.  

4. **Documenta├º├úo Progressiva**:  
   - At├® a Unidade 2, todos os documentos b├ísicos (Vis├úo, Workflow, Gloss├írio) *devem estar completos*.  
   - Diagramas de novos casos de uso s├úo adicionados apenas nas unidades em que forem desenvolvidos.  

5. **Reposit├│rio Privado**:  
   - Se n├úo adicionar seu orientador como *maintainer*, seu projeto *n├úo ser├í avaliado*.  

---

## ÔØô FAQ (Perguntas Frequentes)


### Q1: E se eu precisar alterar o escopo do projeto?  
**R**: N├úo h├í problemas, desde que comunique seu orientador e cumpra as entregas.   

### Q2: Como sei se estou apto para a banca (Unidades 2 e 4)?  
**R**: Seu orientador emitir├í um **atestado de aptid├úo** ap├│s validar:  
- Unidade 2: Pelo menos 1 caso de uso funcional + diagramas e artefatos.  
- Unidade 4: Sistema 100% funcional + relat├│rio final + diagramas e artefatos completos.

### Q3: E se eu tiver algum problema ou d├║vidas?  
**R**: Converse com seu orientador, pois ele ├® aquele que te avaliar├í durante todo o processo e poder├í te orientar.

### Q4: E se eu trocar de projeto ao avan├ºar uma unidade curricular?  
**R**: Se voc├¬ mudar de projeto entre uma unidade e outra, ser├í necess├írio refazer todas as entregas das unidades anteriores, pois cada unidade ├® sequencial e depende do trabalho desenvolvido nas etapas pr├®vias. Isso inclui documenta├º├úo, diagramas e qualquer outro artefato j├í entregue. 

### Q5: Como fazer est├ígio no NPI? 
**R**: Marque uma reuni├úo com o Coordenador do NPI no e-mail joao.andrade@unifil.br








---

­ƒîƒ **Dica Final**:  
Seu reposit├│rio ├® seu portf├│lio. Mantenha-o organizado, e voc├¬ sair├í n├úo s├│ aprovado, mas **preparado para o mercado**! ­ƒÜÇ  

---

