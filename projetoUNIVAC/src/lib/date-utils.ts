// /src/lib/date-utils.ts

// Converte um objeto Date para uma string 'YYYY-MM-DD'
export function dateToDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Converte um objeto Date para uma string 'HH:MM'
export function dateToTimeString(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// Combina strings de data e hora num novo objeto Date
export function combineDateTime(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}`)
}