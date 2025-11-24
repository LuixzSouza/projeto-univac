# 🚀 Sistema UniVac - Gerenciamento de Vacinação

Sistema web completo para gerenciar a vacinação de funcionários, desenvolvido com Next.js, TypeScript, Tailwind CSS, Prisma e PostgreSQL (Neon DB). Permite o cadastro e controle de funcionários, tipos de vacinas, registro de aplicações, visualização de agenda e um painel de controlo com estatísticas relevantes.

## ✨ Funcionalidades Principais

* **Autenticação de Usuários:** Login seguro com email e senha (NextAuth.js).
* **Gerenciamento de Funcionários:** CRUD completo para funcionários (com paginação e filtro).
* **Gerenciamento de Tipos de Vacina:** CRUD completo para os tipos de vacina (com paginação e filtro).
* **Registro de Aplicação:** Formulário para registrar a aplicação de uma vacina num funcionário.
* **Agenda Visual:** Calendário interativo (`react-big-calendar`) para visualizar e criar/editar agendamentos.
* **Histórico de Aplicações:** Tabela paginada e filtrável com os registos de vacinas aplicadas.
* **Dashboard:** Painel de controlo com visão geral:
    * Gráfico de Status das Vacinas (Obrigatória vs. Opcional).
    * Gráfico de Funcionários por Status de Vacinação (Completo, Parcial, Nenhum).
    * Tabela de Funcionários com Vacinas Obrigatórias Pendentes.
    * Visualização dos Próximos Agendamentos e Mini Calendário.
    * Ações Rápidas.
    * Feed de Atividade Recente.
* **Gestão de Perfil:** Edição de nome e senha do utilizador logado.
* **Interface Moderna:** Design responsivo com Tailwind CSS v4, animações suaves (`framer-motion`) e modo Claro/Escuro (`next-themes`).

## 🛠️ Tecnologias Utilizadas

* **Framework:** Next.js 14 (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS 4
* **Banco de Dados:** PostgreSQL (Serverless via [Neon DB](https://neon.tech/))
* **ORM:** Prisma
* **Autenticação:** NextAuth.js v5 (Beta)
* **UI & Visualização:**
    * React Big Calendar (Agenda)
    * Chart.js & react-chartjs-2 (Gráficos)
    * Framer Motion (Animações)
    * Lucide Icons (Ícones)
    * Headless UI (Switch)
* **Gerenciador de Pacotes:** npm (ou Yarn)
* **Ambiente:** Node.js

## ⚙️ Configuração do Ambiente Local

Siga estes passos para configurar e rodar o projeto na sua máquina.

### Pré-requisitos

* **Node.js:** Versão 18.x ou superior. (Verifique com `node -v`)
* **npm** (ou Yarn): Geralmente vem com o Node.js. (Verifique com `npm -v`)
* **Git:** Para clonar o repositório.
* **Conta Neon DB:** Crie uma conta gratuita em [Neon](https://neon.tech/) para hospedar o banco de dados PostgreSQL.

### Passos de Instalação

1.  **Clone o Repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO_GIT]
    cd projeto-univac
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    # ou
    # yarn install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um ficheiro chamado `.env` na raiz do projeto (no mesmo nível que `package.json`).
    * Copie o conteúdo abaixo para o ficheiro `.env` e **substitua os valores**:

        ```dotenv
        # /projeto-univac/.env

        # 1. Cole a sua URL de Conexão (Connection String) do Neon DB aqui
        #    Formato: postgresql://<user>:<password>@<host>.cloud.neon.tech/<database>?sslmode=require
        DATABASE_URL="SUA_CONNECTION_STRING_DO_NEON_DB"

        # 2. Chave secreta para o NextAuth (pode gerar uma com `openssl rand -base64 32` no terminal)
        NEXTAUTH_SECRET="UMA_CHAVE_SECRETA_MUITO_FORTE_E_ALEATORIA"

        # 3. URL base da sua aplicação em desenvolvimento
        NEXTAUTH_URL="http://localhost:3000"
        ```

### Configuração do Banco de Dados (Prisma + Neon)

O Prisma é a ferramenta que liga o nosso código ao banco de dados Neon.

1.  **Verifique a Conexão:** Garanta que a `DATABASE_URL` no seu ficheiro `.env` está correta (copiada do seu projeto Neon).

2.  **Aplique as Migrações:** Este comando vai ler o ficheiro `prisma/schema.prisma` e criar/atualizar as tabelas no seu banco de dados Neon.
    ```bash
    npx prisma migrate dev
    ```
    * *Nota:* Se for a primeira vez, ele pode pedir um nome para a migração (ex: "initial-setup").

3.  **Gere o Cliente Prisma:** Garante que o código do Prisma está atualizado.
    ```bash
    npx prisma generate
    ```

4.  **(Opcional, mas Recomendado) Popule o Banco com Dados Iniciais:** Este comando executa o script `prisma/seed.js` para criar o utilizador **Admin** inicial.
    ```bash
    npm run seed
    ```
    * **Credenciais do Admin:**
        * Email: `admin@vacina.com`
        * Senha: `admin123`

## ▶️ Rodando a Aplicação

1.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    # ou
    # yarn dev
    ```

2.  **Acesse a Aplicação:** Abra o seu navegador e vá para [http://localhost:3000](http://localhost:3000).

3.  **Faça Login:** Use as credenciais do utilizador Admin criadas pelo `seed` (ou outras que você criar).

## 📜 Scripts Disponíveis

* `npm run dev`: Inicia o servidor em modo de desenvolvimento.
* `npm run build`: Compila a aplicação para produção.
* `npm run start`: Inicia o servidor em modo de produção (após `build`).
* `npm run lint`: Executa o linter (ESLint) para verificar a qualidade do código.
* `npm run seed`: Popula o banco de dados com dados iniciais (ex: utilizador Admin).
* `npx prisma migrate dev`: Aplica migrações do banco de dados.
* `npx prisma generate`: Gera o cliente Prisma.
* `npx prisma studio`: Abre uma interface visual para interagir com o banco de dados.

---

Bom desenvolvimento! 🚀