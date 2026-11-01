import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  ShoppingBag,
  Sparkles,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { enterGuestDashboard } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Glows & Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-teal-500/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-extrabold text-xl">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white">Staffly</span>
              <span className="text-xs uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Your AI Workforce</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>4 Digital Employees Ready</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-8 flex flex-col items-center my-auto">
        {/* Login-style Card */}
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/60 relative">
          {/* Subtle Top Accent */}
          <div className="absolute -top-px left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent" />

          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center mx-auto mb-6 shadow-inner text-teal-400">
            <Bot className="w-7 h-7" />
          </div>

          {/* Heading & Tagline */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Staffly AI
            </h1>
            <p className="text-sm font-semibold text-teal-400 uppercase tracking-wider mb-3">
              Your AI workforce. More work, less effort.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Meet your digital employees. Manage customers, sales and everyday business operations from one simple workspace.
            </p>
          </div>

          {/* Highlight feature pills */}
          <div className="space-y-2.5 mb-8">
            <div className="flex items-center gap-3 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Handles customer inquiries, sales & orders 24/7</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Answers accurately using your business knowledge</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Built for African & global SMEs (Naira ₦ default)</span>
            </div>
          </div>

          {/* Prominent Action Button */}
          <button
            onClick={enterGuestDashboard}
            className="w-full group cursor-pointer relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-slate-950 font-bold py-3.5 px-6 shadow-lg shadow-teal-500/25 transition-all duration-200 flex items-center justify-center gap-2 text-base active:scale-[0.99]"
          >
            <span>Continue as Guest</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Small note */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Free access — no account required.</span>
            </p>
          </div>
        </div>

        {/* Digital Employees Preview Grid */}
        <div className="mt-12 w-full max-w-4xl">
          <div className="text-center mb-6">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Ready to work inside your workspace
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-center hover:border-teal-500/40 transition-colors">
              <div className="text-2xl mb-2">👩🏾‍💼</div>
              <h3 className="text-sm font-semibold text-white">Customer Support</h3>
              <p className="text-xs text-slate-400 mt-1">Answers questions on pricing, delivery & policies</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-center hover:border-teal-500/40 transition-colors">
              <div className="text-2xl mb-2">👨🏾‍💼</div>
              <h3 className="text-sm font-semibold text-white">Sales Assistant</h3>
              <p className="text-xs text-slate-400 mt-1">Recommends products and converts leads</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-center hover:border-teal-500/40 transition-colors">
              <div className="text-2xl mb-2">👨🏾‍💻</div>
              <h3 className="text-sm font-semibold text-white">Order Manager</h3>
              <p className="text-xs text-slate-400 mt-1">Collects order details and tracks delivery status</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-center hover:border-teal-500/40 transition-colors">
              <div className="text-2xl mb-2">👨🏾‍💼</div>
              <h3 className="text-sm font-semibold text-white">Business Assistant</h3>
              <p className="text-xs text-slate-400 mt-1">Summarizes activity and suggests growth tips</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-900 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-400">
        <p>© 2026 Staffly AI. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Designed for entrepreneurs, retailers, and small businesses.</p>
      </footer>
    </div>
  );
};
