'use client'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { mockAplicacoesDiarias } from '@/lib/mock-data'; 

ChartJS.register( CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend );

export function RegistroAplicacoesChart() {
  const labels = mockAplicacoesDiarias.map(d => d.date);
  const dataValues = mockAplicacoesDiarias.map(d => d.count);
  const hojeCount = mockAplicacoesDiarias[mockAplicacoesDiarias.length - 1]?.count || 0; 

  const data = {
    labels,
    datasets: [{
      fill: true, // Para preencher a área
      label: 'Aplicações por Dia',
      data: dataValues,
      borderColor: 'rgb(53, 162, 235)', // Azul
      backgroundColor: 'rgba(53, 162, 235, 0.5)', // Azul com transparência
      tension: 0.3, // Curva suave
    }],
  };
  const options = { responsive: true, plugins: { legend: { display: false }, title: { display: false } } };

  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md">
      <h3 className="text-lg font-semibold text-text-base">Registro de Aplicações</h3>
       <div className="h-40"> 
         <Line options={options} data={data} />
       </div>
       <p className="mt-4 text-center text-text-muted">Hoje: <span className="font-bold text-xl text-text-base">{hojeCount}</span></p>
    </div>
  )
}
