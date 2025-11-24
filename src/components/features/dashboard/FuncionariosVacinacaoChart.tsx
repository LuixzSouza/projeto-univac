// /src/components/features/dashboard/FuncionariosVacinacaoChart.tsx
'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { IFuncionario } from '@/lib/mock-data'
import { useEffect, useMemo, useState } from 'react'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ChartProps {
  funcionarios: IFuncionario[]
}

interface ChartColors {
  success: string
  primary: string
  danger: string
  border: string
  text: string
}

export function FuncionariosVacinacaoChart({ funcionarios }: ChartProps) {
  const [chartColors, setChartColors] = useState<ChartColors>({
    success: '#16a34a', // Default Verde
    primary: '#3b82f6', // Default Azul
    danger: '#ef4444', // Default Vermelho
    border: '#ffffff', // Default Borda
    text: '#6b7280', // Default Texto (cinza)
  })

  useEffect(() => {
    const style = getComputedStyle(document.documentElement)

    const getColor = (varName: string, fallback: string) =>
      style.getPropertyValue(varName).trim() || fallback

    setChartColors({
      success: getColor('--color-success', chartColors.success),
      primary: getColor('--color-primary', chartColors.primary),
      danger: getColor('--color-danger', chartColors.danger),
      border: getColor('--color-bg-surface', chartColors.border),
      text: getColor('--color-text-muted', chartColors.text),
    })
  }, []) 

  const chartData = useMemo(() => {
    const completo = funcionarios.filter(
      (f) => f.statusVacinacao === 'completo',
    ).length
    const parcial = funcionarios.filter(
      (f) => f.statusVacinacao === 'parcial',
    ).length
    const nenhum = funcionarios.filter(
      (f) => f.statusVacinacao === 'nenhum',
    ).length

    return {
      labels: ['Totalmente Vacinados', 'Parcialmente Vacinados', 'Não Vacinados'],
      datasets: [
        {
          data: [completo, parcial, nenhum],
          backgroundColor: [
            chartColors.success,
            chartColors.primary,
            chartColors.danger,
          ],
          borderColor: chartColors.border, 
          borderWidth: 2,
        },
      ],
    }
  }, [funcionarios, chartColors])

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            boxWidth: 12,
            padding: 15,
            color: chartColors.text, 
          },
        },
        tooltip: {
          bodyFont: { size: 14 },
        },
      },
    }),
    [chartColors.text],
  )

  if (funcionarios.length === 0) {
    return (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-lg bg-bg-surface p-6 text-center shadow-md">
        <h3 className="text-lg font-semibold text-text-muted">
          Nenhum dado de vacinação para exibir.
        </h3>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md">
      <h3 className="mb-4 text-lg font-semibold text-center text-text-base">
        Funcionários por Vacinação
      </h3>
      <Pie data={chartData} options={chartOptions} />
    </div>
  )
}