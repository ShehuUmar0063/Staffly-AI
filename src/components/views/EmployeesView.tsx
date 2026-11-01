import React from 'react';
import { useApp } from '../../context/AppContext';
import { AIEmployeeRole } from '../../types';
import {
  Bot,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  ThumbsUp,
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { employees, openEmployeeWorkspace, businessKnowledge } = useApp();

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Dedicated Digital Team</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            AI Employees
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your 24/7 team of autonomous specialists trained specifically on {businessKnowledge.businessName}'s knowledge base, products, and policies. Click any employee to open their interactive workspace.
          </p>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div>
            <span className="block text-2xl font-extrabold text-slate-900">4</span>
            <span className="text-xs text-slate-500 font-medium">Active Roles</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <span className="block text-2xl font-extrabold text-emerald-600">100%</span>
            <span className="text-xs text-slate-500 font-medium">Uptime (24/7)</span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Employees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header: Avatar, Name & Status */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/80 flex items-center justify-center text-3xl shadow-inner">
                    {emp.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">{emp.name}</h2>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {emp.specialtyTag}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-teal-700">{emp.title}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Online
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {emp.longDesc}
              </p>

              {/* Responsibilities list */}
              <div className="mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                  Key Responsibilities
                </span>
                <ul className="space-y-2">
                  {emp.duties.map((duty, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>{duty}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sample questions */}
              <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  Example questions {emp.name} handles:
                </span>
                <div className="space-y-1.5">
                  {emp.promptStarters.slice(0, 2).map((starter, i) => (
                    <div
                      key={i}
                      onClick={() => openEmployeeWorkspace(emp.id)}
                      className="text-xs text-slate-600 hover:text-teal-700 cursor-pointer flex items-center gap-1.5 hover:underline"
                    >
                      <span className="text-teal-500">“</span>
                      <span className="italic">{starter}</span>
                      <span className="text-teal-500">”</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom: Stats & Button */}
            <div className="border-t border-slate-100 pt-5">
              <div className="grid grid-cols-3 gap-2 text-center mb-4 text-xs">
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tasks</span>
                  <span className="font-extrabold text-slate-900 text-sm">{emp.tasksCompleted}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Satisfaction</span>
                  <span className="font-extrabold text-emerald-600 text-sm">{emp.satisfactionRate}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Speed</span>
                  <span className="font-extrabold text-slate-900 text-sm">{emp.avgResponseTime}</span>
                </div>
              </div>

              <button
                onClick={() => openEmployeeWorkspace(emp.id)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-99"
              >
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Open Employee Workspace</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
