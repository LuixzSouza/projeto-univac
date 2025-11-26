'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

// Interface local para desacoplar do mock
interface VacinaSimples {
  id: number
  obrigatoriedade: boolean
}

interface StatusVacinaChartProps {
  vacinas: VacinaSimples[] 
}

export function StatusVacinaChart({ vacinas }: StatusVacinaChartProps) {
  // 1. Calcular os dados reais
  const obrigatorias = vacinas.filter((v) => v.obrigatoriedade).length
  const naoObrigatorias = vacinas.length - obrigatorias

  // 2. Definir a estrutura
  const data = {
    labels: ['Obrigatórias', 'Opcionais'],
    datasets: [
      {
        label: 'Quantidade',
        data: [obrigatorias, naoObrigatorias],
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',   // Amarelo (Yellow-500)
          'rgba(156, 163, 175, 0.5)', // Cinza (Gray-400)
        ],
        borderColor: [
            // Usamos a cor do fundo do card para criar o efeito de separação
            'rgba(255, 255, 255, 0.1)', 
            'rgba(255, 255, 255, 0.1)', 
        ],
        borderWidth: 0, 
        hoverOffset: 4
      },
    ],
  }

  // 3. Opções do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Importante para não estourar containers flex
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
            color: '#9ca3af', // Cor do texto da legenda (text-muted)
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