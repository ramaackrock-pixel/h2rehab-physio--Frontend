import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';


export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      // Role-based navigation is handled in the context or here
      if (userData.role === 'staff') {
        navigate('/patients'); // Example staff redirect
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden shadow-2xl bg-[#1a2b2b] p-1 border-4 border-white">
          <img 
            src="/h2f_logo.png" 
            alt="Health 2 Fit Rehab Zone" 
            className="w-full h-full object-cover scale-110"
          />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">H2F Rehab</h1>
        <p className="text-xs font-semibold text-slate-500 tracking-widest mt-2 uppercase">Get Back On Track</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Welcome back</h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5ab2b2] focus:border-transparent transition-shadow sm:text-sm bg-slate-50 focus:bg-white"
                  placeholder="admin@physio.inc"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5ab2b2] focus:border-transparent transition-shadow sm:text-sm bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>



            <div className="flex items-center justify-end">
              <div className="text-sm">
                <button 
                  type="button"
                  onClick={() => toast.error('Please contact administration to reset your password.')}
                  className="font-semibold text-[#5ab2b2] hover:text-[#439c9c] bg-transparent border-none p-0 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#5ab2b2] hover:bg-[#439c9c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5ab2b2] transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => toast.error('Please contact administration to create an account.')}
                className="font-semibold text-[#5ab2b2] hover:text-[#439c9c] bg-transparent border-none p-0 cursor-pointer"
              >
                Contact administration
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
