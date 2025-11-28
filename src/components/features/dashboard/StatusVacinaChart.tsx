'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface VacinaSimples {
  id: number
  obrigatoriedade: boolean
}

interface StatusVacinaChartProps {
  vacinas: VacinaSimples[] 
}

export function StatusVacinaChart({ vacinas }: StatusVacinaChartProps) {
  // Calcular os dados reais
  const obrigatorias = vacinas.filter((v) => v.obrigatoriedade).length
  const naoObrigatorias = vacinas.length - obrigatorias

  const data = {
    labels: ['Obrigatórias', 'Opcionais'],
    datasets: [
      {
        label: 'Quantidade',
        data: [obrigatorias, naoObrigatorias],
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',   
          'rgba(156, 163, 175, 0.5)', 
        ],
        borderColor: [
            'rgba(255, 255, 255, 0.1)', 
            'rgba(255, 255, 255, 0.1)', 
        ],
        borderWidth: 0, 
        hoverOffset: 4
      },
    ],
  }

  // Opções do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
            color: '#9ca3af', 
            usePointStyle: true,
            padding: 20,
        }
      },
      title: {
        display: false,
      },
    },
  }

  if (vacinas.length === 0) {
      return <div className="text-center text-text-muted text-sm">Nenhuma vacina cadastrada.</div>
  }

  return (
    <div className="w-full h-full min-h-[220px] flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  )
}