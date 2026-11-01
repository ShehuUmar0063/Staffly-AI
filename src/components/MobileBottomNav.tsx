import React from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  LayoutDashboard,
  Bot,
  Users,
  ShoppingBag,
  Menu,
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const { currentView, setCurrentView, orders, customers } = useApp();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing'
  ).length;

  const activeLeadsCount = customers.filter((c) => c.status === 'Lead').length;

  const isMoreActive =
    currentView === 'knowledge' ||
    currentView === 'reports' ||
    currentView === 'settings';

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {/* 1. Dashboard */}
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
            currentView === 'dashboard'
              ? 'text-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {currentView === 'dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Overview</span>
        </button>

        {/* 2. AI Employees */}
        <button
          onClick={() => setCurrentView('employee_workspace')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
            currentView === 'employee_workspace' || currentView === 'employees'
              ? 'text-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                currentView === 'employee_workspace' || currentView === 'employees'
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Bot className="w-4 h-4" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white animate-pulse" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-semibold">AI Team</span>
        </button>

        {/* 3. Customers */}
        <button
          onClick={() => setCurrentView('customers')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
            currentView === 'customers'
              ? 'text-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            {activeLeadsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-[9px] font-extrabold px-1 rounded-full min-w-3.5 h-3.5 flex items-center justify-center">
                {activeLeadsCount}
              </span>
            )}
            {currentView === 'customers' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Clients</span>
        </button>

        {/* 4. Orders */}
        <button
          onClick={() => setCurrentView('orders')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
            currentView === 'orders'
              ? 'text-teal-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-extrabold px-1 rounded-full min-w-3.5 h-3.5 flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
            {currentView === 'orders' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Orders</span>
        </button>

        {/* 5. More / Menu Drawer */}
        <button
          onClick={onOpenMenu}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
            isMoreActive ? 'text-teal-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Menu className="w-5 h-5" />
            {isMoreActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
