'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, AlertTriangle, Info, XCircle, CheckCircle, CheckCheck, Trash2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'critical' | 'success'
  title: string
  message: string
  link?: string
  read?: boolean
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Calcula unread
  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
          const data = await res.json()
          // Lógica de atualização
          if (data.length > notifications.length) {
             triggerBellAnimation()
             const newNotifs = data.map((n: any) => ({ ...n, read: false }))
             setNotifications(newNotifs)
          } else if (notifications.length === 0) {
             const newNotifs = data.map((n: any) => ({ ...n, read: false }))
             setNotifications(newNotifs)
          }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000)
    return () => clearInterval(interval)
  }, [])

  const triggerBellAnimation = () => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
  }

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

  const handleNotificationClick = (link?: string, id?: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (link) router.push(link)
    setIsOpen(false)
  }

  const handleMarkAllRead = () => {
      if (unreadCount === 0) return;
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success("Marcadas como lidas.");
  }

  const handleClearAll = () => {
      setNotifications([])
      setIsOpen(false)
      toast.info("Limpo.")
  }

  // Helpers visuais
  const getIcon = (type: string) => {
    switch (type) {
        case 'critical': return <XCircle size={18} className="text-red-600" />
        case 'warning': return <AlertTriangle size={18} className="text-yellow-600" />
        case 'success': return <CheckCircle size={18} className="text-green-600" />
        default: return <Info size={18} className="text-blue-600" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
        case 'critical': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }
  }

  return (
    <div className="relative" ref={wrapperRef}>
      
      {/* BOTÃO SINO */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-bg-base transition-colors text-text-muted hover:text-primary focus:outline-none"
      >
        <motion.div
            animate={isAnimating ? { rotate: [0, -15, 15, -15, 15, 0] } : {}}
            transition={{ duration: 0.5 }}
        >
            <Bell size={22} />
        </motion.div>

        {unreadCount > 0 && (
            <span className="absolute top-1.5 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-bg-surface"></span>
            </span>
        )}
      </button>

      {/* MODAL DE NOTIFICAÇÕES */}
      <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop invisível no mobile para fechar ao clicar fora */}
                <div className="fixed inset-0 z-40 bg-black/10 lg:hidden" onClick={() => setIsOpen(false)} />

                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`
                        z-50 bg-bg-surface border border-border shadow-2xl flex flex-col overflow-hidden
                        
                        /* --- ESTILOS RESPONSIVOS CRUCIAIS --- */
                        
                        /* MOBILE (< 1024px): Fixo, centralizado, com margem */
                        fixed top-16 left-4 right-4 max-h-[70vh] rounded-xl
                        
                        /* DESKTOP (>= 1024px): Absoluto, alinhado à direita do sino, largura fixa */
                        lg:absolute lg:top-full lg:right-0 lg:left-auto lg:mt-2 lg:w-96 lg:max-h-[600px] lg:rounded-xl
                    `}
                >
                    {/* HEADER */}
                    <div className="p-3 border-b border-border flex justify-between items-center bg-bg-base/80 backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-text-base">Notificações</h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-1">
                            <button onClick={handleMarkAllRead} title="Marcar todas como lidas" className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded">
                                <CheckCheck size={16} />
                            </button>
                            <button onClick={handleClearAll} title="Limpar tudo" className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded">
                                <Trash2 size={16} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-1.5 text-text-muted hover:bg-bg-base rounded lg:hidden">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* LISTA SCROLLÁVEL */}
                    <div className="overflow-y-auto custom-scrollbar flex-grow bg-bg-base/30">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center text-text-muted flex flex-col items-center gap-3">
                                <Bell size={24} className="opacity-20" />
                                <p className="text-xs">Nenhuma notificação nova.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-border/50">
                                {notifications.map((notif) => (
                                    <li 
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif.link, notif.id)}
                                        className={`
                                            p-4 hover:bg-bg-base transition-colors cursor-pointer group relative
                                            ${!notif.read ? 'bg-bg-surface' : 'opacity-60'}
                                        `}
                                    >
                                        {!notif.read && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                        )}

                                        <div className="flex gap-3 items-start">
                                            <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 border ${getBgColor(notif.type)}`}>
                                                {getIcon(notif.type)}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-sm text-text-base mb-0.5 truncate ${!notif.read ? 'font-bold' : 'font-medium'}`}>
                                                        {notif.title}
                                                    </p>
                                                    <span className="text-[10px] text-text-muted whitespace-nowrap ml-2">Agora</span>
                                                </div>
                                                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{notif.message}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="p-2 border-t border-border bg-bg-surface text-center text-[10px] text-text-muted uppercase tracking-wider">
                        UniVac Alerts
                    </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  )
}