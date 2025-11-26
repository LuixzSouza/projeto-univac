'use client'
import { motion } from 'framer-motion'
import React from 'react'

interface DashboardStatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
}

export function DashboardStatCard({ title, value, icon: Icon }: DashboardStatCardProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-green-700 p-6 text-white shadow-lg border border-primary/20" 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Ícone de Fundo Decorativo */}
      <Icon className="absolute -bottom-4 -right-4 h-24 w-24 text-white opacity-10 rotate-12" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-green-50">{title}</h3>
        </div>
        <p className="text-4xl font-bold tracking-tight">{value}</p>
      </div>
    </motion.div>
  )
}