'use client'
import React from 'react'
import { Modal } from './Modal' 
import { Button } from './Button'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  isLoading?: boolean // ✨ Nova prop para travar o modal durante a ação
  confirmText?: string // ✨ Texto customizável
  cancelText?: string
  variant?: 'danger' | 'primary' // ✨ Pode ser usado para confirmações não destrutivas
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmText = "Confirmar Exclusão",
  cancelText = "Cancelar",
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? () => {} : onClose} title="">
      {/* Título customizado com Ícone */}
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          <AlertTriangle size={24} />
        </div>
        <h3 className="text-lg font-bold text-text-base leading-6">
          {title}
        </h3>
        
        <div className="mt-2">
          <p className="text-sm text-text-muted">
            {message}
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose}
          disabled={isLoading} // Trava botão
          className="w-full sm:w-auto"
        >
          {cancelText}
        </Button>
        
        <Button 
          type="button" 
          variant={variant} 
          onClick={onConfirm}
          disabled={isLoading} // Trava botão
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}