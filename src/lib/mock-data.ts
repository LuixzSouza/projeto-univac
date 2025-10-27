// /src/lib/mock-data.ts

// --- DADOS DOS FUNCIONÁRIOS ---

export interface IFuncionario {
  id: number
  nome: string
  email: string
  role: 'ADMIN' | 'FUNCIONARIO'
  status: boolean
  numeroRegistro: number
  cpf: string
  statusVacinacao?: 'completo' | 'parcial' | 'nenhum' 
}

export const mockFuncionarios: IFuncionario[] = [
  {
    id: 1,
    nome: 'Luiz Antônio Souza',
    email: 'luiz.antonio@teste.com',
    role: 'ADMIN',
    status: true,
    numeroRegistro: 12345,
    cpf: '111.222.333-44',
    statusVacinacao: 'completo',
  },
  {
    id: 2,
    nome: 'Renan Carlos Moreira',
    email: 'renan.carlos@teste.com',
    role: 'FUNCIONARIO',
    status: true,
    numeroRegistro: 54321,
    cpf: '222.333.444-55',
    statusVacinacao: 'parcial',
  },
  {
    id: 3,
    nome: 'Itallo',
    email: 'itallo@teste.com',
    role: 'FUNCIONARIO',
    status: false, // Inativo
    numeroRegistro: 98765,
    cpf: '333.444.555-66',
    statusVacinacao: 'nenhum',
  },
  {
    id: 4,
    nome: 'Isabela Silva',
    email: 'isabela.silva@teste.com',
    role: 'FUNCIONARIO',
    status: true,
    numeroRegistro: 11111,
    cpf: '444.555.666-77',
    statusVacinacao: 'completo',
  },
  {
    id: 5,
    nome: 'William Santos',
    email: 'william.santos@teste.com',
    role: 'FUNCIONARIO',
    status: true,
    numeroRegistro: 22222,
    cpf: '555.666.777-88',
    statusVacinacao: 'parcial',
  },
]

// --- DADOS DAS VACINAS ---

export interface IVacina {
  id: number
  nome: string
  descricao: string
  obrigatoriedade: boolean
  totalAplicacoes?: number 
}

export const mockVacinas: IVacina[] = [
  {
    id: 1,
    nome: 'COVID-19 (Reforço)',
    descricao: 'Dose de reforço bivalente.',
    obrigatoriedade: true,
    totalAplicacoes: 150, 
  },
  {
    id: 2,
    nome: 'Gripe (Influenza)',
    descricao: 'Campanha anual de vacinação contra a gripe.',
    obrigatoriedade: false,
    totalAplicacoes: 280, 
  },
  {
    id: 3,
    nome: 'Hepatite B',
    descricao: 'Dose padrão para prevenção de Hepatite B.',
    obrigatoriedade: true,
    totalAplicacoes: 95, 
  },
  {
    id: 4,
    nome: 'Tétano',
    descricao: 'Reforço a cada 10 anos.',
    obrigatoriedade: true,
    totalAplicacoes: 50, 
  },
   {
    id: 5,
    nome: 'HPV',
    descricao: 'Prevenção contra o Papilomavírus Humano.',
    obrigatoriedade: false,
    totalAplicacoes: 30, 
  },
]

// --- DADOS DOS AGENDAMENTOS ---

export interface IAgendamento {
  id: number
  title: string
  start: Date
  end: Date
  funcionarioId: number
  vacinaId: number
}

const hoje = new Date()
const amanha = new Date()
amanha.setDate(hoje.getDate() + 1)
const ontem = new Date()
ontem.setDate(hoje.getDate() -1)

export const mockAgendamentos: IAgendamento[] = [
  {
    id: 1,
    title: 'Renan Carlos - Gripe',
    start: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 10, 0, 0),
    end: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 10, 30, 0),
    funcionarioId: 2,
    vacinaId: 2,
  },
  {
    id: 2,
    title: 'Itallo - COVID-19',
    start: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 0, 0),
    end: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 14, 30, 0),
    funcionarioId: 3,
    vacinaId: 1,
  },
  {
    id: 3,
    title: 'Luiz Antônio - Hepatite B',
    start: new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 9, 0, 0),
    end: new Date(amanha.getFullYear(), amanha.getMonth(), amanha.getDate(), 9, 30, 0),
    funcionarioId: 1,
    vacinaId: 3,
  },
   {
    id: 4,
    title: 'Isabela Silva - Tétano',
    start: new Date(ontem.getFullYear(), ontem.getMonth(), ontem.getDate(), 16, 0, 0),
    end: new Date(ontem.getFullYear(), ontem.getMonth(), ontem.getDate(), 16, 30, 0),
    funcionarioId: 4,
    vacinaId: 4,
  },
]

// --- DADOS PARA GRÁFICOS DO DASHBOARD ---

export const mockAplicacoesDiarias = [
  { date: '18/10', count: 2 }, { date: '19/10', count: 4 }, { date: '20/10', count: 3 },
  { date: '21/10', count: 5 }, { date: '22/10', count: 4 }, { date: '23/10', count: 6 },
  { date: '24/10', count: 3 },
];

// --- DADOS DAS APLICAÇÕES (HISTÓRICO) ---

export interface IAplicacao {
  id: number;
  tipoVacina: string;
  dataAplicacao: Date;
  responsavel: string;
  lote: string;
  funcionarioNome: string;
}

export const mockAplicacoes: IAplicacao[] = [
  {
    id: 101,
    tipoVacina: 'Gripe (Influenza)',
    dataAplicacao: new Date(2025, 9, 15), // Mês 9 = Outubro
    responsavel: 'Enf. Ana',
    lote: 'GR1234',
    funcionarioNome: 'Renan Carlos Moreira',
  },
  {
    id: 102,
    tipoVacina: 'COVID-19 (Reforço)',
    dataAplicacao: new Date(2025, 8, 20), // Mês 8 = Setembro
    responsavel: 'Dr. Silva',
    lote: 'CV5678',
    funcionarioNome: 'Itallo',
  },
   {
    id: 103,
    tipoVacina: 'Hepatite B',
    dataAplicacao: new Date(2025, 7, 10), // Mês 7 = Agosto
    responsavel: 'Enf. Ana',
    lote: 'HB9101',
    funcionarioNome: 'Luiz Antônio Souza',
  },
   {
    id: 104,
    tipoVacina: 'Gripe (Influenza)',
    dataAplicacao: new Date(2025, 9, 15), // Mês 9 = Outubro
    responsavel: 'Enf. Ana',
    lote: 'GR1234',
    funcionarioNome: 'Isabela Silva',
  },
];