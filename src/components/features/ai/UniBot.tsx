'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare, X, Send, Bot, MinusCircle, Loader2, Trash2, Download, Upload, Volume2, VolumeX
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner' 

type Message = {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: string 
}

const KNOWLEDGE_BASE: Record<string, string> = {
  senha:
    'Para alterar sua senha, vá até o menu "Meu Perfil" > "Segurança". Se esqueceu a senha, contate o administrador.',
  vacina:
    'Você pode cadastrar novas vacinas no menu "Vacinas". Marque se a vacina é Obrigatória ou Não Obrigatória.',
  estoque:
    'Controle de estoque: Menu "Estoque". O sistema avisa quando um lote estiver com 30 dias para vencer.',
  agenda:
    'Para agendar, clique em um dia vazio na Agenda. Confirme a aplicação usando o botão "Check-in" no agendamento.',
  erro: 'Ao encontrar um erro, abra um chamado em "Ajuda" > "Suporte" com um print e descrição.',
  default:
    'Desculpe, não entendi. Tente perguntar sobre: "senha", "vacina", "estoque" ou "agenda".'
}

const SUGGESTIONS = ['vacina', 'agenda', 'estoque', 'senha']

const nowISO = () => new Date().toISOString()
const shortTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

function findBestMatch(input: string) {
  const lower = input.toLowerCase()
  for (const key of Object.keys(KNOWLEDGE_BASE)) {
    if (key !== 'default' && lower.includes(key)) return KNOWLEDGE_BASE[key]
  }
  return KNOWLEDGE_BASE.default
}

