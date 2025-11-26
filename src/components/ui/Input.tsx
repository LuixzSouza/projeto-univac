'use client'
import React, { forwardRef } from 'react' 
import { AlertCircle } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ElementType
  error?: string // ✨ Nova prop para mensagem de erro
}

// Usamos forwardRef para garantir compatibilidade com React Hook Form e foco manual
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, icon: Icon, className, error, ...props }, ref) => {
    return (
      <div className="w-full"> 
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-1.5 ${error ? 'text-red-500' : 'text-text-base'}`}
        >
          {label}
        </label>
        
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-text-muted'}`} aria-hidden="true" /> 
            </div>
          )}
          
          <input
            ref={ref}
            id={id}
            className={`
              block w-full rounded-lg border p-2.5 text-sm shadow-sm transition-colors
              bg-bg-base text-text-base placeholder:text-text-muted
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:cursor-not-allowed disabled:opacity-50
              ${Icon ? 'pl-10' : 'pl-3'}
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-border focus:border-primary focus:ring-primary/20'
              }
              ${className || ''}
            `}
            {...props}
          />

          {/* Ícone de alerta se tiver erro */}
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Mensagem de erro abaixo do input */}
        {error && (
          <p className="mt-1 text-xs text-red-500 animate-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'