# 💉 UniVac - Sistema de Gestão de Vacinação Corporativa

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/Neon_DB-Serverless-00E599?style=for-the-badge&logo=postgresql)

> **Projeto Acadêmico Integrador (Sistemas de Informação & Enfermagem)** > Uma solução SaaS moderna para otimizar o controle imunológico, agendamentos e conformidade de saúde ocupacional.

---

## 📸 Visão Geral

O **UniVac** substitui planilhas manuais e inseguras por um sistema centralizado, auditável e visualmente rico. O foco é agilizar o trabalho da equipe de enfermagem e oferecer dados em tempo real para a gestão de RH.

### ✨ Diferenciais & UX (Experiência do Usuário)
* **Landing Page Imersiva:** Design moderno com efeitos de vidro (Glassmorphism), elementos 3D e copy focado em valor.
* **Loading Cinemático:** Tela de inicialização simulando verificação de sistema com feedback visual de progresso.
* **Dashboard Executivo:** KPIs em tempo real, gráficos de tendência e alertas de conformidade.
* **Carteirinha Digital:** Geração automática de documento oficial de vacinação pronto para impressão/PDF.

---

## 🚀 Funcionalidades Principais

### 🔐 Acesso & Segurança
* **Autenticação Robusta:** Sistema de login via `NextAuth v5` com credenciais criptografadas.
* **Controle de Acesso (RBAC):** Diferenciação entre perfis `ADMIN` (Gestão Total) e `FUNCIONÁRIO`.
* **Proteção de Dados:** Rotas de API protegidas e validação de sessão via Middleware.

### 🏥 Gestão de Saúde (Core)
* **Catálogo de Vacinas:** Cadastro de imunizantes, definindo obrigatoriedade para cálculo de compliance.
* **Gestão de Colaboradores:** CRUD completo com validação de CPF e bloqueio de exclusão para integridade histórica.
* **Agenda Interativa:** Calendário visual (`react-big-calendar`) para marcar doses.
* **Fluxo de Check-in:** Transforma um agendamento em uma aplicação confirmada com um clique, gerando histórico automaticamente.

### 📊 Análise & Relatórios
* **Indicadores de Conformidade:** Cálculo automático de quem está em dia, pendente ou atrasado.
* **Gráficos Dinâmicos:** Visualização por tipo de vacina (Rosca) e evolução de aplicações (Linha).
* **Exportação de Dados:** Geração de relatórios em CSV para auditoria externa.

---

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando as melhores práticas de desenvolvimento web moderno (2024/2025):

* **Frontend:**
    * [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
    * [Tailwind CSS](https://tailwindcss.com/) (Estilização Utility-First)
    * [Framer Motion](https://www.framer.com/motion/) (Animações complexas e transições)
    * [Lucide React](https://lucide.dev/) (Ícones vetoriais)
    * [Sonner](https://sonner.emilkowalski.com/) (Notificações Toast elegantes)

* **Backend & Dados:**
    * **API:** Next.js API Routes (Serverless Functions)
    * **Database:** PostgreSQL hospedado na nuvem ([Neon DB](https://neon.tech/))
    * **ORM:** [Prisma](https://www.prisma.io/) (Tipagem forte e migrações)

---

## ⚙️ Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente.

### Pré-requisitos
* Node.js 18+
* Conta no Neon DB (ou um Postgres local)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/projeto-univac.git](https://github.com/seu-usuario/projeto-univac.git)
    cd projeto-univac
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz e preencha:
    ```env
    # Conexão com o Banco (Neon DB)
    DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

    # Chave para criptografia de sessão (gere uma aleatória)
    NEXTAUTH_SECRET="sua-chave-super-secreta"
    NEXTAUTH_URL="http://localhost:3000"
    ```

4.  **Configure o Banco de Dados:**
    ```bash
    # Gera o cliente Prisma
    npx prisma generate

    # Cria as tabelas no banco
    npx prisma migrate dev --name init

    # (Opcional) Popula com dados iniciais (Admin)
    npm run seed
    ```

5.  **Rode o projeto:**
    ```bash
    npm run dev
    ```
    Acesse [http://localhost:3000](http://localhost:3000).

---

## 🖼️ Galeria do Sistema

*(Adicione aqui prints reais do seu sistema para valorizar o portfólio)*

| Landing Page | Dashboard |
| :---: | :---: |
| ![Landing Page](/public/prints/landing.png) | ![Dashboard](/public/prints/dashboard.png) |

| Agenda | Carteirinha Digital |
| :---: | :---: |
| ![Agenda](/public/prints/agenda.png) | ![Carteirinha](/public/prints/carteirinha.png) |

---

## 🤝 Contribuição

Este é um projeto acadêmico open-source. Sugestões e Pull Requests são bem-vindos!

---

Desenvolvido com 💚 por **Luiz Antônio de Souza**, Renan Carlos, William, Isa