export function UniBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(false)
  const [position, setPosition] = useState({ right: 24, bottom: 24 })
  
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Carregar mensagens do localStorage
  useEffect(() => {
      const saved = localStorage.getItem('unibot_msgs_v1')
      if (saved) {
          try {
             setMessages(JSON.parse(saved))
          } catch (e) {
             setMessages([{ id: 'welcome', text: 'Olá! Sou o UniBot 🤖. Como posso ajudar?', sender: 'bot', timestamp: nowISO() }])
          }
      } else {
          setMessages([{ id: 'welcome', text: 'Olá! Sou o UniBot 🤖. Como posso ajudar?', sender: 'bot', timestamp: nowISO() }])
      }
  }, [])

  // Persistência e Scroll
  useEffect(() => {
    if(messages.length > 0) localStorage.setItem('unibot_msgs_v1', JSON.stringify(messages))
    
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping, isOpen]) // Adicionei dependências para garantir o scroll

  // --- FUNÇÕES QUE FALTAVAM  ---

  // Limpar Conversa
  const clearChat = () => {
      setMessages([{ id: 'welcome', text: 'Olá! Sou o UniBot 🤖. Como posso ajudar?', sender: 'bot', timestamp: nowISO() }])
      toast.success("Histórico de conversa limpo.")
  }

  // Exportar JSON
  const exportChat = () => {
      if (messages.length <= 1) return toast.info("Nada para exportar ainda.");
      
      const blob = new Blob([JSON.stringify(messages, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `unibot-chat-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Backup da conversa salvo!")
  }

  // Importar JSON
  const importChat = (file?: File) => {
      if (!file) return;
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(String(e.target?.result))
          if (Array.isArray(parsed)) {
              setMessages(parsed)
              toast.success("Histórico carregado com sucesso.")
          }
        } catch (error) {
          toast.error("Arquivo de histórico inválido.")
        }
      }
      reader.readAsText(file)
  }
  // ----------------------------------------

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text) return

    const userMsg: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: nowISO() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    await new Promise(r => setTimeout(r, 800))

    const responseText = findBestMatch(text)
    const botMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, sender: 'bot', timestamp: nowISO() }
    
    setMessages(prev => [...prev, botMsg])
    setIsTyping(false)

    if (speechEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(responseText)
      utter.lang = 'pt-BR'
      utter.rate = 1.2 
      window.speechSynthesis.speak(utter)
    }
  }

  const handleSuggestion = (s: string) => {
    setInput(s)
    setTimeout(() => handleSend(), 300) 
  }

  // --- DRAGGABLE ---
  useEffect(() => {
    let startX = 0, startY = 0, initRight = 0, initBottom = 0

    function onMove(e: MouseEvent) {
      const dx = startX - e.clientX
      const dy = startY - e.clientY
      setPosition({ right: Math.max(24, initRight + dx), bottom: Math.max(24, initBottom + dy) })
    }

    function onUp() {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    const header = containerRef.current?.querySelector('[data-drag-handle]') as HTMLElement | null
    if (!header) return

    function onDown(e: MouseEvent) {
      startX = e.clientX; startY = e.clientY
      initRight = position.right; initBottom = position.bottom
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    }

    header.addEventListener('mousedown', onDown)
    return () => header.removeEventListener('mousedown', onDown)
  }, [isOpen, isMinimized])

  // --- RENDER ---
  return (
    <div style={{ position: 'fixed', right: position.right, bottom: position.bottom, zIndex: 9999 }}>
      <AnimatePresence mode='wait'>
        
        {/* JANELA ABERTA */}
        {isOpen && !isMinimized && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80 sm:w-96 h-[550px] max-h-[80vh] bg-bg-surface border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div data-drag-handle className="p-3 bg-primary text-white flex justify-between items-center cursor-grab active:cursor-grabbing select-none shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm border border-white/10">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">Assistente Virtual</h3>
                  <p className="text-[10px] text-white/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" /> Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  title={speechEnabled ? "Silenciar" : "Ativar Voz"}
                  onClick={() => { setSpeechEnabled(s => !s); toast.info(speechEnabled ? "Voz desativada" : "Voz ativada"); }}
                  className={`p-1.5 rounded transition-all ${speechEnabled ? 'bg-white/20 text-white shadow-inner' : 'hover:bg-white/10 text-white/70'}`}
                >
                  {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <div className="h-4 w-px bg-white/20 mx-1"></div>
                <button title="Limpar Conversa" onClick={clearChat} className="p-1.5 hover:bg-white/10 rounded text-white/80"><Trash2 size={16} /></button>
                <button title="Minimizar" onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-white/10 rounded text-white/80"><MinusCircle size={16} /></button>
                <button title="Fechar" onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-red-500/80 rounded text-white/80 hover:text-white transition-colors"><X size={16} /></button>
              </div>
            </div>

            {/* CHAT AREA */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-bg-base custom-scrollbar">
              {messages.map((msg) => (
                <motion.div 
                    key={msg.id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm relative leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white rounded-br-none shadow-primary/20' 
                        : 'bg-bg-surface border border-border text-text-base rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                    <span className={`text-[9px] block text-right mt-1 opacity-60 font-mono ${msg.sender === 'user' ? 'text-white' : 'text-text-muted'}`}>
                      {shortTime(msg.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-bg-surface border border-border p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* INPUT AREA */}
            <div className="p-3 bg-bg-surface border-t border-border flex flex-col gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              {/* Sugestões */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {SUGGESTIONS.map(s => (
                  <button 
                    key={s} 
                    onClick={() => handleSuggestion(s)} 
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-bg-base hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend} className="flex gap-2 items-center relative">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Digite sua dúvida..."
                  className="flex-grow bg-bg-base border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all pr-10 shadow-inner"
                />
                <Button 
                    type="submit" 
                    disabled={!input.trim() || isTyping} 
                    size="sm" 
                    className="absolute right-1.5 top-1.5 rounded-lg w-8 h-8 p-0 flex items-center justify-center bg-primary hover:bg-primary-dark text-white shadow-md disabled:opacity-50 disabled:bg-gray-400"
                >
                  {isTyping ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </Button>
              </form>
              
              <div className="flex justify-between items-center px-1">
                  <button onClick={() => exportChat()} className="text-[10px] text-text-muted hover:text-primary flex items-center gap-1 transition-colors">
                      <Download size={10}/> Salvar Histórico
                  </button>
                  <label className="text-[10px] text-text-muted hover:text-primary flex items-center gap-1 cursor-pointer transition-colors">
                      <input type="file" className="hidden" accept=".json" onChange={e => importChat(e.target.files?.[0])}/>
                      <Upload size={10}/> Carregar
                  </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* BARRA MINIMIZADA */}
        {isMinimized && (
           <motion.div
             initial={{ opacity: 0, y: 20, scale: 0.8 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, scale: 0.8 }}
             onClick={() => { setIsMinimized(false); setIsOpen(true); }}
             className="bg-bg-surface border border-border rounded-full shadow-xl p-1 pr-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform group"
           >
              <div className="bg-primary p-2 rounded-full text-white shadow-md group-hover:rotate-12 transition-transform">
                  <Bot size={20} />
              </div>
              <div className="flex flex-col">
                  <span className="text-xs font-bold text-text-base">UniBot</span>
                  <span className="text-[10px] text-primary font-medium">Clique para continuar</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }}
                className="ml-2 p-1 hover:bg-red-100 rounded-full text-text-muted hover:text-red-500 transition-colors"
              >
                  <X size={14}/>
              </button>
           </motion.div>
        )}

        {/* BOTÃO FLUTUANTE (TRIGGER) */}
        {!isOpen && !isMinimized && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/40 flex items-center justify-center transition-all z-50"
            aria-label="Abrir UniBot"
          >
            <MessageSquare size={28} fill="currentColor" className="text-white" />
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
            </span>
          </motion.button>
        )}

      </AnimatePresence>
    </div>
  )
}