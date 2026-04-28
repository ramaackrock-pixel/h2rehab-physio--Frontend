import { useState } from 'react';
import { Layout } from '../components/Layout';
import { 
  MapPin, 
  User, 
  Phone, 
  TrendingUp, 
  TrendingDown, 
  MoreVertical, 
  Plus, 
  Users, 
  HeartPulse, 
  IndianRupee,
  Search,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import type { ClinicBranch, BranchStatus } from '../types/branches';
import BranchModal from '@/components/dashboard/BranchModal';

export function Branches() {
  const { branches: allBranches, addBranch } = useAppData();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const branches = allBranches.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveBranch = (data: any) => {
    const newBranch = {
      ...data,
      id: `BR-${Math.floor(Math.random() * 1000)}`,
      staffCount: 0,
      patientCount: 0,
      totalRevenue: 0,
      performance: {
        weeklyRevenue: [0, 0, 0, 0, 0, 0, 0],
        revenueGrowth: 0
      }
    };
    addBranch(newBranch);
    setIsModalOpen(false);
  };

  const getStatusColor = (status: BranchStatus) => {
    switch (status) {
      case 'Active': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'Maintenance': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Expanding': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Branches</h1>
            <p className="text-slate-500 mt-1">Manage your clinic network and facility performance</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#5ab2b2] hover:bg-[#4a9f9f] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-teal-500/20 active:scale-95 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Add New Branch</span>
          </button>
        </div>

        <BranchModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBranch}
        />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative w-full sm:w-96 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search branches or managers..." 
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-center bg-slate-50 p-1 rounded-xl border border-slate-100 w-full sm:w-auto">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex-1 sm:flex-none p-2 rounded-lg transition-all flex items-center justify-center ${viewMode === 'grid' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-none p-2 rounded-lg transition-all flex items-center justify-center ${viewMode === 'list' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {branches.map(branch => (
              <BranchCard key={branch.id} branch={branch} getStatusColor={getStatusColor} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                <tr>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">Manager</th>
                  <th className="px-6 py-4">Staff</th>
                  <th className="px-6 py-4">Patients</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {branches.map(branch => (
                  <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs ring-2 ring-white shadow-sm">
                          {branch.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{branch.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{branch.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-700">{branch.manager}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600">{branch.staffCount}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600">{branch.patientCount}</td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-800">
                      ₹{branch.totalRevenue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(branch.status)}`}>
                        {branch.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

function BranchCard({ branch, getStatusColor }: { branch: ClinicBranch, getStatusColor: (s: BranchStatus) => string }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col">
      <div className="relative h-60 overflow-hidden">
        <img src={branch.image} alt={branch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 right-4 group-hover:translate-x-0 transition-transform">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border backdrop-blur-md ${getStatusColor(branch.status)}`}>
            {branch.status}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-6">
          <p className="text-white text-xs font-bold flex items-center space-x-2">
            <MapPin size={14} className="text-teal-400" />
            <span>{branch.id} • {branch.address}</span>
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-slate-800 group-hover:text-teal-600 transition-colors">{branch.name}</h3>
            <div className="flex items-center space-x-2 mt-1 text-slate-400">
              <User size={14} />
              <span className="text-xs font-bold uppercase tracking-tighter">Mgr: {branch.manager}</span>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 p-3 rounded-2xl bg-teal-50/50 border border-teal-50 group/item hover:bg-teal-50 transition-colors">
            <Users size={14} className="text-teal-500" />
            <p className="text-lg font-black text-slate-800 leading-none">{branch.staffCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Staff</p>
          </div>
          <div className="space-y-1 p-3 rounded-2xl bg-blue-50/50 border border-blue-50 group/item hover:bg-blue-50 transition-colors">
            <HeartPulse size={14} className="text-blue-500" />
            <p className="text-lg font-black text-slate-800 leading-none">{branch.patientCount}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Patients</p>
          </div>
          <div className="space-y-1 p-3 rounded-2xl bg-orange-50/50 border border-orange-50 group/item hover:bg-orange-50 transition-colors">
            <IndianRupee size={14} className="text-orange-500" />
            <p className="text-lg font-black text-slate-800 leading-none">{(branch.totalRevenue / 100000).toFixed(1)}L</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Revenue</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="flex -space-x-1 border border-teal-100 rounded-lg p-1 bg-teal-50/20">
                {branch.performance.weeklyRevenue.map((val, i) => (
                  <div 
                    key={i}
                    className="w-1 bg-teal-400 rounded-full transition-all duration-500 group-hover:bg-teal-500"
                    style={{ height: `${(val / 52000) * 20}px` }}
                  />
                ))}
             </div>
             <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Growth</p>
                <div className={`flex items-center text-[11px] font-black ${branch.performance.revenueGrowth >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
                  {branch.performance.revenueGrowth >= 0 ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                  {Math.abs(branch.performance.revenueGrowth)}%
                </div>
             </div>
          </div>
          <a href={`tel:${branch.phone}`} className="w-10 h-10 rounded-full bg-[#5ab2b2] flex items-center justify-center text-white hover:bg-[#4a9f9f] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-teal-500/20">
            <Phone size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
