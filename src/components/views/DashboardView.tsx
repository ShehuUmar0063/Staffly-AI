import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  ShoppingBag,
  Bot,
  ArrowRight,
  TrendingUp,
  Plus,
  BookOpen,
  MessageSquare,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenCreateOrder?: () => void;
  onOpenAddCustomer?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = () => {
  const {
    businessKnowledge,
    customers,
    orders,
    activities,
    aiTaskCounts,
    employees,
    openEmployeeWorkspace,
    setCurrentView,
    formatMoney,
  } = useApp();

  const totalCustomers = customers.filter((c) => c.status === 'Customer').length;
  const activeLeads = customers.filter((c) => c.status === 'Lead').length;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalAITasks = Object.values(aiTaskCounts).reduce((a, b) => a + b, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Sample Data Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-slate-100 to-slate-100 border border-teal-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Sample SME Workspace Loaded: {businessKnowledge.businessName}
              </h2>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                Demo Active
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Includes preloaded products, customer leads, and orders in Nigerian Naira (₦). You can edit or add your real business details anytime.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setCurrentView('knowledge')}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
          >
            Edit Business Info
          </button>
          <button
            onClick={() => openEmployeeWorkspace('customer_support')}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer text-center"
          >
            Test AI Employees
          </button>
        </div>
      </div>

      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 sm:p-8 shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-medium mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Digital Workforce Online & Listening</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Welcome to Staffly AI
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            Staffly AI empowers small businesses and entrepreneurs to run customer support, sales conversations, and order tracking 24/7 with dedicated digital employees.
          </p>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openEmployeeWorkspace('customer_support')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Open AI Workspace</span>
            </button>

            <button
              onClick={() => setCurrentView('orders')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Record New Order</span>
            </button>

            <button
              onClick={() => setCurrentView('customers')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <UserPlusIcon className="w-4 h-4 text-teal-400" />
              <span>Add Customer / Lead</span>
            </button>

            <button
              onClick={() => setCurrentView('knowledge')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Knowledge Base</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Customers */}
        <div
          onClick={() => setCurrentView('customers')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-teal-400/60 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Customers
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalCustomers}
            </span>
            <span className="text-xs text-slate-500">registered</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-emerald-700 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> High retention
            </span>
            <span>• {customers.length} total contacts</span>
          </div>
        </div>

        {/* Active Leads */}
        <div
          onClick={() => setCurrentView('customers')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-teal-400/60 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Leads
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {activeLeads}
            </span>
            <span className="text-xs text-slate-500">in pipeline</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-teal-700 font-medium">
            <span>Ready for Sales Assistant follow-up</span>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => setCurrentView('orders')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-teal-400/60 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Orders Tracked
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalOrdersCount}
            </span>
            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
              {formatMoney(totalRevenue)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            {pendingOrders > 0 ? (
              <span className="text-amber-700 font-semibold">
                {pendingOrders} awaiting fulfillment
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">All orders fulfilled</span>
            )}
          </div>
        </div>

        {/* AI Tasks Completed */}
        <div
          onClick={() => setCurrentView('reports')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-teal-400/60 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              AI Tasks Completed
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalAITasks}
            </span>
            <span className="text-xs text-slate-500">automated</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-purple-700 font-medium">
            <span>~18 hours human labor saved</span>
          </div>
        </div>
      </div>

      {/* Workforce Interactive Testing Sandbox */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-7 border border-slate-800 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h2 className="text-base font-bold text-white">Live Workforce Simulation Hub</h2>
            </div>
            <p className="text-xs text-slate-400">
              Test end-to-end small business scenarios with 1 click:
            </p>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 w-fit">
            Instant Test Mode
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div
            onClick={() => openEmployeeWorkspace('customer_support')}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">👩🏾‍💼</span>
              <span className="text-[10px] text-teal-400 font-bold group-hover:translate-x-0.5 transition-transform">
                Launch ➔
              </span>
            </div>
            <h3 className="font-bold text-xs text-white">Customer Support Inquiry</h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              “How much is the Vitamin C Serum and do you deliver to Abuja?”
            </p>
          </div>

          <div
            onClick={() => openEmployeeWorkspace('sales_assistant')}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">👨🏾‍💼</span>
              <span className="text-[10px] text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform">
                Launch ➔
              </span>
            </div>
            <h3 className="font-bold text-xs text-white">Lead Capture & Recommendation</h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              “My name is Titi (+234 803 111 2222), what product gives glowing skin?”
            </p>
          </div>

          <div
            onClick={() => openEmployeeWorkspace('order_manager')}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">👨🏾‍💻</span>
              <span className="text-[10px] text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                Launch ➔
              </span>
            </div>
            <h3 className="font-bold text-xs text-white">Order Compilation Draft</h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              “I want to place an order for 2 Vitamin C Serums to Lekki, Lagos.”
            </p>
          </div>

          <div
            onClick={() => openEmployeeWorkspace('business_assistant')}
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">👨🏾‍💼</span>
              <span className="text-[10px] text-purple-400 font-bold group-hover:translate-x-0.5 transition-transform">
                Launch ➔
              </span>
            </div>
            <h3 className="font-bold text-xs text-white">WhatsApp Marketing Copy</h3>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              “Draft a compelling weekend promotional message for our products.”
            </p>
          </div>
        </div>
      </div>

      {/* Available AI Employees Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Your Digital Workforce
            </h2>
            <p className="text-xs text-slate-500">
              4 specialized AI employees working synchronously for your business
            </p>
          </div>
          <button
            onClick={() => setCurrentView('employees')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200">
                    {emp.avatar}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{emp.name}</h3>
                <p className="text-xs font-semibold text-teal-700 mb-2">{emp.title}</p>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {emp.shortDesc}
                </p>
              </div>

              <div>
                <div className="border-t border-slate-100 pt-3 mb-3 flex items-center justify-between text-xs text-slate-500">
                  <span>Tasks done</span>
                  <span className="font-bold text-slate-800">{emp.tasksCompleted}</span>
                </div>

                <button
                  onClick={() => openEmployeeWorkspace(emp.id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                  <span>Open Employee</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Activity & Quick Knowledge Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Recent Workforce Activity
              </h2>
              <p className="text-xs text-slate-500">Live feed of orders, inquiries & customer updates</p>
            </div>
            <button
              onClick={() => setCurrentView('reports')}
              className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
            >
              Full Activity Log
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="py-3.5 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  {act.type === 'order_created' ? '🛍️' : act.type === 'customer_added' ? '👤' : act.type === 'lead_converted' ? '⭐' : '🤖'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {act.title}
                    </p>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {act.description}
                  </p>
                </div>
                {act.badge && (
                  <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {act.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Business Knowledge Info */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Knowledge Context
              </h2>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Synced to AI
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Your AI employees read this profile before every reply to guarantee factual answers without guessing.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                  Catalog Size
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {businessKnowledge.products?.length || 0} Products active
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                  Delivery Coverage
                </span>
                <span className="font-medium text-slate-800 line-clamp-2">
                  {businessKnowledge.deliveryInfo || 'Standard delivery configured.'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">
                  Operating Hours
                </span>
                <span className="font-medium text-slate-800">
                  {businessKnowledge.businessHours}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('knowledge')}
            className="w-full mt-6 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>Manage Knowledge Base</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function UserPlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}
