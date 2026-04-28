import React, { useState, useEffect } from 'react';
import { X, Save, User, CreditCard, Building2 } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import type { InvoiceStatus } from '@/types/billing';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: any) => void;
}

export default function InvoiceModal({ isOpen, onClose, onSave }: InvoiceModalProps) {
  const { patients, branches } = useAppData();
  const [formData, setFormData] = useState<any>({
    patientName: '',
    totalAmount: 0,
    paidAmount: 0,
    status: 'PENDING' as InvoiceStatus,
    branch: branches[0]?.name || ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        patientName: '',
        totalAmount: 0,
        paidAmount: 0,
        status: 'PENDING',
        branch: branches[0]?.name || ''
      });
    }
  }, [isOpen, branches]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ 
      ...prev, 
      [name]: (name === 'totalAmount' || name === 'paidAmount') ? parseFloat(value) : value 
    }));
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value;
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setFormData((prev: any) => ({
        ...prev,
        patientId: patient.id,
        patientName: patient.name
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Create New Invoice</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors bg-slate-50 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Patient</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  name="patientId"
                  value={formData.patientId || ''}
                  onChange={handlePatientChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  required
                >
                  <option value="">Select a patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.pid || p.id})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Amount (₹)</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Paid Amount (₹)</label>
                <input
                  type="number"
                  name="paidAmount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                >
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PARTIALLY PAID">PARTIAL</option>
                  <option value="OVERDUE">OVERDUE</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Branch</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 font-bold text-white bg-[#5ab2b2] hover:bg-[#439c9c] rounded-xl transition-colors text-sm shadow-lg shadow-teal-500/20"
            >
              <Save size={18} />
              <span>Create Invoice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
