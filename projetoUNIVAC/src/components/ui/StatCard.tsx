'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ElementType
  color?: 'primary' | 'blue' | 'yellow' 
}

const colorClasses = {
  primary: 'bg-primary text-white',
  blue: 'bg-blue-500 text-white',
  yellow: 'bg-yellow-500 text-white',
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = 'primary',
}: StatCardProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-bg-surface p-6 shadow-md"
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Círculo do Ícone no topo (cores semânticas mantidas) */}
      {Icon && (
        <div
          className={`absolute -top-3 -right-3 flex h-16 w-16 items-center justify-center rounded-full ${colorClasses[color]} opacity-20`}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
      )}

      {/* Conteúdo do Card */}
      <div className="relative z-10">
        <h3 className="text-sm font-medium uppercase text-text-muted">
          {title}
        </h3>
        <p className="mt-2 text-4xl font-bold text-text-base">
          {value}
        </p>
        {description && (
          <p className="mt-1 text-sm text-text-base">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  )
}