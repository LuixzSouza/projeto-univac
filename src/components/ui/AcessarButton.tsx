'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface AcessarButtonProps {
  href: string
  label?: string
}
export function AcessarButton({ href, label = "Acessar" }: AcessarButtonProps) {
  return (
    <Link href={href}>
      <div className="mt-4 flex items-center justify-between rounded-md bg-primary p-3 text-white transition-colors hover:bg-primary-dark cursor-pointer">
        <span className="font-medium">{label}</span>
        <ArrowRight size={20} />
      </div>
    </Link>
  )
}
