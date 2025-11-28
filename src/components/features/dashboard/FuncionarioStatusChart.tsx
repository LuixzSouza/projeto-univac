'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface FuncionarioSimples {
  status: boolean
}

interface FuncionarioStatusChartProps {
  funcionarios: FuncionarioSimples[]
}

export function FuncionarioStatusChart({ funcionarios }: FuncionarioStatusChartProps) {
  const ativos = funcionarios.filter((f) => f.status).length
  const inativos = funcionarios.length - ativos

  const data = {
    labels: ['Ativos', 'Inativos'],
    datasets: [
      {
        label: 'Quantidade',
        data: [ativos, inativos],
        backgroundColor: [
          '#10b981', 
          '#ef4444',     
        ],
        borderColor: [
          'rgba(255,255,255,0.1)', 
          'rgba(255,255,255,0.1)', 
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
            color: '#9ca3af',
            padding: 20
        }
      },
      title: {
        display: false,
      },
    },
  }

  if (funcionarios.length === 0) return <div className="text-center text-sm text-text-muted">Sem dados.</div>;

  return (
    <div className="w-full h-full min-h-[220px] flex items-center justify-center">
      <Pie data={data} options={options} />
    </div>
  )
}