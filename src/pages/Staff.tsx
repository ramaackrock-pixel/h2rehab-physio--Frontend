import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import {
  UserPlus,
  Search,
  ChevronDown,
  MoreVertical,
  Calendar,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Activity,
  Receipt,
  Lock,
  Pencil,
  Trash2,
  Plus,
  X,
  FileText
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

import type { StaffTab, AttendanceStatus, ShiftType } from '../types/staff';
import StaffModal from '@/components/dashboard/StaffModal';
import { useSearch } from '@/context/SearchContext';
import { apiService } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import { generatePayrollPDF } from '@/utils/pdfGenerator';

export function Staff() {
  const { addStaff, updateStaff, deleteStaff } = useAppData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<StaffTab>('List');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  const handleSaveStaff = (data: any) => {
    if (editingStaff) {
      updateStaff(data);
    } else {
      addStaff(data);
    }
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'List': return <StaffListView onEdit={(staff: any) => { setEditingStaff(staff); setIsModalOpen(true); }} onDelete={(id: string) => { if (confirm('Are you sure you want to delete this staff member?')) deleteStaff(id); }} />;
      case 'Attendance': return <AttendanceView />;
      case 'Schedules': return <SchedulesView onEdit={(staff: any) => { setEditingStaff(staff); setIsModalOpen(true); }} />;
      case 'Payroll': return <PayrollView />;
      default: return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Staff</h1>
            <p className="text-slate-500 mt-1">Manage clinic staff and operations</p>
          </div>
          <button
            onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#5ab2b2] hover:bg-[#4a9f9f] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/20 active:scale-95 group"
          >
            <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
            <span>Add Staff</span>
          </button>
        </div>

        <StaffModal
          isOpen={isModalOpen}
          staff={editingStaff}
          onClose={() => { setIsModalOpen(false); setEditingStaff(null); }}
          onSave={handleSaveStaff}
        />

        {/* Custom Tabs */}
        <div className="bg-slate-100/50 p-1.5 rounded-2xl inline-flex flex-wrap md:flex-nowrap gap-1 border border-slate-200/50">
          {(['List', 'Attendance', 'Schedules', 'Payroll'] as StaffTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); }}
              className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                ? 'bg-white text-teal-600 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              Staff {tab === 'List' ? 'List' : tab}
            </button>
          ))}
        </div>

        {/* Dynamic View */}
        {activeTab === 'Payroll' && user?.role !== 'superadmin' ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Lock size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Restricted Access</h3>
            <p className="text-slate-500 mt-2">You do not have permission to view payroll information.</p>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
    </Layout>
  );
}

