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

const MainLayout: React.FC = () => {
  const { currentView } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (currentView === 'welcome') {
    return <WelcomeScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Sticky Header */}
        <Header
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && <DashboardView />}

          {currentView === 'employees' && <EmployeesView />}

          {currentView === 'employee_workspace' && <EmployeeWorkspaceView />}

          {currentView === 'customers' && <CustomersView />}

          {currentView === 'orders' && <OrdersView />}

          {currentView === 'knowledge' && <KnowledgeView />}

          {currentView === 'reports' && <ReportsView />}

          {currentView === 'settings' && <SettingsView />}
        </main>
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
