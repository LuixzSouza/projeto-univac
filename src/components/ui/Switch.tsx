'use client'
import React from 'react'
import { Switch as HeadlessSwitch } from '@headlessui/react' 

interface SwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  srLabel?: string 
}

export function Switch({ enabled, onChange, srLabel = 'Toggle' }: SwitchProps) {
  return (
    <HeadlessSwitch
      checked={enabled}
      onChange={onChange}
      className={`${
        enabled ? 'bg-primary' : 'bg-border' 
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-bg-surface`} // Ring offset usa bg-surface
    >
      <span className="sr-only">{srLabel}</span>
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} // Handle branco
      />
    </HeadlessSwitch>
  )
}