'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const mouseDownTarget = useRef<EventTarget | null>(null)

  // Fecha com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownTarget.current = e.target
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseDownTarget.current === e.currentTarget && e.target === e.currentTarget) {
      onClose()
    }
    mouseDownTarget.current = null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="w-full max-w-lg rounded-xl bg-bg-surface p-6 shadow-2xl border border-border text-text-base max-h-[90vh] overflow-y-auto custom-scrollbar"
            
            onMouseDown={(e: React.MouseEvent) => e.stopPropagation()} 
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-bold text-text-base leading-tight">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-text-muted transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                aria-label="Fechar Modal"
                title="Fechar (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}