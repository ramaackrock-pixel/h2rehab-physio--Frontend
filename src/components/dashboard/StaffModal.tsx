import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Phone, Briefcase, Building2 } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (staff: any) => void;
  staff?: any;
}

export default function StaffModal({ isOpen, onClose, onSave, staff }: StaffModalProps) {
  const { branches } = useAppData();
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    mobile: '',
    role: 'Physiotherapist',
    department: 'Physiotherapy',
    branch: branches[0]?.name || '',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=newstaff',
    scheduleDays: [],
    shift: 'Morning',
    workingHours: '09:00 AM - 05:00 PM'
  });

  const DAYS = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

  useEffect(() => {
    if (isOpen) {
      if (staff) {
        setFormData({
          ...staff,
          scheduleDays: staff.scheduleDays || [],
          shift: staff.shift || 'Morning',
          workingHours: staff.workingHours || '09:00 AM - 05:00 PM'
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
          avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
          scheduleDays: [],
          shift: 'Morning',
          workingHours: '09:00 AM - 05:00 PM'
        });
      }
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
    
    setFormData((prev: any) => ({ ...prev, [name]: value }));
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
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">{staff ? 'Edit Staff Member' : 'Add New Staff Member'}</h2>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors bg-slate-50 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  >
                    <option>Physiotherapist</option>
                    <option>Senior Consultant</option>
                    <option>Nurse</option>
                    <option>Admin / Receptionist</option>
                  </select>
                </div>
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
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  >
                    <option>Physiotherapy</option>
                    <option>Administration</option>
                    <option>Nursing</option>
                    <option>General Medicine</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-700 mb-4">Schedule Details</h3>
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
                            ? 'bg-teal-600 text-white'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
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
              <span>{staff ? 'Save Changes' : 'Add Member'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
