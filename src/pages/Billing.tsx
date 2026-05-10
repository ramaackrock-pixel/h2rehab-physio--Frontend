import { useState } from 'react';
import { Layout } from '../components/Layout';
import {
  Search,
  ChevronDown,
  Calendar,
  MoreVertical,
  Banknote,
  ClipboardCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  UserPlus,
  Lock
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import type { InvoiceStatus } from '../types/billing';
import InvoiceModal from '@/components/dashboard/InvoiceModal';
import { useSearch } from '@/context/SearchContext';
import { useAuth } from '@/context/AuthContext';
import { generateInvoicePDF } from '@/utils/pdfGenerator';

const ITEMS_PER_PAGE = 5;

export function Billing() {
  const { searchQuery } = useSearch();
  const { invoices: invoicesData, addInvoice, updateInvoice, branches, patients } = useAppData();
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'All'>('All');
  const [branchFilter, setBranchFilter] = useState('All Branches');
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  if (isStaff) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 text-slate-400">
            <Lock size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Access Restricted</h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Billing and invoice management is only accessible to administrative roles. 
            If you believe this is an error, please contact your clinic administrator.
          </p>
        </div>
      </Layout>
    );
  }

  const totalRevenue = invoicesData.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalPending = invoicesData.reduce((sum, inv) => sum + (inv.dueAmount || 0), 0);
  const activeInvoicesCount = invoicesData.filter(i => i.status !== 'PAID').length;

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, iconName: 'Banknote', variant: 'primary', trend: '+12.5%' },
    { title: 'Pending Amount', value: `₹${totalPending.toLocaleString('en-IN')}`, iconName: 'AlertCircle', variant: 'danger', subtext: `${invoicesData.filter(i => i.status === 'OVERDUE').length} overdue invoices` },
    { title: 'Active Invoices', value: activeInvoicesCount.toString(), iconName: 'ClipboardCheck', variant: 'secondary', subtext: 'Invoices needing action' }
  ];

  const filteredInvoices = invoicesData.filter(invoice => {
    const activeSearch = searchTerm || searchQuery;
    const patientName = invoice.patientName || '';
    const matchesSearch = 
      patientName.toLowerCase().includes(activeSearch.toLowerCase()) ||
      invoice.id.toLowerCase().includes(activeSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    
    const patient = patients.find(p => p.id === invoice.patientId || p.id === invoice.pid || p.name === invoice.patientName);
    const invoiceBranch = invoice.branch || patient?.branch;
    const matchesBranch = branchFilter === 'All Branches' || invoiceBranch === branchFilter;
    
    const invoiceDate = new Date(invoice.date || invoice.createdAt || new Date());
    const now = new Date();
    let matchesTime = true;

    if (timeFilter === 'Last 7 Days') {
      const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      matchesTime = invoiceDate >= sevenDaysAgo;
    } else if (timeFilter === 'Last 30 Days') {
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      matchesTime = invoiceDate >= thirtyDaysAgo;
    } else if (timeFilter === 'Last 3 Months') {
      const threeMonthsAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      matchesTime = invoiceDate >= threeMonthsAgo;
    }
    
    return matchesSearch && matchesStatus && matchesBranch && matchesTime;
  });

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE) || 1;
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusUpdate = (id: string, newStatus: InvoiceStatus) => {
    const invoice = invoicesData.find(inv => inv.id === id);
    if (!invoice) return;

    let paidAmount = invoice.paidAmount;
    let dueAmount = invoice.dueAmount;

    if (newStatus === 'PAID') {
      paidAmount = invoice.totalAmount;
      dueAmount = 0;
    } else if (newStatus === 'PENDING' || newStatus === 'OVERDUE') {
      paidAmount = 0;
      dueAmount = invoice.totalAmount;
    } else if (newStatus === 'PARTIALLY PAID') {
      paidAmount = invoice.totalAmount * 0.4;
      dueAmount = invoice.totalAmount * 0.6;
    }

    updateInvoice({ ...invoice, status: newStatus, paidAmount, dueAmount });
    setActiveMenuId(null);
  };

  const handleSaveInvoice = (data: any) => {
    addInvoice(data);
    setIsModalOpen(false);
  };

  const getStatusStyles = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'OVERDUE':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'PENDING':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'PARTIALLY PAID':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Banknote': return <Banknote size={20} />;
      case 'ClipboardCheck': return <ClipboardCheck size={20} />;
      case 'AlertCircle': return <AlertCircle size={20} />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Billing</h1>
            <p className="text-slate-500 mt-1">Manage invoices and payments</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#5ab2b2] hover:bg-[#4a9f9f] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/20 active:scale-95 group"
          >
            <UserPlus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Create Invoice</span>
          </button>
        </div>

        <InvoiceModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInvoice}
        />

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
            >
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">{stat.title}</p>
                <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
                {stat.trend && (
                  <div className="flex items-center space-x-1 text-teal-500 text-xs font-bold">
                    <TrendingUp size={14} />
                    <span>{stat.trend}</span>
                  </div>
                )}
                {stat.subtext && (
                  <p className="text-xs font-medium text-slate-400">{stat.subtext}</p>
                )}
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${stat.variant === 'primary' ? 'bg-teal-50 text-teal-500 group-hover:bg-teal-500 group-hover:text-white' :
                stat.variant === 'secondary' ? 'bg-teal-50 text-teal-500 group-hover:bg-teal-500 group-hover:text-white' :
                  stat.variant === 'accent' ? 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' :
                    'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white'
                }`}>
                {getIcon(stat.iconName)}
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Table Container */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-4 md:p-6 border-b border-slate-50 flex flex-col xl:flex-row gap-4 items-center justify-between bg-slate-50/30">
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full xl:w-auto">
              <div className="relative w-full md:w-80 group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5ab2b2] transition-colors" />
                <input
                  type="text"
                  placeholder="Search by patient..."
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#5ab2b2] transition-all"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full md:w-40 group">
                  <select
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#5ab2b2] pr-10 cursor-pointer transition-all"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                  >
                    <option value="All">Status: All</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="PARTIALLY PAID">Partial</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform duration-300 group-focus-within:rotate-180" />
                </div>

                <div className="relative w-full md:w-44 group">
                  <div className="relative">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      value={timeFilter}
                      onChange={(e) => { setTimeFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-11 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#5ab2b2] cursor-pointer transition-all"
                    >
                      <option value="All Time">All Time</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="Last 3 Months">Last 3 Months</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="relative w-full md:w-44 group">
                  <select 
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-[#5ab2b2] pr-10 cursor-pointer transition-all"
                    value={branchFilter}
                    onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="All Branches">All Branches</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('All'); setBranchFilter('All Branches'); setCurrentPage(1); }}
              className="text-teal-600 text-sm font-bold hover:text-teal-700 transition-colors whitespace-nowrap px-2"
            >
              Clear Filters
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#e0f4f4] text-[10px] uppercase tracking-wider text-slate-600 font-bold">
                  <th className="px-6 py-4 font-bold">Invoice ID</th>
                  <th className="px-6 py-4 font-bold">Patient Name</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Total Amount</th>
                  <th className="px-6 py-4 font-bold">Paid Amount</th>
                  <th className="px-6 py-4 font-bold">Due Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/80 transition-colors group border-b border-slate-50 last:border-0 relative">
                    <td className="px-6 py-5">
                      <button 
                        onClick={() => generateInvoicePDF(invoice)}
                        className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline underline-offset-4 transition-all text-left"
                      >
                        {invoice.id}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[11px] ring-2 ring-white shadow-sm ${invoice.initialsBg}`}>
                          {invoice.initials}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{invoice.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500 font-medium">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-700">
                      ₹{invoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500">
                      ₹{invoice.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`px-6 py-5 text-sm font-bold ${invoice.dueAmount > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                      ₹{invoice.dueAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right relative">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === invoice.id ? null : invoice.id);
                          }}
                          className={`p-2 rounded-lg transition-all ${activeMenuId === invoice.id ? 'bg-[#5ab2b2] text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                        >
                          <MoreVertical size={18} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === invoice.id && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[100] p-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                            <div className="px-4 py-2 border-b border-slate-50 mb-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</p>
                            </div>
                            
                            <button 
                              onClick={(e) => { e.stopPropagation(); generateInvoicePDF(invoice); setActiveMenuId(null); }}
                              className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-teal-600 rounded-xl transition-all"
                            >
                              <Download size={16} />
                              <span>Download PDF</span>
                            </button>

                            <div className="px-4 py-2 border-y border-slate-50 my-1 bg-slate-50/50">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Change Status</p>
                            </div>

                            <button 
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(invoice.id, 'PAID'); }}
                              className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-bold text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                            >
                              <div className="flex items-center space-x-3">
                                <CheckCircle2 size={16} />
                                <span>Mark as Paid</span>
                              </div>
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(invoice.id, 'PENDING'); }}
                              className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-bold text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                            >
                              <div className="flex items-center space-x-3">
                                <Clock size={16} />
                                <span>Mark as Pending</span>
                              </div>
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(invoice.id, 'PARTIALLY PAID'); }}
                              className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <div className="flex items-center space-x-3">
                                <Receipt size={16} />
                                <span>Mark as Partial</span>
                              </div>
                            </button>

                            <button 
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(invoice.id, 'OVERDUE'); }}
                              className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <div className="flex items-center space-x-3">
                                <AlertTriangle size={16} />
                                <span>Mark as Overdue</span>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-400 text-center sm:text-left">
              Showing {paginatedInvoices.length} of {filteredInvoices.length} entries
            </p>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white hover:text-teal-600 transition-all shadow-sm disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-all border ${
                    currentPage === page 
                      ? 'bg-teal-600 text-white ring-2 ring-teal-500/20 border-transparent' 
                      : 'text-slate-600 hover:bg-white border-transparent hover:border-slate-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white hover:text-teal-600 transition-all shadow-sm disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
