import React from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  LayoutDashboard,
  Bot,
  Users,
  ShoppingBag,
  BookOpen,
  BarChart3,
  Settings,
  X,
  ExternalLink,
  Store,
  Sparkles,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const {
    currentView,
    setCurrentView,
    businessKnowledge,
    customers,
    orders,
    exitToWelcome,
  } = useApp();

  const activeLeadsCount = customers.filter((c) => c.status === 'Lead').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;

  const navItems: Array<{
    id: AppView;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'employees',
      label: 'AI Employees',
      icon: <Bot className="w-5 h-5" />,
      badge: '4 Active',
      badgeColor: 'bg-teal-500/15 text-teal-700 border-teal-500/30',
    },
    {
      id: 'customers',
      label: 'Customers & Leads',
      icon: <Users className="w-5 h-5" />,
      badge: activeLeadsCount > 0 ? `${activeLeadsCount} Leads` : undefined,
      badgeColor: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
    },
    {
      id: 'knowledge',
      label: 'Business Knowledge',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'reports',
      label: 'Activity Reports',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const handleNavClick = (viewId: AppView) => {
    setCurrentView(viewId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo & Business Info */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <div
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center font-extrabold text-slate-950 shadow-md shadow-teal-500/20 text-lg">
                S
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white tracking-tight">Staffly</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Your AI Workforce</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Business Profile Card */}
          <div
            onClick={() => handleNavClick('knowledge')}
            className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-teal-500/50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-teal-400" />
                Active Business
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-white truncate group-hover:text-teal-300 transition-colors">
              {businessKnowledge.businessName || 'My Business'}
            </p>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {businessKnowledge.products?.length || 0} products • {businessKnowledge.currency} {businessKnowledge.currencyCode}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Workforce Portal
          </div>
          {navItems.map((item) => {
            const isActive =
              currentView === item.id ||
              (item.id === 'employees' && currentView === 'employee_workspace');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-teal-300 font-semibold border-l-4 border-teal-400'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-teal-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Guest Mode Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                Guest Workspace
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All changes persist in browser memory.
            </p>
            <button
              onClick={exitToWelcome}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Return to Welcome Screen</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
