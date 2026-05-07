import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Receipt,
  Plus,
  TrendingUp,
  Users,
  CheckCircle2,
  X,
  Loader2,
  Save,
  Download,
  Search,
  Filter,
  Edit3,
  Trash2,
  Clock,
  AlertCircle,
  Calendar,
  FileText,
  Euro,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { PremiumSelect } from '../../components/admin/PremiumSelect';
import { PremiumDatePicker } from '../../components/admin/PremiumDatePicker';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface Invoice {
  _id: string;
  number: string;
  client: string;
  email?: string;
  address?: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'CANCELLED';
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
}

interface Stats {
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  cancelledAmount: number;
}

export default function Facturation() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; number: string }>({
    isOpen: false,
    id: '',
    number: ''
  });

  const [formData, setFormData] = useState({
    number: '',
    client: '',
    email: '',
    address: '',
    amount: 0,
    status: 'UNPAID' as 'PAID' | 'UNPAID' | 'CANCELLED',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [] as InvoiceItem[],
    notes: ''
  });

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data.data);
      setStats(res.data.stats);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        amount: formData.items.reduce((sum: number, item: InvoiceItem) => sum + (item.price * item.quantity), 0)
      };

      if (editingInvoice) {
        await api.put(`/invoices/${editingInvoice._id}`, data);
      } else {
        await api.post('/invoices', data);
      }
      setShowModal(false);
      resetForm();
      fetchInvoices();
    } catch (err) {
      console.error('Error saving invoice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      number: '',
      client: '',
      email: '',
      address: '',
      amount: 0,
      status: 'UNPAID',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [],
      notes: ''
    });
    setEditingInvoice(null);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      number: invoice.number,
      client: invoice.client,
      email: invoice.email || '',
      address: invoice.address || '',
      amount: invoice.amount,
      status: invoice.status,
      date: invoice.date.split('T')[0],
      dueDate: invoice.dueDate ? invoice.dueDate.split('T')[0] : '',
      items: invoice.items,
      notes: invoice.notes || ''
    });
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/invoices/${deleteModal.id}`);
      setDeleteModal({ isOpen: false, id: '', number: '' });
      fetchInvoices();
    } catch (err) {
      console.error('Error deleting invoice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Numéro', 'Client', 'Email', 'Montant', 'Statut', 'Date', 'Echéance'];
    const csvRows = filteredInvoices.map((inv: Invoice) => [
      inv.number,
      inv.client,
      inv.email || '',
      inv.amount,
      inv.status,
      new Date(inv.date).toLocaleDateString('fr-FR'),
      inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('fr-FR') : ''
    ].join(','));

    const csvContent = "\uFEFF" + [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `padel_arena_factures_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredInvoices = invoices.filter((inv: Invoice) => {
    const matchesSearch = inv.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum: number, item: InvoiceItem) => sum + (item.price * item.quantity), 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-10"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 border-b border-white/5 pb-8 md:pb-10 pt-6 md:pt-0">
        <div className="space-y-3 md:space-y-4">
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-[0.9] md:leading-[0.85]">
              Contrôle <br /> <span className="text-padel-yellow drop-shadow-[0_0_30px_rgba(255,210,31,0.3)]">Facturation</span>
            </h1>
            <p className="text-[10px] md:text-xs font-bold text-white/30 uppercase tracking-[0.2em] md:tracking-[0.3em] mt-3 md:mt-4">Gestion des flux • Audit Financier</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all duration-500"
          >
            <Download size={14} /> Export Flux
          </button>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-padel-blue text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500"
          >
            <Plus size={18} /> Nouvelle Facture
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: 'Chiffre d\'Affaire', val: stats?.totalAmount || 0, icon: Euro, color: 'blue', desc: 'Total' },
          { label: 'Factures Payées', val: stats?.paidAmount || 0, icon: CheckCircle2, color: 'green', desc: 'Validées' },
          { label: 'Impayés / Attente', val: stats?.unpaidAmount || 0, icon: Clock, color: 'yellow', desc: 'À recouvrir' },
          { label: 'Flux Annulés', val: stats?.cancelledAmount || 0, icon: AlertCircle, color: 'red', desc: 'Audit' }
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="bg-[#151518]/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-padel-blue/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className={cn(
                "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border transition-all duration-500",
                kpi.color === 'blue' ? "bg-padel-blue/10 border-padel-blue/20 text-padel-blue group-hover:bg-padel-blue group-hover:text-white" :
                  kpi.color === 'green' ? "bg-green-500/10 border-green-500/20 text-green-500 group-hover:bg-green-500 group-hover:text-white" :
                    kpi.color === 'yellow' ? "bg-padel-yellow/10 border-padel-yellow/20 text-padel-yellow group-hover:bg-padel-yellow group-hover:text-padel-blue" :
                      "bg-red-500/10 border-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-white"
              )}>
                <kpi.icon size={18} className="md:w-6 md:h-6" />
              </div>
              {kpi.desc && (
                <span className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">{kpi.desc}</span>
              )}
            </div>
            <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] mb-1.5 md:mb-2">{kpi.label}</p>
            <p className="text-xl md:text-3xl font-black text-white tracking-tighter group-hover:text-padel-blue transition-colors duration-500 truncate">
              {kpi.val.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            </p>
          </motion.div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-[#151518]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-3xl">
        <div className="p-6 md:p-10 border-b border-white/5 flex flex-col xl:flex-row items-center justify-between gap-6 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-padel-blue/10 flex items-center justify-center border border-padel-blue/20">
              <FileText size={18} className="text-padel-blue" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] md:tracking-[0.4em]">Registre des Factures</h3>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Flux financier en temps réel</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
            <div className="relative group w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-padel-blue transition-colors" size={14} />
              <input
                type="text"
                placeholder="Numéro, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[10px] font-bold text-white focus:outline-none focus:border-padel-blue/40 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(['ALL', 'PAID', 'UNPAID', 'CANCELLED'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all",
                    statusFilter === status
                      ? "bg-padel-blue border-padel-blue text-white shadow-lg"
                      : "bg-white/5 border-white/10 text-white/30 hover:bg-white/10"
                  )}
                >
                  {status === 'ALL' ? 'Toutes' : status === 'PAID' ? 'Payées' : status === 'UNPAID' ? 'Impayées' : 'Annulées'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em] text-left border-b border-white/5 whitespace-nowrap">
                <th className="px-6 md:px-10 py-6 md:py-8">Facture</th>
                <th className="px-4 md:px-8 py-6 md:py-8">Client</th>
                <th className="px-4 md:px-8 py-6 md:py-8">Montant</th>
                <th className="px-4 md:px-8 py-6 md:py-8 hidden lg:table-cell">Échéance</th>
                <th className="px-4 md:px-8 py-6 md:py-8">Statut</th>
                <th className="px-6 md:px-10 py-6 md:py-8 text-right">Contrôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="animate-spin text-padel-blue mx-auto mb-4" size={32} />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Audit des flux...</p>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">Aucune facture trouvée</td>
                </tr>
              ) : (
                filteredInvoices.map((inv, idx) => (
                  <motion.tr
                    key={inv._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="hover:bg-white/[0.03] transition-all group"
                  >
                    <td className="px-6 md:px-10 py-6 md:py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-padel-blue/50 transition-colors">
                          <Receipt size={16} className="text-white/40 group-hover:text-padel-blue transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white group-hover:text-padel-blue transition-colors tracking-tighter uppercase">{inv.number}</p>
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">
                            {new Date(inv.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-6 md:py-8">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-black text-white tracking-tighter uppercase">{inv.client}</p>
                        <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest truncate max-w-[150px]">{inv.email || 'Pas d\'email'}</p>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-6 md:py-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm md:text-lg font-black text-white tracking-tighter">{inv.amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</span>
                        <span className="text-[10px] font-black text-white/20">€</span>
                      </div>
                    </td>
                    <td className="px-4 md:px-8 py-6 md:py-8 hidden lg:table-cell">
                      {inv.dueDate ? (
                        <div className="flex items-center gap-2 text-white/40">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold tracking-widest">{new Date(inv.dueDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-white/10 tracking-widest uppercase">Non définie</span>
                      )}
                    </td>
                    <td className="px-4 md:px-8 py-6 md:py-8">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest",
                        inv.status === 'PAID' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                          inv.status === 'UNPAID' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
                            "bg-red-500/10 border-red-500/20 text-red-500"
                      )}>
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full animate-pulse",
                          inv.status === 'PAID' ? "bg-green-500" :
                            inv.status === 'UNPAID' ? "bg-yellow-500" :
                              "bg-red-500"
                        )} />
                        {inv.status === 'PAID' ? 'PAYÉE' : inv.status === 'UNPAID' ? 'EN ATTENTE' : 'ANNULÉE'}
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(inv)}
                          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-padel-blue hover:border-padel-blue transition-all flex items-center justify-center p-0"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: inv._id, number: inv.number })}
                          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-red-500 hover:border-red-500 transition-all flex items-center justify-center p-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-[#151518] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#151518]/90 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-padel-blue/10 flex items-center justify-center border border-padel-blue/20">
                    <Receipt size={24} className="text-padel-blue" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                      {editingInvoice ? 'Modifier la Facture' : 'Nouvelle Facture'}
                    </h2>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                      {editingInvoice ? `Reference: ${editingInvoice.number}` : 'Génération du registre financier'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Client Info */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-padel-blue uppercase tracking-[0.3em] flex items-center gap-3">
                      <Users size={14} /> Informations Client
                    </h4>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="Nom du Client *"
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-padel-blue outline-none text-sm font-bold uppercase"
                      required
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email (Options)"
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-padel-blue outline-none text-sm font-bold"
                    />
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Adresse Postale"
                      rows={2}
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-padel-blue outline-none text-sm font-bold resize-none"
                    />
                  </div>

                  {/* Invoice Metadata */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-padel-blue uppercase tracking-[0.3em] flex items-center gap-3">
                      <Calendar size={14} /> Calendrier & Statut
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Date Facture</label>
                        <PremiumDatePicker
                          value={formData.date}
                          onChange={(val) => setFormData({ ...formData, date: val })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Date Échéance</label>
                        <PremiumDatePicker
                          value={formData.dueDate}
                          onChange={(val) => setFormData({ ...formData, dueDate: val })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Statut Paiement</label>
                      <PremiumSelect
                        value={formData.status}
                        onChange={(val) => setFormData({ ...formData, status: val as any })}
                        options={[
                          { value: 'PAID', label: 'PAYÉE' },
                          { value: 'UNPAID', label: 'EN ATTENTE' },
                          { value: 'CANCELLED', label: 'ANNULÉE' }
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-padel-blue uppercase tracking-[0.3em] flex items-center gap-3">
                      <FileText size={14} /> Détails de la Prestation
                    </h4>
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-padel-blue uppercase tracking-widest hover:bg-padel-blue hover:text-white transition-all"
                    >
                      + Ajouter un Item
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.items.length === 0 ? (
                      <div className="py-12 border border-dashed border-white/10 rounded-2xl text-center">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Aucun item ajouté</p>
                      </div>
                    ) : (
                      formData.items.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5 group/item relative">
                          <div className="flex-[3]">
                            <input
                              value={item.description}
                              onChange={(e) => updateItem(index, 'description', e.target.value)}
                              placeholder="Description..."
                              className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm font-bold focus:border-padel-blue outline-none"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                              placeholder="Qté"
                              className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm font-bold focus:border-padel-blue outline-none"
                              min="1"
                              required
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                              placeholder="Prix HT"
                              className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm font-bold focus:border-padel-blue outline-none"
                              step="0.01"
                              required
                            />
                          </div>
                          <div className="flex items-center justify-center font-black text-padel-yellow text-sm min-w-[60px]">
                            {(item.price * item.quantity).toFixed(2)}€
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-red-500/20 text-red-500 border border-red-500/20 opacity-0 group-hover/item:opacity-100 transition-all flex items-center justify-center"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Summary & Actions */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="bg-white/5 px-8 py-6 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Total Général (TTC)</p>
                    <p className="text-3xl font-black text-padel-yellow tracking-tighter">
                      {calculateTotal().toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </p>
                  </div>

                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 md:flex-none px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] md:flex-none px-12 py-5 rounded-2xl bg-padel-blue text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-3xl shadow-padel-blue/30 hover:bg-padel-yellow hover:text-padel-blue transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      {editingInvoice ? 'Mettre à jour' : 'Enregistrer Facture'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title="Supprimer la facture ?"
        message={`Attention : vous allez supprimer définitivement la facture ${deleteModal.number}. Cette opération impactera vos audits financiers.`}
        isLoading={isSubmitting}
      />
    </motion.div>
  );
}
