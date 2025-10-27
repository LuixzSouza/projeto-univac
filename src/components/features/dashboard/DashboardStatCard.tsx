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
      className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-green-700 p-6 text-white shadow-lg" 
      whileHover={{ y: -5, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Icon className="absolute bottom-2 right-2 h-20 w-20 text-white opacity-10" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-white/20 p-2">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-medium uppercase tracking-wider">{title}</h3>
        </div>
        <p className="text-5xl font-bold">{value}</p>
      </div>
    </motion.div>
  )
}