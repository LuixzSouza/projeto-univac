'use client'
import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export function Select({ label, id, children, className, ...props }: SelectProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-text-base mb-1"
      >
        {label}
      </label>
      <select
        id={id}
        className={`mt-1 block w-full rounded-md border border-border p-2 shadow-sm focus:border-primary focus:ring-primary bg-bg-base text-text-base ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}