'use client'

import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend );

interface RegistroAplicacoesChartProps {
  aplicacoes: { dataAplicacao: string | Date }[]
}

export function RegistroAplicacoesChart({ aplicacoes }: RegistroAplicacoesChartProps) {
  
  // Processamento dos dados reais
  const { labels, dataValues, hojeCount } = useMemo(() => {
    // 1. Agrupar contagem por dia (formato dd/MM)
    const agrupado: Record<string, number> = {};
    const hojeStr = format(new Date(), 'dd/MM', { locale: ptBR });

    aplicacoes.forEach(app => {
        const dataObj = new Date(app.dataAplicacao);
        const dataFormatada = format(dataObj, 'dd/MM', { locale: ptBR });
        agrupado[dataFormatada] = (agrupado[dataFormatada] || 0) + 1;
    });

    // 2. Ordenar as datas (se necessário, aqui assumimos ordem de chegada ou podemos ordenar keys)
    // Para simplificar, vamos pegar as últimas 7 chaves se houver muitas
    const keys = Object.keys(agrupado).reverse().slice(0, 7).reverse(); // Pega os últimos 7 dias registrados
    
    const values = keys.map(k => agrupado[k]);
    const countHoje = agrupado[hojeStr] || 0;

    return { labels: keys, dataValues: values, hojeCount: countHoje };
  }, [aplicacoes]);

  const data = {
    labels,
    datasets: [{
      fill: true, 
      label: 'Aplicações',
      data: dataValues,
      // Ajustado para o Verde do seu tema (Primary)
      borderColor: '#10b981', 
      backgroundColor: 'rgba(16, 185, 129, 0.2)', 
      tension: 0.4, // Curva um pouco mais suave
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
    }],
  };

  const options = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: { 
        legend: { display: false }, 
        title: { display: false } 
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { precision: 0 } // Garante números inteiros no eixo Y
        }
    }
  };

  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold text-text-base mb-4">Registro de Aplicações (Últimos dias)</h3>
       
       {labels.length > 0 ? (
           <div className="flex-grow min-h-[200px]"> 
             <Line options={options} data={data} />
           </div>
       ) : (
           <div className="flex-grow flex items-center justify-center text-text-muted text-sm">
               Sem dados suficientes para o gráfico.
           </div>
       )}

       <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-sm text-text-muted">Total Hoje</span>
            <span className="font-bold text-2xl text-primary">{hojeCount}</span>
       </div>
    </div>
  )
}