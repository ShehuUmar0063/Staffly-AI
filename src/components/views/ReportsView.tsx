import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Bot,
  Users,
  ShoppingBag,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const {
    customers,
    orders,
    activities,
    aiTaskCounts,
    employees,
    formatMoney,
    businessKnowledge,
  } = useApp();

  const totalCustomers = customers.filter((c) => c.status === 'Customer').length;
  const totalLeads = customers.filter((c) => c.status === 'Lead').length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalAITasks = Object.values(aiTaskCounts).reduce((a, b) => a + b, 0);

  // Status breakdown of orders
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Sample Data Notice Banner */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600">
          <p className="font-bold text-slate-900 mb-0.5">
            Demonstration Workspace Notice
          </p>
          <p>
            The metrics and activity logs displayed below incorporate active sample SME data for <strong>{businessKnowledge.businessName}</strong>. Real actions you perform (such as adding customers, recording orders, or conversing with AI employees) update these statistics live.
          </p>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            <span>Workforce Analytics & Audits</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Activity Reports
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Monitor real-time task completion by your 4 AI employees, track conversion funnels, and inspect operational activity logs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
          <div className="text-left md:text-right mr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Automated Tasks Done
            </span>
            <span className="text-3xl font-extrabold text-teal-700">{totalAITasks}</span>
            <span className="text-xs text-slate-500 block">Across 4 digital agents</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const headers = 'ID,Name,Phone,Email,Status,Stage,Orders,Spend\n';
                const rows = customers.map(c => `"${c.id}","${c.name}","${c.phone}","${c.email || ''}","${c.status}","${c.leadStage || ''}",${c.totalOrders},${c.totalSpend}`).join('\n');
                const blob = new Blob([headers + rows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `staffly_customers_${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Export Customers (CSV)</span>
            </button>

            <button
              onClick={() => {
                const headers = 'OrderNumber,Customer,Phone,Total,Status,Date\n';
                const rows = orders.map(o => `"${o.orderNumber}","${o.customerName}","${o.customerPhone}",${o.totalAmount},"${o.status}","${o.createdAt}"`).join('\n');
                const blob = new Blob([headers + rows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `staffly_orders_${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
              }}
              className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Export Orders (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">Total Contacts</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{customers.length}</span>
          <p className="text-xs text-slate-500 mt-1">
            {totalCustomers} buyers • {totalLeads} leads
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">Tracked Orders</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{totalOrders}</span>
          <p className="text-xs text-slate-500 mt-1">
            {formatMoney(totalRevenue)} total volume
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">Lead Conversion</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-600 block">
            {Math.round((totalCustomers / (customers.length || 1)) * 100)}%
          </span>
          <p className="text-xs text-slate-500 mt-1">From lead to active customer</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">AI Interactions</span>
            <Bot className="w-4 h-4 text-teal-500" />
          </div>
          <span className="text-2xl font-extrabold text-teal-600 block">{totalAITasks}</span>
          <p className="text-xs text-slate-500 mt-1">100% automated responses</p>
        </div>
      </div>

      {/* Two Column Layout: AI Workforce Breakdown & Order Status Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: AI Workforce Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              AI Tasks Breakdown by Employee
            </h2>
            <p className="text-xs text-slate-500">
              Distribution of customer conversations and back-office tasks handled
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {employees.map((emp) => {
              const count = emp.tasksCompleted;
              const percentage = Math.round((count / (totalAITasks || 1)) * 100);

              return (
                <div key={emp.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <span>{emp.avatar}</span>
                      <span>{emp.name} ({emp.title})</span>
                    </span>
                    <span className="font-bold text-slate-900">
                      {count} tasks ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Order Fulfillment Pipeline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Order Fulfillment Breakdown
            </h2>
            <p className="text-xs text-slate-500">Current progress of incoming customer orders</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Pending</span>
              <span className="text-2xl font-extrabold text-amber-900 mt-1 block">{pendingOrders}</span>
              <span className="text-slate-500 text-[11px]">Awaiting fulfillment</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80">
              <span className="text-[10px] font-bold text-purple-700 uppercase block">Processing</span>
              <span className="text-2xl font-extrabold text-purple-900 mt-1 block">{processingOrders}</span>
              <span className="text-slate-500 text-[11px]">In dispatch / courier</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Completed</span>
              <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">{completedOrders}</span>
              <span className="text-slate-500 text-[11px]">Delivered successfully</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Cancelled</span>
              <span className="text-2xl font-extrabold text-rose-900 mt-1 block">{cancelledOrders}</span>
              <span className="text-slate-500 text-[11px]">Voided orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Activity Audit Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Workforce Activity Audit Log
          </h2>
          <p className="text-xs text-slate-500">
            Chronological audit trail of digital workforce activities and user actions
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {activities.map((act) => (
            <div key={act.id} className="py-3.5 flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-sm font-bold">
                {act.type === 'order_created'
                  ? '🛍️'
                  : act.type === 'order_status'
                  ? '📦'
                  : act.type === 'customer_added'
                  ? '👤'
                  : act.type === 'lead_converted'
                  ? '⭐'
                  : '🤖'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900">{act.title}</p>
                  <span className="text-[11px] text-slate-400 shrink-0">{act.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{act.description}</p>
              </div>
              {act.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                  {act.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
