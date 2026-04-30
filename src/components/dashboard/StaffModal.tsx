import React, { useState, useEffect, useRef } from 'react';
import { X, Save, User, Mail, Phone, Briefcase, Building2, Calendar, CreditCard, FileText, Upload } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: any) => void;
  staff?: any;
}

export default function StaffModal({ isOpen, onClose, onSave, staff }: StaffModalProps) {
  const { branches } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    mobile: '',
    role: 'Physiotherapist',
    department: 'Physiotherapy',
    branch: branches[0]?.name || '',
    status: 'Active',
    avatar: '',
    scheduleDays: [],
    shift: 'Morning',
    workingHours: '09:00 AM - 05:00 PM',
    joiningDate: new Date().toISOString().split('T')[0],
    aadharNumber: '',
    degreeCertificate: null as File | string | null
  });

  const [aadharError, setAadharError] = useState('');

  const DAYS = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

  useEffect(() => {
    if (isOpen) {
      if (staff) {
        setFormData({
          ...staff,
          scheduleDays: staff.scheduleDays || [],
          shift: staff.shift || 'Morning',
          workingHours: staff.workingHours || '09:00 AM - 05:00 PM',
          joiningDate: staff.joiningDate || new Date().toISOString().split('T')[0],
          aadharNumber: staff.aadharNumber || '',
          degreeCertificate: staff.degreeCertificate || null
        });
      } else {
        setFormData({
          name: '',
          email: '',
          mobile: '',
          role: 'Physiotherapist',
          department: 'Physiotherapy',
          branch: branches[0]?.name || '',
          status: 'Active',
          avatar: '',
          scheduleDays: [],
          shift: 'Morning',
          workingHours: '09:00 AM - 05:00 PM',
          joiningDate: new Date().toISOString().split('T')[0],
          aadharNumber: '',
          degreeCertificate: null
        });
      }
      setAadharError('');
    }
  }, [isOpen, branches, staff]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'mobile') {
      const numericValue = value.replace(/[^\d]/g, '').substring(0, 10);
      setFormData((prev: any) => ({ ...prev, [name]: numericValue }));
      return;
    }

    if (name === 'aadharNumber') {
      const numericValue = value.replace(/[^\d]/g, '').substring(0, 12);
      setFormData((prev: any) => ({ ...prev, [name]: numericValue }));
      if (numericValue.length > 0 && numericValue.length < 12) {
        setAadharError('Aadhar number must be 12 digits');
      } else {
        setAadharError('');
      }
      return;
    }
    
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev: any) => ({ ...prev, degreeCertificate: e.target.files![0] }));
    }
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev: any) => {
      const days = prev.scheduleDays || [];
      if (days.includes(day)) {
        return { ...prev, scheduleDays: days.filter((d: string) => d !== day) };
      } else {
        return { ...prev, scheduleDays: [...days, day] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.aadharNumber && formData.aadharNumber.length !== 12) {
      setAadharError('Aadhar number must be 12 digits');
      return;
    }

    // Create FormData for file upload
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'scheduleDays') {
        formData.scheduleDays.forEach((day: string) => data.append('scheduleDays[]', day));
      } else if (key === 'degreeCertificate') {
        if (formData[key] instanceof File) {
          data.append('degreeCertificate', formData[key]);
        } else if (formData[key]) {
          data.append('degreeCertificate', formData[key]);
        }
      } else {
        data.append(key, formData[key]);
      }
    });

    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{staff ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors bg-slate-50 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest">Basic Information</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="9XXXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Aadhar Number</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    placeholder="12 Digit Aadhar Number"
                    className={`w-full bg-slate-50 border ${aadharError ? 'border-red-400' : 'border-slate-200'} text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all`}
                  />
                </div>
                {aadharError && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{aadharError}</p>}
              </div>
            </div>

            {/* Employment Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest">Employment Details</h3>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date of Joining</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  >
                    <option>Physiotherapist</option>
                    <option>Senior Consultant</option>
                    <option>Nurse</option>
                    <option>Admin / Receptionist</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Branch</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Degree Certificate</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer group"
                >
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-slate-300 group-hover:text-teal-500 transition-colors" />
                    <div className="flex text-sm text-slate-600">
                      <span className="relative rounded-md font-bold text-teal-600 hover:text-teal-700">
                        {formData.degreeCertificate instanceof File ? formData.degreeCertificate.name : 
                         formData.degreeCertificate ? 'Certificate Uploaded' : 'Upload certificate'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">PDF, PNG, JPG up to 5MB</p>
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,image/*"
                  />
                </div>
                {formData.degreeCertificate && typeof formData.degreeCertificate === 'string' && (
                   <a href={formData.degreeCertificate} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 mt-2 text-[10px] font-bold text-teal-600 hover:underline">
                     <FileText size={12} />
                     <span>View Current Certificate</span>
                   </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-4">Schedule Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Working Days</label>
                <div className="flex items-center gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                        formData.scheduleDays?.includes(day)
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                          : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shift</label>
                  <select
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  >
                    <option>Morning</option>
                    <option>Evening</option>
                    <option>Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Working Hours</label>
                  <input
                    type="text"
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleChange}
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

        </form>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 p-6 border-t border-slate-100 shrink-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => formRef.current?.requestSubmit()}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-2.5 font-bold text-white bg-[#5ab2b2] hover:bg-[#439c9c] rounded-xl transition-colors text-sm shadow-lg shadow-teal-500/20"
          >
            <Save size={18} />
            <span>{staff ? 'Save Changes' : 'Add Staff'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


