# SelectX Admin App

Dashboard administrativo para gerenciamento de propriedades imobiliárias, leads, cidades, bairros e usuários.

## 🚀 Tecnologias

- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Supabase** - Backend (PostgreSQL + Auth)
- **React Router** - Roteamento
- **Lucide React** - Ícones
- **CSS Modules** - Estilização

## 📋 Pré-requisitos

- Node.js 18+
- Yarn ou npm
- Conta no Supabase com projeto configurado

## ⚙️ Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
yarn install
```

3. Configure as variáveis de ambiente no arquivo `.env`:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
yarn dev
```

## 🔐 Autenticação

O sistema utiliza autenticação do Supabase. Você precisa ter um usuário criado no sistema de autenticação do Supabase para fazer login.

**Nota:** Não há página de registro. Os usuários devem ser criados diretamente no painel do Supabase ou via API.

## 📊 Funcionalidades

### Dashboard
- Visão geral com estatísticas do sistema
- Cards informativos com contadores

### Propriedades
- Listagem de todas as propriedades
- Criação, edição e exclusão
- Campos completos conforme schema do banco

### Leads
- Gerenciamento de leads de clientes
- Vinculação com propriedades
- Status de acompanhamento

### Cidades
- Cadastro de cidades
- Gerenciamento de estados (UF)

### Bairros
- Cadastro de bairros
- Vinculação com cidades

### Usuários (Profiles)
- Gerenciamento de perfis de usuários
- Controle de papéis (admin, agent, viewer)

## 🗄️ Schema do Banco de Dados

O projeto está integrado com o Supabase e utiliza o schema documentado em `docs/database.md`.

### Tabelas Principais:
- `properties` - Propriedades imobiliárias
- `leads` - Leads de clientes
- `cities` - Cidades
- `neighborhoods` - Bairros
- `profiles` - Perfis de usuários

## 🏗️ Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── Layout/       # Layout principal (Sidebar, Header)
│   └── UI/           # Componentes de UI (Button, Card, Table, etc)
├── contexts/         # Contextos React (Auth)
├── hooks/            # Custom hooks (useProperties, useCities, etc)
├── lib/              # Configurações (Supabase client)
├── pages/            # Páginas da aplicação
├── types/            # Tipos TypeScript
└── App.tsx           # Componente principal
```

## 🔧 Scripts Disponíveis

- `yarn dev` - Inicia servidor de desenvolvimento
- `yarn build` - Build para produção
- `yarn preview` - Preview do build de produção
- `yarn lint` - Executa o linter

## 📝 Notas Importantes

1. **Perfis de Usuários**: Para criar um novo perfil, é necessário ter o ID do usuário do sistema de autenticação do Supabase (auth.users).

2. **RLS (Row Level Security)**: A tabela `profiles` possui RLS habilitado. Certifique-se de configurar as políticas adequadas no Supabase.

3. **Variáveis de Ambiente**: As variáveis devem começar com `VITE_` para serem acessíveis no código do Vite.

## 🎨 Design

O dashboard possui um design moderno e clean com:
- Sidebar fixa com navegação
- Header com informações do usuário
- Cards e tabelas responsivas
- Modais para formulários
- Sistema de cores consistente

## 📄 Licença

Este projeto é privado.
