'use client'
import React from 'react'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark dark:hover:bg-primary-light',
  secondary: 'bg-border text-text-base hover:bg-border/80 dark:hover:bg-border/70',
  danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600',
  ghost: 'bg-transparent text-text-muted hover:text-text-base hover:bg-border/30 dark:hover:bg-border/20 shadow-none',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',       
  md: 'px-4 py-2 text-sm',        
  lg: 'px-6 py-3 text-base',        
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        rounded-md font-medium transition-colors duration-150 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-bg-base
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center
        ${variants[variant]}
        ${sizes[size]}
        ${className || ''} 
      `}
      {...props}
    >
      {children}
    </button>
  )
}