function StaffListView({ onEdit, onDelete }: { onEdit: (staff: any) => void, onDelete: (id: string) => void }) {
  const { searchQuery } = useSearch();
  const { staff: allStaff, branches } = useAppData();
  const [localSearch, setLocalSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('Branch: All');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const staff = allStaff.filter(s => {
    const activeSearch = localSearch || searchQuery;
    const matchesSearch = s.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(activeSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(activeSearch.toLowerCase());
    
    const matchesBranch = branchFilter === 'Branch: All' || s.branch === branchFilter;
    const matchesStatus = statusFilter === 'Status: All' || s.status === statusFilter;
    
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const totalPages = Math.ceil(staff.length / ITEMS_PER_PAGE) || 1;
  const paginatedStaff = staff.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="p-4 md:p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full lg:w-80 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={localSearch}
              onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-44 group">
              <select 
                value={branchFilter}
                onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none cursor-pointer pr-10"
              >
                <option value="Branch: All">Branch: All</option>
                {branches.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative w-full sm:w-44 group">
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none cursor-pointer pr-10"
              >
                <option value="Status: All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <button 
          onClick={() => { setLocalSearch(''); setBranchFilter('Branch: All'); setStatusFilter('Status: All'); setCurrentPage(1); }}
          className="text-teal-600 text-[10px] font-bold uppercase tracking-widest hover:text-teal-700 font-bold flex items-center space-x-2 mt-2 lg:mt-0"
        >
          <Filter size={14} />
          <span>Clear Filters</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f2fafa] text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
              <th className="px-6 py-4">Staff Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Branch</th>
              <th className="px-6 py-4">Joining Date</th>
              <th className="px-6 py-4">Aadhar Number</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedStaff.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-3">
                    <img src={member.avatar || undefined} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-400">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${member.role.includes('Senior') ? 'bg-teal-50 text-teal-600' :
                    member.role.includes('Nurse') ? 'bg-teal-50 text-teal-600' :
                      member.role.includes('Admin') ? 'bg-slate-50 text-slate-600' :
                        'bg-teal-50 text-teal-600'
                    }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-slate-600 font-medium">{member.department}</td>
                <td className="px-6 py-5 text-sm text-slate-600 font-medium">{member.branch}</td>
                <td className="px-6 py-5 text-sm text-slate-600 font-bold">{member.joiningDate || '-'}</td>
                <td className="px-6 py-5 text-sm text-slate-500 font-medium tracking-wider">{member.aadharNumber || '-'}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-teal-500' : 'bg-slate-300'}`} />
                    <span className={`text-[11px] font-bold ${member.status === 'Active' ? 'text-teal-600' : 'text-slate-400'}`}>
                      {member.status}
                    </span>
                  </div>
                  {member.degreeCertificate && (
                    <a 
                      href={member.degreeCertificate} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 mt-1 text-[9px] font-black text-teal-600 hover:underline uppercase"
                    >
                      <FileText size={10} />
                      <span>Certificate</span>
                    </a>
                  )}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => onEdit(member)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(member.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">Showing {paginatedStaff.length} of {staff.length} staff members</p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg font-bold text-xs transition-all border ${currentPage === page
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
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function AttendanceView() {
  const { staff: allStaff, updateStaff, branches } = useAppData();
  const [branchFilter, setBranchFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const todayStr = new Date().toISOString().split('T')[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'presented today': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'checked in': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const handleCheckIn = (member: any) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => saveCheckIn(member, `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
        (err) => saveCheckIn(member, "Location denied"),
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      saveCheckIn(member, "Not supported");
    }
  };

  const saveCheckIn = (member: any, locationStr: string) => {
    const logs = [...(member.attendanceLogs || [])];
    if (!logs.some((l: any) => l.date === todayStr)) {
      logs.push({
        date: todayStr,
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'checked in',
        location: locationStr
      });
      updateStaff({ ...member, attendanceLogs: logs });
    }
  };

  const handleCheckOut = (member: any) => {
    if (!confirm('Proceed with Check Out?')) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => saveCheckOut(member, `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
        (err) => saveCheckOut(member, "Location denied"),
        { timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      saveCheckOut(member, "Not supported");
    }
  };

  const saveCheckOut = (member: any, locationStr: string) => {
    const logs = [...(member.attendanceLogs || [])];
    const idx = logs.findIndex((l: any) => l.date === todayStr);
    if (idx > -1) {
      logs[idx] = {
        ...logs[idx],
        checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'presented today',
        location: logs[idx].location && logs[idx].location !== locationStr
          ? `${logs[idx].location} (In) / ${locationStr} (Out)`
          : locationStr
      };
      updateStaff({ ...member, attendanceLogs: logs });
    }
  };

  const handleDeleteLog = (member: any) => {
    if (confirm('Are you sure you want to remove attendance for today?')) {
      const logs = (member.attendanceLogs || []).filter((l: any) => l.date !== todayStr);
      updateStaff({ ...member, attendanceLogs: logs });
    }
  };

  const filteredStaff = allStaff.filter(s => branchFilter === 'All' || s.branch === branchFilter);

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE) || 1;
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Attendance Filters */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-56 group">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
          <div className="relative w-full sm:w-64 group">
            <div className="relative">
              <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={branchFilter}
                onChange={(e) => { setBranchFilter(e.target.value); setCurrentPage(1); }}
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none cursor-pointer pr-10"
              >
                <option value="All">All Branches</option>
                {branches.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-50">
              <th className="px-6 py-4">Staff Name</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Check-in Time</th>
              <th className="px-6 py-4">Remarks</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedStaff.map((member) => {
              const dayLog = (member.attendanceLogs || []).find((l: any) => l.date === dateFilter);
              const status = dayLog ? dayLog.status : 'not checked in yet';

              return (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-all font-medium">
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <img src={member.avatar || undefined} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{member.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{member.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-bold">{dateFilter}</td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold ${getStatusBadge(status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${status === 'presented today' ? 'bg-teal-500' :
                        status === 'checked in' ? 'bg-blue-400' : 'bg-slate-400'
                        }`} />
                      <span>{status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-500 text-sm font-bold">{dayLog ? dayLog.checkInTime : '--'}</td>
                  <td className="px-6 py-5 text-slate-500 text-[10px] font-bold uppercase truncate max-w-[150px]" title={dayLog?.location}>{dayLog ? (dayLog.location || '--') : '--'}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      {dateFilter === todayStr && (
                        <>
                          {(!dayLog || dayLog.status === 'checked in') && (
                            <button
                              onClick={() => dayLog?.status === 'checked in' ? handleCheckOut(member) : handleCheckIn(member)}
                              className={`p-2 rounded-lg transition-all ${dayLog?.status === 'checked in'
                                ? 'bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white shadow-sm'
                                : 'bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white shadow-sm'
                                }`}
                              title={dayLog?.status === 'checked in' ? 'Check Out' : 'Check In'}
                            >
                              {dayLog?.status === 'checked in' ? <Clock size={16} /> : <Activity size={16} />}
                            </button>
                          )}
                          {dayLog && (
                            <button
                              onClick={() => handleDeleteLog(member)}
                              className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm"
                              title="Remove Log"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400">Showing {paginatedStaff.length} of {filteredStaff.length} staff members</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition-all border ${currentPage === page
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
              className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

function SchedulesView({ onEdit }: { onEdit: (staff: any) => void }) {
  const { staff: allStaff } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const getShiftBadge = (shift: string | undefined) => {
    switch (shift) {
      case 'Morning': return 'bg-teal-50 text-teal-600';
      case 'Evening': return 'bg-slate-100 text-slate-600';
      case 'Night': return 'bg-blue-50 text-blue-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const filteredStaff = allStaff.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE) || 1;
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 md:p-6 border-b border-slate-50 bg-slate-50/10 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:w-80 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search staff member..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
          />
        </div>

      </div>

      <div className="p-4 space-y-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-[#94a3b8] font-bold border-b border-slate-50">
              <th className="px-6 py-4">Staff Name</th>
              <th className="px-6 py-4">Shift</th>
              <th className="px-6 py-4 text-center">Working Hours</th>
              <th className="px-6 py-4">Assigned Branch</th>
              <th className="px-6 py-4 text-center">Days</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {paginatedStaff.map((sch) => (
              <tr key={sch.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-6 py-6">
                  <div className="flex items-center space-x-3">
                    <img src={sch.avatar || undefined} alt="" className="w-10 h-10 rounded-xl shadow-lg object-cover ring-2 ring-white" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{sch.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{sch.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-[10px] font-bold ${getShiftBadge(sch.shift)}`}>
                    <div className={`w-1 h-1 rounded-full ${sch.shift === 'Morning' ? 'bg-teal-400' :
                      sch.shift === 'Night' ? 'bg-blue-400' : 'bg-slate-400'
                      }`} />
                    <span>{sch.shift || 'Not Assigned'}</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm font-bold text-slate-700 text-center">{sch.workingHours || '-'}</td>
                <td className="px-6 py-6 text-sm text-slate-500 font-medium">{sch.branch}</td>
                <td className="px-6 py-6">
                  <div className="flex items-center justify-center space-x-1.5">
                    {['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'].map((day, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${(sch.scheduleDays || []).includes(day) ? 'bg-[#134e4a] text-white' : 'bg-slate-100 text-slate-300'
                          }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-6">
                  <button onClick={() => onEdit(sch)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">Showing {paginatedStaff.length} of {filteredStaff.length} staff members</p>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg font-bold text-xs transition-all border ${
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
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PayrollView() {
  const { staff: allStaff, updateStaff } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 5;

  const today = new Date();
  const [currentMonthStr, setCurrentMonthStr] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);

  const getMonthName = (yyyy_mm: string) => {
    const [y, m] = yyyy_mm.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const filteredStaff = allStaff.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const payrollData = filteredStaff.map(member => {
    const log = (member.payrollLogs || []).find((l: any) => l.month === currentMonthStr);
    if (!log) return null;
    return { ...member, ...log };
  }).filter(Boolean);

  const totalPages = Math.ceil(payrollData.length / ITEMS_PER_PAGE) || 1;
  const paginatedPayroll = payrollData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPayroll = payrollData.reduce((acc: any, curr: any) => acc + curr.netPay, 0);

  const handleExportPDF = (member: any) => {
    generatePayrollPDF(member, getMonthName(currentMonthStr));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <AddPayrollModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        currentMonth={currentMonthStr}
        staff={allStaff}
        updateStaff={updateStaff}
      />
      {/* Header Filters */}
      <div className="p-4 md:p-6 border-b border-slate-50 bg-slate-50/10 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-56 group">
            <input
              type="month"
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none cursor-pointer"
              value={currentMonthStr}
              onChange={(e) => { setCurrentMonthStr(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="relative w-full lg:w-64 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-teal-500 transition-all"
            />
          </div>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-teal-50 hover:bg-teal-100 text-teal-700 px-6 py-2.5 rounded-xl border border-teal-200 text-xs font-bold transition-all shadow-sm">
          <Plus size={16} />
          <span>Add Payroll</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-[#94a3b8] font-bold border-b border-slate-50">
              <th className="px-8 py-4">Staff Name</th>
              <th className="px-6 py-4 text-center">Days Present</th>
              <th className="px-6 py-4 text-right">Salary</th>
              <th className="px-6 py-4 text-right">Deductions</th>
              <th className="px-6 py-4 text-right">Bonus</th>
              <th className="px-6 py-4 text-right px-8">Net Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {paginatedPayroll.map((rec: any) => (
              <tr key={rec.id} onClick={() => handleExportPDF(rec)} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <td className="px-8 py-5">
                  <div className="flex items-center space-x-3">
                    <img src={rec.avatar || undefined} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm ring-2 ring-white" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{rec.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{rec.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm font-bold text-slate-700 text-center">{rec.daysPresent}</td>
                <td className="px-6 py-5 text-sm font-bold text-slate-700 text-right">
                  ₹{rec.salary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-red-400 text-right">
                  -₹{rec.deductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-teal-500 text-right">
                  ₹{rec.bonus.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-8 py-5 text-sm font-bold text-slate-800 text-right group-hover:text-[#134e4a]">
                  ₹{rec.netPay.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            {payrollData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-10 text-center text-slate-500 font-medium">
                  No payroll data found for this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400">Showing {paginatedPayroll.length} of {payrollData.length} records</p>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-white disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button 
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg font-bold text-xs transition-all border ${
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
            className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-white disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Monthly Total */}
      <div className="p-8 border-t-2 border-dashed border-slate-100 flex items-center justify-end space-x-8 bg-slate-50/20">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Monthly Total:</p>
        <h4 className="text-3xl font-black text-[#134e4a]">₹{totalPayroll.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h4>
      </div>
    </div>
  );
}

function AddPayrollModal({ isOpen, onClose, currentMonth, staff, updateStaff }: any) {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [formData, setFormData] = useState({
    daysPresent: '' as number | string,
    salary: '' as number | string,
    deductions: '' as number | string,
    bonus: '' as number | string
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedStaffId('');
      setFormData({ daysPresent: '', salary: '', deductions: '', bonus: '' });
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedStaffId) {
      const member = staff.find((s: any) => s.id === selectedStaffId);
      if (member) {
        // Calculate days present in the selected month
        const currentMonthLogs = (member.attendanceLogs || []).filter((l: any) => l.date.startsWith(currentMonth));
        setFormData(prev => ({ ...prev, daysPresent: currentMonthLogs.length || '' }));
      }
    }
  }, [selectedStaffId, staff, currentMonth]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = staff.find((s: any) => s.id === selectedStaffId);
    if (!member) return;

    const newLog = {
      month: currentMonth,
      daysPresent: Number(formData.daysPresent),
      salary: Number(formData.salary),
      deductions: Number(formData.deductions),
      bonus: Number(formData.bonus),
      netPay: Number(formData.salary) - Number(formData.deductions) + Number(formData.bonus)
    };

    const logs = [...(member.payrollLogs || [])];
    const existingIdx = logs.findIndex((l: any) => l.month === currentMonth);
    if (existingIdx > -1) {
      logs[existingIdx] = newLog;
    } else {
      logs.push(newLog);
    }

    updateStaff({ ...member, payrollLogs: logs });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Add Payroll Record</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors bg-slate-50 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Staff Member</label>
            <select
              required
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium"
            >
              <option value="" disabled>Select a staff member</option>
              {staff.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Days Present</label>
              <input
                type="number"
                min="0"
                required
                value={formData.daysPresent}
                onChange={(e) => setFormData(prev => ({ ...prev, daysPresent: e.target.value === '' ? '' : Number(e.target.value) }))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Base Salary</label>
              <input
                type="number"
                min="0"
                required
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value === '' ? '' : Number(e.target.value) }))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deductions</label>
              <input
                type="number"
                min="0"
                required
                value={formData.deductions}
                onChange={(e) => setFormData(prev => ({ ...prev, deductions: e.target.value === '' ? '' : Number(e.target.value) }))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Bonus</label>
              <input
                type="number"
                min="0"
                required
                value={formData.bonus}
                onChange={(e) => setFormData(prev => ({ ...prev, bonus: e.target.value === '' ? '' : Number(e.target.value) }))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#5ab2b2] focus:ring-2 focus:ring-teal-500/10 font-medium"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase">Net Pay</p>
            <p className="text-xl font-black text-teal-600">₹{(Number(formData.salary) - Number(formData.deductions) + Number(formData.bonus)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 font-bold text-white bg-[#5ab2b2] hover:bg-[#439c9c] rounded-xl transition-colors text-sm shadow-lg shadow-teal-500/20"
            >
              Save Payroll
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BarChart({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}



function ChevronUp({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
