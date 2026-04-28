import React, { useState, useEffect } from 'react';
import { X, Save, Clock, User, Building2, Calendar } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import type { Appointment } from '@/types/appointment';

interface AppointmentModalProps {
  appointment?: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: any) => void;
}

export default function AppointmentModal({ appointment, isOpen, onClose, onSave }: AppointmentModalProps) {
  const { patients, doctors, branches } = useAppData();
  const [formData, setFormData] = useState<any>({
    time: '09:00 AM',
    duration: '45 mins',
    appointmentDate: new Date().toISOString().split('T')[0],
    patientName: '',
    patientId: '',
    therapist: '',
    therapistId: '',
    branch: branches[0]?.name || '',
    sessionType: 'Initial Consult',
    status: 'PENDING',
    details: {
      phone: '',
      email: '',
      lastVisit: '',
      condition: '',
      nextSteps: ''
    }
  });

  useEffect(() => {
    if (appointment) {
      const dateStr = appointment.appointmentDate || appointment.date;
      const formattedDate = dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
      setFormData({ ...appointment, appointmentDate: formattedDate });
    } else {
      setFormData({
        time: '09:00 AM',
        duration: '45 mins',
        appointmentDate: new Date().toISOString().split('T')[0],
        patientName: '',
        patientId: '',
        therapist: '',
        therapistId: '',
        branch: branches[0]?.name || '',
        sessionType: 'Initial Consult',
        status: 'PENDING',
        details: {
          phone: '',
          email: '',
          lastVisit: '',
          condition: '',
          nextSteps: ''
        }
      });
    }
  }, [appointment, isOpen, doctors]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('details.')) {
      const field = name.split('.')[1];
      setFormData((prev: any) => ({
        ...prev,
        details: { ...prev.details, [field]: value }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientName = e.target.value;
    const patient = patients.find(p => p.name === patientName);
    if (patient) {
      setFormData((prev: any) => ({
        ...prev,
        patientName,
        patientId: patient.id,
        details: {
          ...prev.details,
          phone: patient.contact,
          lastVisit: patient.lastVisit
        }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, patientName, patientId: '' }));
    }
  };

  const handleTherapistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const therapistName = e.target.value;
    const doctor = doctors.find(d => d.name === therapistName);
    if (doctor) {
      setFormData((prev: any) => ({
        ...prev,
        therapist: therapistName,
        therapistId: doctor.id
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, therapist: therapistName, therapistId: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      therapistName: formData.therapist
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {appointment ? 'Edit Appointment' : 'Book New Appointment'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors bg-slate-50 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Patient</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  name="patientName"
                  value={formData.patientName}
                  onChange={handlePatientChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  required
                >
                  <option value="">Select a patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.pid || p.id})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="09:00 AM"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="45 mins"
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                required
              />
            </div>


            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Therapist</label>
              <select
                name="therapist"
                value={formData.therapist}
                onChange={handleTherapistChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
                required
              >
                <option value="">Select therapist...</option>
                {doctors.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.role || s.specialization})</option>
                ))}
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

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Session Type</label>
              <select
                name="sessionType"
                value={formData.sessionType}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
              >
                <option>Initial Consult</option>
                <option>Follow-up</option>
                <option>Treatment</option>
                <option>Assessment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Condition Details</label>
              <textarea
                name="details.condition"
                value={formData.details.condition}
                onChange={handleChange}
                rows={2}
                placeholder="Patient complains of lower back pain..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Next Steps / Notes</label>
              <textarea
                name="details.nextSteps"
                value={formData.details.nextSteps}
                onChange={handleChange}
                rows={2}
                placeholder="Schedule follow-up in 2 weeks..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-8 border-t border-slate-100">
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
              <span>{appointment ? 'Update Appointment' : 'Book Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
