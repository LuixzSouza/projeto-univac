'use client'
interface ProgressBarProps {
  value: number 
}
export function ProgressBar({ value }: ProgressBarProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100); 
  return (
    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-300 ease-in-out"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  )
}