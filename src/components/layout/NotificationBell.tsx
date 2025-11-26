'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'critical' | 'success'
  title: string
  message: string
  link?: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Busca notificações a cada 30 segundos ou ao carregar
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) {
            const data = await res.json()
            setNotifications(data)
            if (data.length > 0) setHasUnread(true)
        }
      } catch (e) {
        console.error(e)
      }
    }

    fetchNotifs()
    // Polling simples (atualiza a cada 1 minuto)
    const interval = setInterval(fetchNotifs, 60000)
    return () => clearInterval(interval)
  }, [])

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNotificationClick = (link?: string) => {
    if (link) router.push(link)
    setIsOpen(false)
  }

  // Ícones por tipo
  const getIcon = (type: string) => {
    switch (type) {
        case 'critical': return <XCircle size={18} className="text-red-500" />
        case 'warning': return <AlertTriangle size={18} className="text-yellow-500" />
        case 'success': return <CheckCircle size={18} className="text-green-500" />
        default: return <Info size={18} className="text-blue-500" />
    }
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
        className="relative p-2 rounded-full hover:bg-bg-base transition-colors text-text-muted hover:text-primary"
      >
        <Bell size={20} />
        {hasUnread && (
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-bg-surface animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-border bg-bg-surface shadow-2xl z-50 overflow-hidden"
            >
                <div className="p-4 border-b border-border flex justify-between items-center bg-bg-base/50 backdrop-blur-sm">
                    <h3 className="font-semibold text-text-base">Notificações</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {notifications.length} novas
                    </span>
                </div>

                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-text-muted">
                            <Bell size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Tudo tranquilo por aqui.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-border">
                            {notifications.map((notif) => (
                                <li 
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif.link)}
                                    className="p-4 hover:bg-bg-base/50 cursor-pointer transition-colors flex gap-3 items-start group"
                                >
                                    <div className={`mt-1 p-2 rounded-full bg-bg-base shrink-0 shadow-sm border border-border group-hover:border-primary/20`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-base mb-0.5">{notif.title}</p>
                                        <p className="text-xs text-text-muted leading-relaxed">{notif.message}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div className="p-2 border-t border-border bg-bg-base/30 text-center">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-xs text-text-muted hover:text-primary transition-colors w-full py-1"
                    >
                        Fechar
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}