'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// --- Configurações ---
const DICAS = [
  'Organizando os registros de vacinação...',
  'Sincronizando os dados dos funcionários...',
  'Carregando relatórios e estatísticas...',
  'Preparando o ambiente de administração...',
  'Verificando disponibilidade de vacinas...',
]

const IMAGENS_FUNDO = [
  '/univas-si.png',
  '/univas-fatima.jpg',
  '/univas-medicina.jpg',
  '/univas-ef.png',
]

const TOTAL_LOADING_TIME_MS = 5000 // 5 segundos
const PROGRESS_INTERVAL_MS = 50 // Atualiza o progresso a cada 50ms
const PROGRESS_INCREMENT = (PROGRESS_INTERVAL_MS / TOTAL_LOADING_TIME_MS) * 100 // Garante que chegue a 100% no tempo certo
const TIP_CHANGE_MS = 3500 // Tempo para trocar a dica
const IMAGE_CHANGE_MS = 4000 // Tempo para trocar a imagem
const IMAGE_FADE_MS = 600 // Duração da transição da imagem
const REDIRECT_DELAY_MS = 500 // Pequeno delay após 100% antes de redirecionar

export default function LoadingPage() {
  const router = useRouter()
  const [progresso, setProgresso] = useState(0)
  const [textoExibido, setTextoExibido] = useState('')
  const [dicaAtual, setDicaAtual] = useState(DICAS[0])
  const [imagemFundoAtual, setImagemFundoAtual] = useState(IMAGENS_FUNDO[0])
  const [fade, setFade] = useState(true)

  // --- Hooks de Efeitos Separados ---

  // Digitação
  useEffect(() => {
    let i = 0
    setTextoExibido('')
    const intervalo = setInterval(() => {
      setTextoExibido((prev) => prev + dicaAtual.charAt(i))
      i++
      if (i >= dicaAtual.length) clearInterval(intervalo)
    }, 50)
    return () => clearInterval(intervalo)
  }, [dicaAtual])

  // Progresso
  useEffect(() => {
    const intervaloProgresso = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 100) {
          clearInterval(intervaloProgresso)
          return 100
        }
        return prev + PROGRESS_INCREMENT
      })
    }, PROGRESS_INTERVAL_MS)

    return () => clearInterval(intervaloProgresso)
  }, [])

  // Troca de Dicas
  useEffect(() => {
    let indiceDica = 0
    const intervaloDica = setInterval(() => {
      if (progresso < 100) {
        indiceDica = (indiceDica + 1) % DICAS.length
        setDicaAtual(DICAS[indiceDica])
      }
    }, TIP_CHANGE_MS)

    return () => clearInterval(intervaloDica)
  }, [progresso]) 

  // Troca de Imagens
  useEffect(() => {
    let indiceImagem = 0
    const intervaloImagem = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        indiceImagem = (indiceImagem + 1) % IMAGENS_FUNDO.length
        setImagemFundoAtual(IMAGENS_FUNDO[indiceImagem])
        setFade(true)
      }, IMAGE_FADE_MS)
    }, IMAGE_CHANGE_MS)

    return () => clearInterval(intervaloImagem)
  }, [])

  // Redirecionamento
  useEffect(() => {
    if (progresso === 100) {
      setDicaAtual('Redirecionando...')

      const temporizadorRedirecionar = setTimeout(() => {
        router.push('/login')
      }, REDIRECT_DELAY_MS)

      return () => clearTimeout(temporizadorRedirecionar)
    }
  }, [progresso, router])

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
          fade ? 'opacity-40' : 'opacity-0'
        }`}
      >
        <Image
          key={imagemFundoAtual}
          src={imagemFundoAtual}
          alt=""
          role="presentation" 
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px]" />

      <div className="z-20 flex flex-col items-center text-center p-4">
        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Uni<span className="text-primary-light">Vac</span>
        </h1>

        <div
          className="relative mb-6 w-72 h-3 rounded-full bg-white/20 overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.floor(progresso)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Carregando sistema"
        >
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progresso}%` }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center text-xs font-semibold"
            aria-hidden="true" 
          >
            {Math.floor(progresso)}%
          </span>
        </div>

        <div
          aria-live="polite" 
          aria-atomic="true"
          className="max-w-md text-lg text-white/90 min-h-[3rem]" 
        >
          <p>{textoExibido}</p>
        </div>
      </div>
    </div>
  )
}