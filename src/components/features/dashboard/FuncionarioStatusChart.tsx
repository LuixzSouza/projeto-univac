'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { IFuncionario } from '@/lib/mock-data'

ChartJS.register(ArcElement, Tooltip, Legend)

interface FuncionarioStatusChartProps {
  funcionarios: IFuncionario[]
}

export function FuncionarioStatusChart({ funcionarios }: FuncionarioStatusChartProps) {
  const ativos = funcionarios.filter((f) => f.status).length
  const inativos = funcionarios.length - ativos

  const data = {
    labels: ['Ativos', 'Inativos'],
    datasets: [
      {
        label: 'Status dos Funcionários',
        data: [ativos, inativos],
        backgroundColor: [
          'var(--primary)',
          '#ef4444',      
        ],
        borderColor: [
          'var(--bg-surface)', 
          'var(--bg-surface)', 
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Funcionários por Status',
        font: {
          size: 16, 
        },
      },
    },
  }

  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md">
      <Pie data={data} options={options} />
    </div>
  )
}