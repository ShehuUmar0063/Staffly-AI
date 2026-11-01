import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Coins,
  Database,
  RefreshCw,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Bot,
  Store,
  Sparkles,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currency,
    setCurrency,
    resetAllData,
    businessKnowledge,
    updateBusinessKnowledge,
    hasApiKey,
  } = useApp();

  const [resetConfirm, setResetConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const availableCurrencies = [
    { symbol: '₦', code: 'NGN', name: 'Nigerian Naira (Default)' },
    { symbol: '$', code: 'USD', name: 'US Dollar' },
    { symbol: '£', code: 'GBP', name: 'British Pound' },
    { symbol: '€', code: 'EUR', name: 'Euro' },
    { symbol: 'GH₵', code: 'GHS', name: 'Ghanaian Cedi' },
    { symbol: 'KES', code: 'KES', name: 'Kenyan Shilling' },
  ];

  const handleResetData = () => {
    resetAllData();
    setResetConfirm(false);
    setSuccessMessage('Reset to original sample Nigerian SME data successfully.');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleLoadTechPreset = () => {
    updateBusinessKnowledge({
      ...businessKnowledge,
      businessName: 'NaijaTech Gadgets & Accessories',
      tagline: 'Reliable smartphones, powerbanks, audio, and gadgets in Computer Village, Ikeja.',
      industry: 'Consumer Electronics & Mobile',
      description:
        'NaijaTech is a premier gadget vendor operating in Computer Village, Ikeja, Lagos. We provide original phones, high-speed fast chargers, heavy-duty power banks, and noise-cancelling wireless earbuds with manufacturer warranties.',
      products: [
        {
          id: 'tech-1',
          name: 'Anker PowerCore 20,000mAh Heavy-Duty Powerbank',
          category: 'Power & Charging',
          price: 28000,
          description: 'High capacity, dual-port fast charging for iPhones and Android devices.',
          inStock: true,
        },
        {
          id: 'tech-2',
          name: 'Oraimo FreePods 4 ANC Wireless Earbuds',
          category: 'Audio',
          price: 24500,
          description: 'Active Noise Cancellation, deep bass, 35.5-hour total playtime.',
          inStock: true,
        },
        {
          id: 'tech-3',
          name: 'Samsung 45W Super Fast Charger with Type-C Cable',
          category: 'Accessories',
          price: 16500,
          description: 'Original adapter compatible with flagship Samsung and Pixel smartphones.',
          inStock: true,
        },
      ],
      deliveryInfo:
        'Lagos Mainland & Island dispatch within 3 hours: ₦2,000. Interstate delivery via peace mass or GIG logistics: ₦3,500.',
      businessHours: 'Monday – Saturday: 9:00 AM – 7:00 PM (WAT).',
      policies:
        '14-day warranty on all electronic accessories with proof of purchase. Defective items tested and swapped immediately.',
    });
    setSuccessMessage('Switched business profile to "NaijaTech Gadgets" preset.');
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold mb-3">
          <Settings className="w-3.5 h-3.5 text-slate-600" />
          <span>Workspace Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Configure business currencies, switch preloaded demo catalogs, and manage local persistence data.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Currency Settings */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
            {currency}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Workspace Currency</h2>
            <p className="text-xs text-slate-500">
              Default currency used for product catalog, orders, and AI price quotations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {availableCurrencies.map((c) => {
            const isSelected = currency === c.symbol;
            return (
              <div
                key={c.code}
                onClick={() => setCurrency(c.symbol)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900">{c.symbol}</span>
                    <span className="text-xs font-bold text-slate-700">{c.code}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{c.name}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Demo Presets */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">SME Profile Presets</h2>
            <p className="text-xs text-slate-500">
              Quickly switch between realistic business scenarios to test the AI workforce
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1">
                LuxeAura Natural Skincare & Beauty
              </span>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Organic serums, black soap cleansers, sunscreens, and Lagos & Abuja logistics.
              </p>
            </div>
            <button
              onClick={handleResetData}
              className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Load Skincare Demo
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1">
                NaijaTech Gadgets & Mobile Hub
              </span>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Powerbanks, wireless earbuds, fast chargers, and Computer Village warranty policies.
              </p>
            </div>
            <button
              onClick={handleLoadTechPreset}
              className="py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Load Tech Store Demo
            </button>
          </div>
        </div>
      </div>

      {/* AI Engine & Security */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">AI Workforce Engine</h2>
            <p className="text-xs text-slate-500">
              Powered by Google Gemini server-side proxy
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">AI Backend Integration</span>
              <span className="text-[11px] text-slate-500">
                Server-side proxy running Express and @google/genai SDK (gemini-3.8-flash)
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              Ready
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Zero Browser Key Exposure</span>
              <span className="text-[11px] text-slate-500">
                API credentials are strictly confined to the backend environment variables.
              </span>
            </div>
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
          </div>
        </div>
      </div>

      {/* Data Management & Reset */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-rose-100">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-rose-950">Data Storage & Reset</h2>
            <p className="text-xs text-slate-500">
              Reset your workspace state or wipe all customer, order, and knowledge data
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Staffly AI uses local browser storage for zero-setup MVP testing. All customers, leads, catalog items, and orders persist when you reload.
        </p>

        {resetConfirm ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-rose-900">
              Are you sure? This will reset all records back to the default sample dataset.
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setResetConfirm(true)}
            className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset All Records to Default Sample Data</span>
          </button>
        )}
      </div>
    </div>
  );
};
