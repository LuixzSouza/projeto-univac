'use client'
import React from 'react'
import { Switch as HeadlessSwitch } from '@headlessui/react'

interface SwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string 
  srLabel?: string 
  disabled?: boolean
}

export function Switch({ enabled, onChange, label, srLabel, disabled = false }: SwitchProps) {
  return (
    <HeadlessSwitch.Group as="div" className="flex items-center gap-3">
        <HeadlessSwitch
            checked={enabled}
            onChange={onChange}
            disabled={disabled}
            className={`
            ${enabled ? 'bg-primary' : 'bg-border'} 
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out 
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-bg-surface
            `}
        >
            <span className="sr-only">{srLabel || label || 'Toggle'}</span>
            <span
            aria-hidden="true"
            className={`
                ${enabled ? 'translate-x-5' : 'translate-x-0'}
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            `}
            />
        </HeadlessSwitch>
        
        {label && (
            <HeadlessSwitch.Label className={`text-sm font-medium cursor-pointer ${disabled ? 'text-text-muted' : 'text-text-base'}`}>
                {label}
            </HeadlessSwitch.Label>
        )}
    </HeadlessSwitch.Group>
  )
}