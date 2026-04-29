import { Search, HelpCircle, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useAppData } from '../context/AppDataContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { searchQuery, setSearchQuery } = useSearch();
  const { patients } = useAppData();
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.pid && p.pid.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPatient = (id: string) => {
    navigate(`/patients/${id}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredPatients.length > 0) {
      handleSelectPatient(filteredPatients[0].id);
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-8 bg-white border-b border-slate-200 print:hidden">
      <div className="flex items-center space-x-4 mr-4">
        <button 
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1a2b2b] p-0.5 border border-[#5ab2b2]/30 shadow-sm">
            <img 
              src="/h2f_logo.png" 
              alt="H2F Logo" 
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <span className="hidden sm:block text-lg font-bold text-slate-800 tracking-tight">H2F Rehab</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl">
        <div className="relative" ref={suggestionRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search patients, records or staff..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5ab2b2] focus:border-transparent text-sm"
          />
          
          {showSuggestions && searchQuery && filteredPatients.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 border-b border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Patient Suggestions</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredPatients.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient.id)}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left group"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${patient.initialsBg}`}>
                      {patient.initials}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-800 group-hover:text-[#5ab2b2] transition-colors">{patient.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{patient.pid || patient.id} • {patient.branch}</div>
                    </div>
                    <div className="text-[10px] font-black text-slate-300 group-hover:text-[#5ab2b2]">VIEW</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-6 ml-4">
        <div className="relative group">
          <button className="hidden md:block text-slate-500 hover:text-slate-700 p-2">
            <HelpCircle size={20} />
          </button>
          {/* Custom Tooltip */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-slate-800 text-white text-[10px] p-3 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] border border-slate-700 pointer-events-none font-medium leading-relaxed">
            <div className="absolute top-0 right-4 -translate-y-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-t border-slate-700"></div>
            This is confidential; no outside organization can access this information.
          </div>
        </div>
      </div>
    </header>
  );
}
