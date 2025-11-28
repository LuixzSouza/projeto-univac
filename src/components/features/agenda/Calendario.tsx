'use client'

import React from 'react' 
import { Calendar, dateFnsLocalizer, Event as BigCalendarEvent, Components, View, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'pt-BR': ptBR,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
  getDay,
  locales,
})

const messages = {
  allDay: 'Dia Inteiro',
  previous: 'Anterior', 
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Lista', 
  date: 'Data',
  time: 'Hora',
  event: 'Agendamento',
  noEventsInRange: 'Não há agendamentos neste período.',
  showMore: (total: number) => `+ ${total} mais`,
}

interface CalendarioProps {
  eventos: BigCalendarEvent[]
  onSelectEvento: (evento: any) => void
  onSelectSlot: (slotInfo: { start: Date, end: Date }) => void 
  view: View 
  onView: (view: View) => void
  date: Date 
  onNavigate: (newDate: Date) => void 
}

const EventoEstilizado = ({ event }: { event: BigCalendarEvent }) => {
  return (
    <div
        className="text-xs p-1 rounded overflow-hidden whitespace-nowrap text-ellipsis font-medium"
        title={typeof event.title === 'string' ? event.title : undefined}
    >
      <span>{event.title}</span>
    </div>
  )
}

const components: Components<BigCalendarEvent, object> = {
  event: EventoEstilizado,
}

const eventPropGetter = (event: BigCalendarEvent) => {
  const style = {
    backgroundColor: '#10b981', 
    borderColor: '#059669', 
    color: '#ffffff',                  
    borderRadius: '6px',
    borderWidth: '0px',
    opacity: 1,
    display: 'block',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)', 
    padding: '2px 4px'
  };
    return { className: 'rbc-custom-event', style: style }
}

const dayPropGetter = (date: Date): React.HTMLAttributes<HTMLDivElement> => {
    return isSameDay(date, new Date()) ? { className: 'rbc-today-custom' } : {};
}

export function Calendario({
  eventos,
  onSelectEvento,
  onSelectSlot,
  view,
  onView,
  date,
  onNavigate
}: CalendarioProps) {

  const handleSelectSlot = (slotInfo: { start: Date, end: Date, action: 'select' | 'click' | 'doubleClick', slots?: Date[] | string[] }) => {
    if (slotInfo.action === 'click' || slotInfo.action === 'select') {
      const end = slotInfo.end < slotInfo.start ? slotInfo.start : slotInfo.end;
      onSelectSlot({ start: slotInfo.start, end: end });
    }
  }

  return (
    <div className="h-[75vh] rounded-xl bg-bg-surface p-6 shadow-xl border border-border text-text-base relative overflow-hidden">
      
      <style jsx global>{`
        /* RESET GERAL E TEXTOS */
        .rbc-calendar { font-family: inherit; color: inherit; }
        
        /* BOTÕES DA TOOLBAR (HOJE, MÊS, ETC) */
        .rbc-toolbar { margin-bottom: 20px; gap: 10px; flex-wrap: wrap; }
        .rbc-toolbar-label { font-size: 1.5rem; font-weight: 700; color: inherit; text-transform: capitalize; }
        
        .rbc-btn-group button {
            color: inherit;
            border: 1px solid #374151; /* gray-700 */
            background-color: transparent;
            padding: 8px 16px;
            font-size: 0.875rem;
            transition: all 0.2s;
            box-shadow: none;
        }
        .rbc-btn-group button:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
        .rbc-btn-group button:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
        
        .rbc-btn-group button:hover {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }
        
        /* Botão ATIVO  */
        .rbc-btn-group button.rbc-active, 
        .rbc-btn-group button.rbc-active:hover, 
        .rbc-btn-group button.rbc-active:focus {
            background-color: #10b981 !important; /* Primary */
            color: white !important;
            border-color: #10b981 !important;
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
            font-weight: 600;
        }

        .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border-color: #374151; }
        .rbc-header { 
            border-bottom: 1px solid #374151; 
            padding: 12px 0; 
            font-size: 0.85rem; 
            text-transform: uppercase; 
            letter-spacing: 0.05em;
            color: #9ca3af; 
        }
        
        .rbc-day-bg { border-left: 1px solid #374151; }
        .rbc-month-row { border-top: 1px solid #374151; }
        
        .rbc-off-range-bg { 
            background-color: rgba(0, 0, 0, 0.2) !important; /* Escurece em vez de clarear */
        }
        
        /* TEXTOS DOS DIAS */
        .rbc-date-cell { padding: 8px; font-weight: 500; font-size: 0.9rem; }
        .rbc-button-link { color: inherit; }
        .rbc-off-range .rbc-button-link { color: #4b5563; } /* gray-600 para dias fora */

        /* ESTILO DO DIA "HOJE" */
        .rbc-today-custom {
            background-color: rgba(16, 185, 129, 0.1) !important;
        }
        .rbc-today { background-color: transparent; } 

        /* LISTA  */
        .rbc-agenda-view table.rbc-agenda-table { border: none; }
        .rbc-agenda-view table.rbc-agenda-table tbody > tr > td { 
            border-color: #374151; 
            padding: 12px;
        }
        .rbc-agenda-view table.rbc-agenda-table .rbc-agenda-time-cell { text-transform: uppercase; font-size: 0.8rem; color: #9ca3af; }

        .rbc-time-header-content { border-left: 1px solid #374151; }
        .rbc-timeslot-group { border-bottom: 1px solid #374151; }
        .rbc-time-content { border-top: 1px solid #374151; }
        .rbc-day-slot .rbc-time-slot { border-top: 1px solid #374151; opacity: 0.5; }

      `}</style>
      
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        culture="pt-BR"
        messages={messages}

        selectable
        onSelectEvent={onSelectEvento}
        onSelectSlot={handleSelectSlot}

        view={view}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]} 
        onView={onView}
        date={date}
        onNavigate={onNavigate}

        components={components}       
        eventPropGetter={eventPropGetter} 
        dayPropGetter={dayPropGetter}   
        style={{ height: '100%' }}

        step={30}
        timeslots={2} 
        popup
        formats={{
           agendaTimeFormat: (d, c, l) => l?.format(d, 'HH:mm', c) || '',
           agendaTimeRangeFormat: ({ start, end }, c, l) => `${l?.format(start, 'HH:mm', c)} – ${l?.format(end, 'HH:mm', c)}`
         }}
      />
    </div>
  )
}