import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  return (
    <div className="antialiased min-h-screen flex flex-col md:flex-row overflow-hidden bg-surface text-on-surface">
      <div className="hidden md:flex flex-col w-1/2 h-screen relative bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <img alt="Abstract night city traffic flow with blurred light trails in neon blue and purple hues against deep dark background, slow motion effect, high fidelity" className="w-full h-full object-cover opacity-60" data-alt="Abstract night city traffic flow with blurred light trails in neon blue and purple hues against deep dark background, slow motion effect, high fidelity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0xJcPDUFRp2n1gspHNnjdL8c8r-BFUyk86FwkY3D12zz9s-F45Zi-uFmSDNfqk1E0YA2rGMkYiweMl3u2WK5EdVaJSpzZanXUunwaB-BH4wlOOwoGNJMoErxhmtDIAwW36ZFpAdkFFqH2O2ny09NYdYyjc2AvVaL58FyiBhL4rtDQkMn8RTcymLqICarYoAT3ylOA7FflgsGxJ1HwhRLSo2msUUBJV8u4No1sWx4p9Pj8y9Zbxo61OoLKuEUcJQwIkKVrMD8_wbo" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-surface/80 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/40 z-10"></div>
        <div className="relative z-20 p-12 flex flex-col justify-between h-full">
          <div>
            <span className="text-3xl font-black tracking-tighter text-primary cursor-pointer" onClick={() => navigate('/')}>SANJAYA</span>
          </div>
          <div className="max-w-md">
            <h1 className="text-[3.5rem] leading-[1.1] font-bold tracking-[-0.02em] text-on-surface mb-6">
              Predict the flow.<br/>Own the network.
            </h1>
            <p className="text-lg text-on-surface/70 leading-relaxed font-light">
              Join the premier predictive intelligence platform for urban mobility. Anticipate congestion before it forms with our proprietary neural engine.
            </p>
            <div className="mt-12 flex items-center gap-4 bg-surface-container-high/60 backdrop-blur-xl p-6 rounded-xl border border-outline-variant/15 w-max shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
              <div className="w-12 h-12 rounded-full bg-secondary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary-container" data-icon="hub">hub</span>
              </div>
              <div>
                <div className="text-[0.75rem] uppercase tracking-[0.1em] text-on-surface/50 font-bold mb-1">Live Processing</div>
                <div className="text-xl font-bold text-on-surface">4.2M <span className="text-sm font-normal text-on-surface/50">nodes/sec</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 h-screen overflow-y-auto flex items-center justify-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-md space-y-12">
          <div className="md:hidden flex justify-center mb-8">
            <span onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-primary cursor-pointer">SANJAYA</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-[1.75rem] font-semibold text-on-surface tracking-tight">Request Access</h2>
            <p className="text-sm text-on-surface/60 font-light">Enter your credentials to initiate provisioning.</p>
          </div>
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[0.75rem] uppercase tracking-[0.1em] text-on-surface/70 font-semibold" htmlFor="fullName">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface/40 text-[20px]" data-icon="person">person</span>
                  </div>
                  <input className="block w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/15 rounded-lg text-on-surface text-sm placeholder:text-on-surface/30 focus:outline-none focus:bg-surface-container-low focus:border-secondary/20 focus:ring-0 transition-all" id="fullName" placeholder="Jane Doe" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[0.75rem] uppercase tracking-[0.1em] text-on-surface/70 font-semibold" htmlFor="orgEmail">Organization Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface/40 text-[20px]" data-icon="mail">mail</span>
                  </div>
                  <input className="block w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/15 rounded-lg text-on-surface text-sm placeholder:text-on-surface/30 focus:outline-none focus:bg-surface-container-low focus:border-secondary/20 focus:ring-0 transition-all" id="orgEmail" placeholder="jane@company.com" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[0.75rem] uppercase tracking-[0.1em] text-on-surface/70 font-semibold" htmlFor="role">Primary Role</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface/40 text-[20px]" data-icon="work">work</span>
                  </div>
                  <select className="block w-full pl-11 pr-10 py-3 bg-surface-container-lowest border border-outline-variant/15 rounded-lg text-on-surface text-sm appearance-none focus:outline-none focus:bg-surface-container-low focus:border-secondary/20 focus:ring-0 transition-all" id="role" defaultValue="">
                    <option className="text-on-surface/30" disabled value="">Select designation...</option>
                    <option value="analyst">Traffic Analyst</option>
                    <option value="planner">Urban Planner</option>
                    <option value="engineer">Systems Engineer</option>
                    <option value="executive">Executive / Director</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-on-surface/40 text-[20px]" data-icon="expand_more">expand_more</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <label className="block text-[0.75rem] uppercase tracking-[0.1em] text-on-surface/70 font-semibold mb-3">API Preference</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative flex cursor-pointer rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-4 hover:bg-surface-container-low transition-colors has-[:checked]:bg-surface-container-high has-[:checked]:border-primary/30">
                    <input className="peer sr-only" name="api_pref" type="radio" value="rest" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-on-surface peer-checked:text-primary">REST API</span>
                      <span className="text-xs text-on-surface/50 mt-1">Standard endpoints</span>
                    </div>
                    <span className="material-symbols-outlined absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity text-[18px]" data-icon="check_circle" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  </label>
                  <label className="relative flex cursor-pointer rounded-lg border border-outline-variant/15 bg-surface-container-lowest p-4 hover:bg-surface-container-low transition-colors has-[:checked]:bg-surface-container-high has-[:checked]:border-primary/30">
                    <input className="peer sr-only" name="api_pref" type="radio" value="graphql" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-on-surface peer-checked:text-primary">GraphQL</span>
                      <span className="text-xs text-on-surface/50 mt-1">Custom queries</span>
                    </div>
                    <span className="material-symbols-outlined absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity text-[18px]" data-icon="check_circle" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <button onClick={() => navigate('/app/dashboard')} className="w-full py-4 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold text-sm tracking-wide hover:opacity-90 transition-all duration-300 flex justify-center items-center gap-2" type="button">
                <span>Initialize Sequence</span>
                <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
              </button>
            </div>
            <div className="text-center pt-4">
              <p className="text-xs text-on-surface/40">
                By requesting access, you agree to the <a className="text-primary hover:text-primary-container transition-colors" href="#">Terms of Service</a> and <a className="text-primary hover:text-primary-container transition-colors" href="#">Privacy Policy</a>.
              </p>
              <p className="text-xs text-on-surface/40 mt-3">
                Already have access?{' '}
                <button onClick={() => navigate('/login')} className="text-primary hover:text-secondary-container transition-colors">Sign In</button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
