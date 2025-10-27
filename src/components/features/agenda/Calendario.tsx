'use client'

import React from 'react' 
import { Calendar, dateFnsLocalizer, Event as BigCalendarEvent, Components, View, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { IAgendamento } from '@/lib/mock-data'

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
  previous: '◄', 
  next: '►',
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
  eventos: (IAgendamento & BigCalendarEvent)[]
  onSelectEvento: (evento: IAgendamento) => void
  onSelectSlot: (slotInfo: { start: Date, end: Date }) => void 
  view: View 
  onView: (view: View) => void
  date: Date 
  onNavigate: (newDate: Date) => void 
}

const EventoEstilizado = ({ event }: { event: BigCalendarEvent }) => {
  return (
    <div
        className="text-xs p-1 rounded overflow-hidden whitespace-nowrap text-ellipsis"
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
    backgroundColor: 'var(--primary)',     
    borderColor: 'var(--primary-dark)', 
    color: '#ffffff',                  
    borderRadius: '4px',
    borderWidth: '1px',
    opacity: 1,
    display: 'block',
    cursor: 'pointer',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
  };
    return { className: 'rbc-custom-event', style: style }
}

const dayPropGetter = (date: Date): React.HTMLAttributes<HTMLDivElement> => {
    return isSameDay(date, new Date()) ? { className: 'rbc-today' } : {};
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

  const handleSelectEvent = (evento: BigCalendarEvent) => {
    const agendamentoEncontrado = eventos.find(e => e.id === (evento as IAgendamento).id);
    if (agendamentoEncontrado) {
      onSelectEvento(agendamentoEncontrado);
    } else {
      console.warn("Agendamento correspondente não encontrado no array de eventos:", evento);
      onSelectEvento(evento as IAgendamento);
    }
  }

  const handleSelectSlot = (slotInfo: { start: Date, end: Date, action: 'select' | 'click' | 'doubleClick', slots?: Date[] | string[] }) => {
    if (slotInfo.action === 'click' || slotInfo.action === 'select') {
      const end = slotInfo.end < slotInfo.start ? slotInfo.start : slotInfo.end;
      onSelectSlot({ start: slotInfo.start, end: end });
    }
  }

  return (
    <div className="h-[75vh] rounded-lg bg-bg-surface p-4 shadow-lg border border-border text-text-base rbc-custom">
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        culture="pt-BR"
        messages={messages}

        selectable
        onSelectEvent={handleSelectEvent}
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