'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, AlertTriangle, Calendar, Plus, 
  Syringe, Search, Archive, Trash2, Edit, CheckCircle2, AlertCircle 
} from 'lucide-react'
import { format, addMonths, isBefore, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { toast } from 'sonner'

// --- HELPERS ---
const getStatusLote = (validade: string | Date, qtd: number) => {
    const hoje = new Date();
    const dataValidade = new Date(validade);
    const diasParaVencer = differenceInDays(dataValidade, hoje);

    if (qtd === 0) return { label: 'Esgotado', color: 'text-gray-400', bg: 'bg-gray-100' };
    if (diasParaVencer < 0) return { label: 'Vencido', color: 'text-red-600', bg: 'bg-red-100' };
    if (diasParaVencer < 30) return { label: 'Vence em breve', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Válido', color: 'text-green-600', bg: 'bg-green-100' };
}

export default function EstoquePage() {
  const [vacinas, setVacinas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Estados de Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  
  // Estados de Edição/Criação
  const [editingLote, setEditingLote] = useState<any | null>(null)
  const [loteToDelete, setLoteToDelete] = useState<any | null>(null)

  // Formulário
  const [formData, setFormData] = useState({ vacinaId: '', codigo: '', qtd: '', validade: '' })

  // --- CARREGAR DADOS ---
  const fetchEstoque = useCallback(async () => {
    try {
      const res = await fetch('/api/estoque')
      if(!res.ok) throw new Error()
      const data = await res.json()
      
      // Processa os dados para somar o total
      const dadosProcessados = data.map((v: any) => ({
          ...v,
          estoqueTotal: v.lotes.reduce((acc: number, l: any) => acc + l.quantidade, 0)
      }))
      
      setVacinas(dadosProcessados)
    } catch (e) {
        toast.error("Erro ao carregar estoque.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEstoque()
  }, [fetchEstoque])

  // --- HANDLERS ---

  const handleOpenAdd = () => {
      setEditingLote(null);
      setFormData({ vacinaId: vacinas[0]?.id || '', codigo: '', qtd: '', validade: '' });
      setIsModalOpen(true);
  }

  const handleOpenEdit = (lote: any, vacinaId: number) => {
      setEditingLote(lote);
      setFormData({
          vacinaId: String(vacinaId),
          codigo: lote.codigo,
          qtd: String(lote.quantidade),
          validade: new Date(lote.validade).toISOString().split('T')[0]
      });
      setIsModalOpen(true);
  }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validações antes de chamar a API
        if (!formData.vacinaId) return toast.warning("Selecione uma vacina.");
        if (!formData.codigo) return toast.warning("Digite o código do lote.");
        if (Number(formData.qtd) < 0) return toast.warning("A quantidade não pode ser negativa.");
        if (!formData.validade) return toast.warning("A data de validade é obrigatória.");
        
        try {
            // Define se é CRIAÇÃO (POST) ou EDIÇÃO (PUT)
            const url = editingLote 
                ? `/api/estoque/${editingLote.id}` 
                : '/api/estoque';
                
            const method = editingLote ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vacinaId: Number(formData.vacinaId),
                    codigo: formData.codigo,
                    quantidade: Number(formData.qtd), // Garante que vai como número
                    validade: formData.validade
                })
            });

            if(!res.ok) {
                const err = await res.json();
                throw new Error(err.error);
            }

            toast.success(editingLote ? "Lote atualizado com sucesso!" : "Lote registrado com sucesso!");
            
            await fetchEstoque(); // Recarrega a lista
            setIsModalOpen(false); // Fecha o modal
            
            // Limpa o formulário se for criação (opcional, mas boa prática)
            if (!editingLote) {
                setFormData({ vacinaId: '', codigo: '', qtd: '', validade: '' })
            }

        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar lote. Tente novamente.");
        }
    }

  const handleDelete = async () => {
      if(!loteToDelete) return;
      try {
          await fetch(`/api/estoque/${loteToDelete.id}`, { method: 'DELETE' });
          toast.success("Lote removido do estoque.");
          fetchEstoque();
          setIsDeleteModalOpen(false);
      } catch (error) {
          toast.error("Erro ao remover.");
      }
  }

  // --- FILTRO E RENDERIZAÇÃO ---
  const vacinasFiltradas = vacinas.filter(v => 
    v.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div></div>

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-text-base flex items-center gap-2">
                <Package className="text-primary" size={32} /> Controle de Estoque
            </h1>
            <p className="text-text-muted">Gerencie lotes, validades e disponibilidade de doses.</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2 shadow-lg">
            <Plus size={18} /> Entrada de Nota / Lote
        </Button>
      </div>

      {/* KPIs de Estoque (Calculados em Tempo Real) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StockKpi 
            label="Doses Disponíveis" 
            value={vacinas.reduce((acc, v) => acc + v.estoqueTotal, 0)} 
            icon={Syringe} 
            color="text-primary" 
            bg="bg-primary/10" 
          />
          <StockKpi 
            label="Lotes Vencendo (30 dias)" 
            value={vacinas.reduce((acc, v) => acc + v.lotes.filter((l:any) => differenceInDays(new Date(l.validade), new Date()) < 30 && differenceInDays(new Date(l.validade), new Date()) >= 0).length, 0)} 
            icon={Calendar} 
            color="text-yellow-600" 
            bg="bg-yellow-500/10" 
          />
          <StockKpi 
            label="Vacinas Esgotadas" 
            value={vacinas.filter(v => v.estoqueTotal === 0).length} 
            icon={AlertTriangle} 
            color="text-red-600" 
            bg="bg-red-500/10" 
          />
      </div>

      {/* Barra de Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-text-muted" size={18} />
        <input 
            type="text" 
            placeholder="Buscar vacina por nome..." 
            className="w-full rounded-lg border border-border bg-bg-surface py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid de Vacinas e Seus Lotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {vacinasFiltradas.map(vacina => (
            <motion.div key={vacina.id} variants={itemVariants} className="flex flex-col rounded-xl border border-border bg-bg-surface shadow-sm overflow-hidden">
                
                {/* Cabeçalho do Card da Vacina */}
                <div className="p-5 border-b border-border bg-bg-base/50 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-text-base">{vacina.nome}</h3>
                            {vacina.obrigatoriedade && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full">Obrigatória</span>}
                        </div>
                        <p className="text-xs text-text-muted mt-1">Total em Estoque</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-lg text-sm font-bold ${
                        vacina.estoqueTotal > 50 ? 'bg-green-100 text-green-700' :
                        vacina.estoqueTotal > 0 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                        {vacina.estoqueTotal > 0 ? `${vacina.estoqueTotal} doses` : 'Esgotado'}
                    </div>
                </div>

                {/* Lista de Lotes */}
                <div className="p-0 flex-grow">
                    {vacina.lotes.length === 0 ? (
                        <div className="p-8 text-center text-text-muted text-sm flex flex-col items-center gap-2 opacity-60">
                            <Archive size={24} />
                            Nenhum lote ativo.
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-bg-base text-text-muted text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-4 py-2">Lote</th>
                                    <th className="px-4 py-2">Validade</th>
                                    <th className="px-4 py-2">Qtd</th>
                                    <th className="px-4 py-2 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {vacina.lotes.map((lote: any) => {
                                    const status = getStatusLote(lote.validade, lote.quantidade);
                                    return (
                                        <tr key={lote.id} className="hover:bg-bg-base transition-colors">
                                            <td className="px-4 py-3 font-mono text-xs font-medium">{lote.codigo}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span>{format(new Date(lote.validade), 'dd/MM/yyyy')}</span>
                                                    <span className={`text-[10px] font-bold ${status.color}`}>{status.label}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-text-base">{lote.quantidade}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button 
                                                        onClick={() => handleOpenEdit(lote, vacina.id)}
                                                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" 
                                                        title="Editar"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button 
                                                        onClick={() => { setLoteToDelete(lote); setIsDeleteModalOpen(true); }}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" 
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        ))}
      </div>

      {/* Modal de CRUD (Adicionar/Editar) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingLote ? "Editar Lote" : "Entrada de Estoque"}
      >
        <form onSubmit={handleSave} className="space-y-4">
            <div>
                <label className="text-sm font-medium mb-1 block text-text-base">Vacina</label>
                <select 
                    className="w-full p-2.5 rounded-lg border border-border bg-bg-base text-text-base focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.vacinaId}
                    onChange={e => setFormData({...formData, vacinaId: e.target.value})}
                    required
                    disabled={!!editingLote} // Não muda a vacina na edição
                >
                    <option value="" disabled>Selecione o Imunizante</option>
                    {vacinas.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
                </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <Input 
                    id="lote" label="Código do Lote" placeholder="Ex: FA-2025" 
                    value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})} required
                />
                <Input 
                    id="qtd" label="Quantidade (Doses)" type="number" placeholder="0" 
                    value={formData.qtd} onChange={e => setFormData({...formData, qtd: e.target.value})} required
                />
            </div>
            
            <Input 
                id="validade" label="Data de Validade" type="date" 
                value={formData.validade} onChange={e => setFormData({...formData, validade: e.target.value})} required
            />
            
            <div className="flex justify-end gap-2 pt-4 border-t border-border mt-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit" variant="primary">{editingLote ? 'Salvar Alterações' : 'Confirmar Entrada'}</Button>
            </div>
        </form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmationModal 
         isOpen={isDeleteModalOpen}
         onClose={() => setIsDeleteModalOpen(false)}
         onConfirm={handleDelete}
         title="Excluir Lote"
         message={`Tem certeza que deseja excluir o lote ${loteToDelete?.codigo}? Esta ação não pode ser desfeita.`}
      />

    </motion.div>
  )
}

// Componente KPI Simples
function StockKpi({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="p-5 rounded-xl bg-bg-surface border border-border shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
            <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${bg} ${color} shadow-inner`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-3xl font-bold text-text-base">{value}</p>
                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">{label}</p>
            </div>
        </div>
    )
}