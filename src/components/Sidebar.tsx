import { LayoutDashboard, Users, Calendar, FileText, CreditCard, UserCircle, BarChart2, Settings, LogOut, ChevronDown, TrendingUp, Stethoscope, Building2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/types/auth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  roles: Role[];
  subItems?: { name: string; icon: React.ReactNode; href: string }[];
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const allNavItems: NavItem[] = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/dashboard', roles: ['superadmin', 'admin', 'staff'] },
    { name: 'Patients', icon: <Users size={18} />, href: '/patients', roles: ['superadmin', 'admin', 'staff'] },
    { name: 'Appointments', icon: <Calendar size={18} />, href: '/appointments', roles: ['superadmin', 'admin', 'staff'] },
    { name: 'Doctors', icon: <Stethoscope size={18} />, href: '/doctors', roles: ['superadmin', 'admin'] },
    { name: 'Revenue', icon: <TrendingUp size={18} />, href: '/revenue', roles: ['superadmin'] },
    { name: 'Medical Records', icon: <FileText size={18} />, href: '/records', roles: ['superadmin', 'admin', 'staff'] },
    { name: 'Billing', icon: <CreditCard size={18} />, href: '/billing', roles: ['superadmin', 'admin'] },
    { name: 'Staff', icon: <UserCircle size={18} />, href: '/staff', roles: ['superadmin', 'admin', 'staff'] },
    { name: 'Reports', icon: <BarChart2 size={18} />, href: '/reports', roles: ['superadmin'] },
    { name: 'Branches', icon: <Building2 size={18} />, href: '/branches', roles: ['superadmin'] },
    { name: 'Settings', icon: <Settings size={18} />, href: '/settings', roles: ['superadmin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role as Role));

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#d8f0f0] flex flex-col border-r border-[#c2e2e2] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static print:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col items-center">
          <div className="w-24 h-24 mb-3 rounded-full overflow-hidden shadow-md bg-[#1a2b2b] p-1 border-2 border-[#5ab2b2]/30">
            <img
              src="/h2f_logo.png"
              alt="Health 2 Fit Rehab Zone"
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">H2F Rehab</h1>
          <p className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase">Get Back On Track</p>
          <div className="mt-2 px-2 py-0.5 bg-[#5ab2b2]/20 rounded-full inline-block">
            <p className="text-[10px] font-bold text-[#2e8b8b] uppercase">{user?.role}</p>
          </div>
        </div>

        <div className="px-4 py-2 flex-grow overflow-y-auto space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            const hasSubItems = 'subItems' in item && item.subItems;
            const isSubMenuOpen = openSubMenus[item.name];

            if (hasSubItems) {
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleSubMenu(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive && !isSubMenuOpen
                      ? 'bg-[#5ab2b2] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-[#c2e2e2] hover:text-slate-900'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSubMenuOpen && (
                    <div className="ml-4 pl-4 border-l border-[#c2e2e2] space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {item.subItems?.map((subItem: any) => {
                        const isSubActive = location.pathname + location.search === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${isSubActive
                              ? 'bg-[#5ab2b2]/10 text-[#2e8b8b] font-bold'
                              : 'text-slate-500 hover:text-slate-800 hover:bg-[#c2e2e2]/50'
                              }`}
                          >
                            {subItem.icon}
                            <span>{subItem.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-[#5ab2b2] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-[#c2e2e2] hover:text-slate-900'
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 mt-auto border-t border-[#c2e2e2]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
                <UserCircle size={24} className="text-slate-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800 truncate w-32">{user?.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
