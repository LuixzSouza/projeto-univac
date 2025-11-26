'use client'

interface ProgressBarProps {
  value: number
  showLabel?: boolean // ✨ Opção de mostrar texto
  colorClass?: string // ✨ Opção de cor customizada (ex: 'bg-red-500')
}

export function ProgressBar({ value, showLabel = false, colorClass = "bg-primary" }: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-text-base">Progresso</span>
          <span className="text-xs font-medium text-text-muted">{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-border/50 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${colorClass}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}