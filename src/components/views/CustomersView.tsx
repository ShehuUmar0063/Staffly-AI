import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, LeadStage, CustomerStatus } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Tag,
  CheckCircle2,
  Trash2,
  Edit2,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface CustomersViewProps {
  onOpenAddCustomer?: () => void;
  onOpenCreateOrderWithCustomer?: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  onOpenAddCustomer,
  onOpenCreateOrderWithCustomer,
}) => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    formatMoney,
    openEmployeeWorkspace,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Lead' | 'Customer'>('All');
  const [stageFilter, setStageFilter] = useState<'All' | LeadStage>('All');

  // Customer Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    interestsInput: '',
    notes: '',
    status: 'Lead' as CustomerStatus,
    leadStage: 'New' as LeadStage,
  });

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormState({
      name: '',
      email: '',
      phone: '',
      location: '',
      interestsInput: '',
      notes: '',
      status: 'Lead',
      leadStage: 'New',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setFormState({
      name: c.name,
      email: c.email,
      phone: c.phone,
      location: c.location,
      interestsInput: c.interests.join(', '),
      notes: c.notes,
      status: c.status,
      leadStage: c.leadStage || 'New',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name) return;

    const parsedInterests = formState.interestsInput
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        location: formState.location,
        interests: parsedInterests,
        notes: formState.notes,
        status: formState.status,
        leadStage: formState.status === 'Lead' ? formState.leadStage : 'Converted',
      });
    } else {
      addCustomer({
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        location: formState.location,
        interests: parsedInterests,
        notes: formState.notes,
        status: formState.status,
        leadStage: formState.status === 'Lead' ? formState.leadStage : 'Converted',
        totalOrders: formState.status === 'Customer' ? 1 : 0,
        totalSpend: 0,
      });
    }

    setIsModalOpen(false);
  };

  const handleQuickStageChange = (customer: Customer, newStage: LeadStage) => {
    const isNowConverted = newStage === 'Converted';
    updateCustomer(customer.id, {
      leadStage: newStage,
      status: isNowConverted ? 'Customer' : customer.status,
    });
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'All' || c.status === filterType;
    const matchesStage = stageFilter === 'All' || c.leadStage === stageFilter;

    return matchesSearch && matchesType && matchesStage;
  });

  const leadCount = customers.filter((c) => c.status === 'Lead').length;
  const convertedCount = customers.filter((c) => c.status === 'Customer').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Customer & Lead Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Customers & Leads
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Record customer interests, organize prospects, and track lead conversion from first inquiry to paid orders.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4 text-teal-400" />
          <span>Add Customer / Lead</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Contacts
          </span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">
            {customers.length}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Leads
          </span>
          <span className="text-2xl font-extrabold text-teal-600 mt-1 block">
            {leadCount}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Converted Buyers
          </span>
          <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
            {convertedCount}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pipeline Health
          </span>
          <span className="text-2xl font-extrabold text-purple-600 mt-1 block">
            {Math.round((convertedCount / (customers.length || 1)) * 100)}% Conv.
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, location, interest..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['All', 'Lead', 'Customer'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filterType === type
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'All' ? 'All Contacts' : type === 'Lead' ? 'Leads Only' : 'Customers Only'}
              </button>
            ))}
          </div>

          {/* Lead Stage filter if Leads is selected or All */}
          {filterType !== 'Customer' && (
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">All Lead Stages</option>
              <option value="New">Stage: New</option>
              <option value="Contacted">Stage: Contacted</option>
              <option value="Converted">Stage: Converted</option>
            </select>
          )}
        </div>
      </div>

      {/* Customers List / Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No matching contacts found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCustomers.map((cust) => {
              const isLead = cust.status === 'Lead';

              return (
                <div
                  key={cust.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Contact Info */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-bold text-base text-slate-900">{cust.name}</h3>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isLead
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {cust.status}
                      </span>

                      {/* Lead Stage Selector */}
                      {isLead && (
                        <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          <span className="text-slate-400 font-medium">Stage:</span>
                          <select
                            value={cust.leadStage || 'New'}
                            onChange={(e) =>
                              handleQuickStageChange(cust, e.target.value as LeadStage)
                            }
                            className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700">{cust.phone || 'No phone'}</span>
                      </span>

                      {cust.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cust.email}</span>
                        </span>
                      )}

                      {cust.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cust.location}</span>
                        </span>
                      )}
                    </div>

                    {/* Interests tags */}
                    {cust.interests && cust.interests.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <Tag className="w-3 h-3 text-slate-400" />
                        {cust.interests.map((interest, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes if present */}
                    {cust.notes && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-200/60 max-w-lg">
                        “{cust.notes}”
                      </p>
                    )}
                  </div>

                  {/* Right: Metrics & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0">
                    <div className="text-right text-xs mr-2">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Orders / Spend
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {cust.totalOrders} orders • {formatMoney(cust.totalSpend)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Open in AI Chat button */}
                      <button
                        onClick={() => openEmployeeWorkspace('sales_assistant')}
                        title="Consult Sales Assistant about this lead"
                        className="p-2 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={() => openEditModal(cust)}
                        title="Edit customer details"
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => deleteCustomer(cust.id)}
                        title="Delete customer record"
                        className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingCustomer ? 'Edit Contact' : 'Add New Customer or Lead'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Babatunde Fashola"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+234 802 334 5566"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Ikeja, Lagos"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Contact Type
                  </label>
                  <select
                    value={formState.status}
                    onChange={(e) =>
                      setFormState({ ...formState, status: e.target.value as CustomerStatus })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Lead">Lead (Prospect)</option>
                    <option value="Customer">Converted Customer</option>
                  </select>
                </div>

                {formState.status === 'Lead' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Lead Stage
                    </label>
                    <select
                      value={formState.leadStage}
                      onChange={(e) =>
                        setFormState({ ...formState, leadStage: e.target.value as LeadStage })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="New">New Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={formState.interestsInput}
                  onChange={(e) => setFormState({ ...formState, interestsInput: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Vitamin C Serum, Sunscreen, Shea Butter"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Operational Notes
                </label>
                <textarea
                  rows={2}
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Requested evening delivery, wholesale interest..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
