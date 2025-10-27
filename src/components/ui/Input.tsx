'use client'
import React from 'react' 

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ElementType 
}

export function Input({ label, id, icon: Icon, className, ...props }: InputProps) { 
  return (
    <div className="mb-4"> 
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text-base mb-1" 
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-text-muted" aria-hidden="true" /> 
          </div>
        )}
        <input
          id={id}
          className={`
            block w-full rounded-md border border-border p-2 shadow-sm
            focus:border-primary focus:ring-primary
            bg-bg-base text-text-base placeholder:text-text-muted
            ${Icon ? 'pl-10' : 'pl-3'}
            ${className || ''}
          `}
          {...props}
        />
      </div>
    </div>
  )
}
