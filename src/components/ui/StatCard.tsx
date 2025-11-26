'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ElementType
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const variantStyles = {
  default: { bg: 'bg-primary', text: 'text-primary' },
  success: { bg: 'bg-green-500', text: 'text-green-600' },
  warning: { bg: 'bg-yellow-500', text: 'text-yellow-600' },
  danger:  { bg: 'bg-red-500',    text: 'text-red-600' },
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'default',
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-bg-surface p-6 shadow-md border border-border"
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Círculo decorativo do Ícone */}
      {Icon && (
        <div className={`absolute -top-4 -right-4 h-24 w-24 rounded-full ${styles.bg} opacity-10 pointer-events-none flex items-center justify-center`}>
           {/* O ícone real é renderizado abaixo para melhor controle */}
        </div>
      )}
      
      {Icon && (
          <div className={`absolute top-4 right-4 p-2 rounded-full ${styles.bg} bg-opacity-10 ${styles.text}`}>
              <Icon size={24} />
          </div>
      )}

      <div className="relative z-10">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
          {title}
        </h3>
        <p className="mt-2 text-3xl font-extrabold text-text-base tracking-tight">
          {value}
        </p>
        {description && (
          <p className="mt-1 text-xs text-text-muted font-medium">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  )
}