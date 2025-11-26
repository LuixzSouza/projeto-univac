'use client'
import React, { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string // ✨ Suporte a erro
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, children, className, error, ...props }, ref) => {
    return (
      <div className="w-full mb-4">
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-1 ${error ? 'text-red-500' : 'text-text-base'}`}
        >
          {label}
        </label>
        
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={`
              block w-full rounded-lg border p-2.5 text-sm shadow-sm transition-colors
              bg-bg-base text-text-base
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:cursor-not-allowed disabled:opacity-50
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                : 'border-border focus:border-primary focus:ring-primary/20'
              }
              ${className || ''}
            `}
            {...props}
          >
            {children}
          </select>

          {/* Ícone de erro absoluto à direita */}
          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-8 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-xs text-red-500 animate-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'