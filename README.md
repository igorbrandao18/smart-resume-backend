# Smart Resume Backend

API RESTful desenvolvida com NestJS + TypeScript para gerenciamento de perfis profissionais, com funcionalidades avançadas de validação de dados e integração com serviços externos.

Desenvolvido por Igor Brandão.

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js progressivo
- **TypeScript** - Adiciona tipagem estática ao JavaScript
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Swagger** - Documentação da API
- **Jest + Vitest** - Framework de testes
- **Class Validator** - Validação de dados
- **Node Mailer** - Envio de emails

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js (versão 16 ou superior)
- pnpm (gerenciador de pacotes)
- PostgreSQL

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=smart_resume

# Email
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=seu_usuario
MAIL_PASS=sua_senha
```

### Instalação

1. Clone o repositório:
```sh
git clone https://github.com/igorbrandao18/smart-resume-backend.git
cd smart-resume-backend
```

2. Instale as dependências:
```sh
pnpm install
```

3. Inicie o servidor de desenvolvimento:
```sh
pnpm start:dev
```

O servidor estará disponível em `http://localhost:3000`

## 📦 Build para Produção

Para criar uma build otimizada para produção:

```sh
pnpm build
pnpm start:prod
```

## 🧪 Testes

### Testes Unitários
```sh
pnpm test
```

### Testes E2E
```sh
pnpm test:e2e
```

### Cobertura de Testes
```sh
pnpm test:cov
```

## 📚 Documentação da API

A documentação completa da API está disponível em:
- Swagger UI: `http://localhost:3000/api`
- JSON: `http://localhost:3000/api-json`

## 🌟 Funcionalidades

- **Gestão de Usuários**
  - Cadastro com validação de email
  - Autenticação segura
  - Atualização de perfil
  - Recuperação de senha

- **Validações Externas**
  - Consulta e validação de CNPJ via API pública
  - Busca de endereço por CEP (ViaCEP)
  - Validação de email com código de verificação

- **Segurança**
  - Validação de dados com class-validator
  - Sanitização de inputs
  - Rate limiting
  - Proteção contra ataques comuns

## 🔄 Integrações

- **ViaCEP**
  - Busca automática de endereço
  - Validação de CEP

- **CNPJ.ws**
  - Consulta de dados empresariais
  - Validação de CNPJ

- **Serviço de Email**
  - Envio de códigos de verificação
  - Templates personalizados
  - Fila de processamento

## 🏗️ Arquitetura

- **Modular**
  - Separação clara de responsabilidades
  - Módulos independentes
  - Injeção de dependências

- **RESTful**
  - Endpoints bem definidos
  - Respostas padronizadas
  - Status HTTP apropriados

## 👥 Autor

- **Igor Brandão** - *Desenvolvimento Full Stack* - [@igorbrandao18](https://github.com/igorbrandao18)

## 📞 Suporte

Para suporte, abra uma issue no repositório: https://github.com/igorbrandao18/smart-resume-backend
