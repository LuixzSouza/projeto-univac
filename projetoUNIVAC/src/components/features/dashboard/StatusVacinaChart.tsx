'use client'

// Importações necessárias do Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { IVacina } from '@/lib/mock-data'

ChartJS.register(ArcElement, Tooltip, Legend)

interface StatusVacinaChartProps {
  vacinas: IVacina[] 
}

export function StatusVacinaChart({ vacinas }: StatusVacinaChartProps) {
  // 1. Calcular os dados
  const obrigatorias = vacinas.filter((v) => v.obrigatoriedade).length
  const naoObrigatorias = vacinas.length - obrigatorias

  // 2. Definir a estrutura de dados que o gráfico espera
  const data = {
    labels: ['Obrigatórias', 'Não Obrigatórias'],
    datasets: [
      {
        label: 'Status das Vacinas',
        data: [obrigatorias, naoObrigatorias],
        backgroundColor: [
          'rgba(234, 179, 8, 0.7)', // Amarelo (semântico, para obrigatórias)
          'rgba(107, 114, 128, 0.7)', // Cinzento (semântico, para não obrigatórias)
        ],
        borderColor: [
          'var(--bg-surface)', 
          'var(--bg-surface)', 
        ],
        borderWidth: 2, 
      },
    ],
  }

  // 3. Opções do gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
        }
      },
      title: {
        display: true,
        text: 'Distribuição de Vacinas',
      },
    },
  }

  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md text-text-base">
      <Doughnut data={data} options={options} />
    </div>
  )
}