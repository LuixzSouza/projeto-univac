// Este é um componente visual SIMPLES, não interativo
'use client'
import { format, startOfMonth, getDay, addDays, isToday, getDate } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function MiniCalendar() {
  const hoje = new Date();
  const inicioMes = startOfMonth(hoje);
  const diaSemanaInicio = getDay(inicioMes); 

  const dias = Array.from({ length: 35 }).map((_, index) => {
    const offset = index - diaSemanaInicio;
    const diaAtual = addDays(inicioMes, offset);
    return {
      numero: getDate(diaAtual),
      isHoje: isToday(diaAtual),
      isOutroMes: diaAtual.getMonth() !== hoje.getMonth(),
    };
  });

  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="mt-4 p-2 text-center text-xs">
      <div className="mb-2 font-medium text-text-base">
        {format(hoje, 'MMMM yyyy', { locale: ptBR })}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {diasSemana.map((dia, index) => (
          <div key={`${dia}-${index}`} className="font-semibold text-text-muted">{dia}</div>
        ))}
        {dias.map((dia, index) => (
          <div
            key={index}
            className={`
              flex h-6 w-6 items-center justify-center rounded-full
              ${dia.isHoje ? 'bg-primary text-white font-bold' : ''}
              ${dia.isOutroMes ? 'text-text-muted opacity-50' : 'text-text-base'}
            `}
          >
            {dia.numero}
          </div>
        ))}
      </div>
    </div>
  );
}
