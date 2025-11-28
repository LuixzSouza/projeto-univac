'use client'

import { format, startOfMonth, getDay, addDays, isToday, getDate } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function MiniCalendar() {
  const hoje = new Date();
  const inicioMes = startOfMonth(hoje);
  const diaSemanaInicio = getDay(inicioMes); 

  //  42 (6 semanas) para garantir que meses longos que começam no sábado não sejam cortados
  const dias = Array.from({ length: 42 }).map((_, index) => {
    const offset = index - diaSemanaInicio;
    const diaAtual = addDays(inicioMes, offset);
    return {
      dateObj: diaAtual, 
      numero: getDate(diaAtual),
      isHoje: isToday(diaAtual),
      isOutroMes: diaAtual.getMonth() !== hoje.getMonth(),
    };
  });

  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="mt-2 p-3 text-center text-xs bg-bg-base rounded-lg border border-border">
      <div className="mb-3 font-bold text-text-base capitalize">
        {format(hoje, 'MMMM yyyy', { locale: ptBR })}
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {diasSemana.map((dia, index) => (
          <div key={`${dia}-${index}`} className="font-semibold text-text-muted opacity-70">{dia}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dias.map((dia, index) => (
          <div
            key={dia.dateObj.toISOString()} 
            className={`
              flex h-7 w-7 items-center justify-center rounded-full text-[10px] sm:text-xs transition-colors
              ${dia.isHoje 
                  ? 'bg-primary text-white font-bold shadow-sm' 
                  : 'hover:bg-bg-surface'
              }
              ${dia.isOutroMes ? 'text-text-muted opacity-30' : 'text-text-base'}
            `}
          >
            {dia.numero}
          </div>
        ))}
      </div>
    </div>
  );
}