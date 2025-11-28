'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { useEffect, useMemo, useState } from 'react'

ChartJS.register(ArcElement, Tooltip, Legend)

interface VacinaSimples {
  id: number
  obrigatoriedade: boolean
}

interface FuncionarioComApps {
  id: number
  status: boolean
  aplicacoes: { vacinaId: number }[]
}

interface ChartProps {
  funcionarios: FuncionarioComApps[]
  vacinas?: VacinaSimples[] 
}

interface ChartColors {
  success: string
  primary: string
  danger: string
  border: string
  text: string
}

export function FuncionariosVacinacaoChart({ funcionarios, vacinas = [] }: ChartProps) {
  const [chartColors, setChartColors] = useState<ChartColors>({
    success: '#16a34a', 
    primary: '#3b82f6', 
    danger: '#ef4444', 
    border: '#ffffff', 
    text: '#6b7280', 
  })

  // Sincroniza cores com o CSS do Tema (Dark/Light)
  useEffect(() => {
    const style = getComputedStyle(document.documentElement)
    const getColor = (varName: string, fallback: string) => style.getPropertyValue(varName).trim() || fallback

    setChartColors({
      success: '#10b981', 
      primary: '#f59e0b', 
      danger: '#ef4444',  
      border: getColor('--bg-surface', '#ffffff'),
      text: getColor('--text-muted', '#6b7280'),
    })
  }, []) 

  const chartData = useMemo(() => {
    const vacinasObrigatorias = vacinas.filter(v => v.obrigatoriedade);
    const idsObrigatorios = vacinasObrigatorias.map(v => v.id);

    let completo = 0;
    let parcial = 0;
    let nenhum = 0;

    funcionarios.forEach(func => {
        const apps = func.aplicacoes || [];
        const tomadasIds = apps.map(a => a.vacinaId);

        if (apps.length === 0) {
            nenhum++;
        } else {
            // Verifica se tomou TODAS as obrigatórias
            const tomouTodasObrigatorias = idsObrigatorios.every(id => tomadasIds.includes(id));
            
            // Se não tiver vacinas obrigatórias cadastradas no sistema, qualquer dose conta como completo ou regra específica
            if (idsObrigatorios.length > 0 && tomouTodasObrigatorias) {
                completo++;
            } else {
                parcial++;
            }
        }
    });

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
  }, [funcionarios, vacinas, chartColors])

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
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
      <div className="flex h-full min-h-[220px] w-full items-center justify-center text-center">
        <h3 className="text-sm font-medium text-text-muted">
          Aguardando dados...
        </h3>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[220px] flex items-center justify-center">
      <Pie data={chartData} options={chartOptions} />
    </div>
  )
}