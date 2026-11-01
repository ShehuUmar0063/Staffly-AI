import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { EmployeesView } from './components/views/EmployeesView';
import { EmployeeWorkspaceView } from './components/views/EmployeeWorkspaceView';
import { CustomersView } from './components/views/CustomersView';
import { OrdersView } from './components/views/OrdersView';
import { KnowledgeView } from './components/views/KnowledgeView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';
import { MobileBottomNav } from './components/MobileBottomNav';

const MainLayout: React.FC = () => {
  const { currentView } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (currentView === 'welcome') {
    return <WelcomeScreen />;
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 text-slate-900 font-sans flex flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 min-h-[100dvh]">
        {/* Top Sticky Header */}
        <Header
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
          {currentView === 'dashboard' && <DashboardView />}

          {currentView === 'employees' && <EmployeesView />}

          {currentView === 'employee_workspace' && <EmployeeWorkspaceView />}

          {currentView === 'customers' && <CustomersView />}

          {currentView === 'orders' && <OrdersView />}

          {currentView === 'knowledge' && <KnowledgeView />}

          {currentView === 'reports' && <ReportsView />}

          {currentView === 'settings' && <SettingsView />}
        </main>

        {/* Mobile Thumb-Friendly Bottom Navigation */}
        <MobileBottomNav onOpenMenu={() => setMobileSidebarOpen(true)} />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
