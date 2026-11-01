import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  Bot,
  Plus,
  ShoppingBag,
  UserPlus,
  Coins,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  title,
  subtitle,
}) => {
  const {
    currentView,
    setCurrentView,
    openEmployeeWorkspace,
    currency,
    setCurrency,
  } = useApp();

  const getTitle = () => {
    if (title) return title;
    switch (currentView) {
      case 'dashboard':
        return 'Overview';
      case 'employees':
        return 'Digital Workforce';
      case 'employee_workspace':
        return 'AI Employee Workspace';
      case 'customers':
        return 'Customers & Leads';
      case 'orders':
        return 'Orders Management';
      case 'knowledge':
        return 'Business Knowledge Base';
      case 'reports':
        return 'Activity & Performance Reports';
      case 'settings':
        return 'Workspace Settings';
      default:
        return 'Staffly AI';
    }
  };

  const currencies = ['₦', '$', '£', '€', 'GH₵', 'KES'];

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{getTitle()}</span>
          </h1>
          {subtitle && <p className="text-xs text-slate-500 font-medium hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right: Currency quick picker & Action buttons */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Currency Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 border border-slate-200/80 rounded-xl px-2.5 py-1 text-xs">
          <Coins className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
          <span className="text-[11px] font-semibold text-slate-500 hidden md:inline">Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
            aria-label="Select currency"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c} {c === '₦' ? 'NGN' : c === '$' ? 'USD' : c === '£' ? 'GBP' : c === '€' ? 'EUR' : c}
              </option>
            ))}
          </select>
        </div>

        {/* AI Employees Status Badge */}
        <div
          onClick={() => setCurrentView('employees')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold cursor-pointer hover:bg-teal-100/70 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>4 Digital Employees</span>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => openEmployeeWorkspace('customer_support')}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer active:scale-95"
        >
          <Bot className="w-4 h-4 text-teal-400" />
          <span className="hidden sm:inline">Talk to AI Employee</span>
          <span className="sm:hidden">Chat</span>
        </button>
      </div>
    </header>
  );
};
