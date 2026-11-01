import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, BusinessKnowledge } from '../../types';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  Store,
  Truck,
  Clock,
  Phone,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const KnowledgeView: React.FC = () => {
  const {
    businessKnowledge,
    updateBusinessKnowledge,
    openEmployeeWorkspace,
    formatMoney,
    currency,
  } = useApp();

  const [formData, setFormData] = useState<BusinessKnowledge>(businessKnowledge);
  const [activeTab, setActiveTab] = useState<'profile' | 'products' | 'delivery' | 'faqs' | 'policies'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: 0,
    description: '',
    inStock: true,
  });

  // FAQ modal state
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

  const handleSaveAll = () => {
    updateBusinessKnowledge(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Product handlers
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'General',
      price: 5000,
      description: '',
      inStock: true,
    });
    setShowProductModal(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category || 'General',
      price: prod.price,
      description: prod.description,
      inStock: prod.inStock,
    });
    setShowProductModal(true);
  };

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;

    let updatedProducts: Product[];
    if (editingProduct) {
      updatedProducts = formData.products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: productForm.name,
              category: productForm.category,
              price: Number(productForm.price),
              description: productForm.description,
              inStock: productForm.inStock,
            }
          : p
      );
    } else {
      const newP: Product = {
        id: `prod-${Date.now()}`,
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        description: productForm.description,
        inStock: productForm.inStock,
      };
      updatedProducts = [...formData.products, newP];
    }

    const updated = { ...formData, products: updatedProducts };
    setFormData(updated);
    updateBusinessKnowledge(updated);
    setShowProductModal(false);
  };

  const toggleProductStock = (id: string) => {
    const updatedProducts = formData.products.map((p) =>
      p.id === id ? { ...p, inStock: !p.inStock } : p
    );
    const updated = { ...formData, products: updatedProducts };
    setFormData(updated);
    updateBusinessKnowledge(updated);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = formData.products.filter((p) => p.id !== id);
    const updated = { ...formData, products: updatedProducts };
    setFormData(updated);
    updateBusinessKnowledge(updated);
  };

  // FAQ Handlers
  const openAddFaq = () => {
    setEditingFaqId(null);
    setFaqForm({ question: '', answer: '' });
    setShowFaqModal(true);
  };

  const openEditFaq = (faq: { id: string; question: string; answer: string }) => {
    setEditingFaqId(faq.id);
    setFaqForm({ question: faq.question, answer: faq.answer });
    setShowFaqModal(true);
  };

  const saveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;

    let updatedFaqs;
    if (editingFaqId) {
      updatedFaqs = formData.faqs.map((f) =>
        f.id === editingFaqId ? { ...f, question: faqForm.question, answer: faqForm.answer } : f
      );
    } else {
      updatedFaqs = [
        ...formData.faqs,
        { id: `faq-${Date.now()}`, question: faqForm.question, answer: faqForm.answer },
      ];
    }

    const updated = { ...formData, faqs: updatedFaqs };
    setFormData(updated);
    updateBusinessKnowledge(updated);
    setShowFaqModal(false);
  };

  const deleteFaq = (id: string) => {
    const updatedFaqs = formData.faqs.filter((f) => f.id !== id);
    const updated = { ...formData, faqs: updatedFaqs };
    setFormData(updated);
    updateBusinessKnowledge(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            <span>Single Source of Truth</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Business Knowledge
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Everything your AI workforce knows comes directly from this page. Keep your catalog, prices, delivery rates, and policies up to date so your AI employees reply accurately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => openEmployeeWorkspace('customer_support')}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Test with AI Support</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Business knowledge saved successfully! All 4 AI employees are now synced.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-1.5 flex items-center overflow-x-auto gap-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Business Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Products & Catalog ({formData.products?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'delivery'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Delivery & Hours</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'faqs'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQs ({formData.faqs?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'policies'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Policies & Refunds</span>
        </button>
      </div>

      {/* Tab 1: Business Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">General Information</h2>
            <p className="text-xs text-slate-500">Your core business identity presented by the AI employees</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. LuxeAura Skincare"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Industry / Category
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Health & Beauty / Cosmetics"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Business Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Premium organic beauty crafted for glowing, healthy skin"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Comprehensive Business Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Detailed description of what your business does, where you are located, and what sets you apart..."
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The AI assistants reference this description to understand your mission, brand voice, and offerings.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Products & Catalog */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Products & Services Catalog</h2>
              <p className="text-xs text-slate-500">
                Products your Sales and Customer Support AI recommend and sell
              </p>
            </div>
            <button
              onClick={openAddProduct}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formData.products?.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {prod.category || 'Product'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleProductStock(prod.id)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        prod.inStock
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      }`}
                      title="Click to toggle in-stock status"
                    >
                      {prod.inStock ? '● In Stock' : '○ Out of Stock'}
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{prod.name}</h3>
                  <p className="text-base font-extrabold text-teal-700 mb-2">
                    {formatMoney(prod.price)}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {prod.description}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditProduct(prod)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => deleteProduct(prod.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  <button
                    onClick={() => openEmployeeWorkspace('customer_support')}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer hover:underline"
                    title="Ask AI Customer Support about this product"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Test AI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Delivery & Logistics */}
      {activeTab === 'delivery' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Delivery Information & Business Hours</h2>
            <p className="text-xs text-slate-500">
              Details quoted by AI Customer Support when buyers ask about shipping fees and timings
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Delivery Rates, Cities & Timelines
              </label>
              <textarea
                rows={4}
                value={formData.deliveryInfo}
                onChange={(e) => setFormData({ ...formData, deliveryInfo: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="State your dispatch rates for local (e.g. Lagos), interstate, timelines (e.g. 2-3 business days), and courier partners..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Store Operating Hours
              </label>
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g. Monday – Saturday: 8:30 AM – 6:30 PM (WAT)"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Customer Support Phone
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, phone: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+234 803 123 4567"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  WhatsApp Support Line
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.whatsapp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, whatsapp: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+234 812 987 6543"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Physical Store / Dispatch Address
                </label>
                <input
                  type="text"
                  value={formData.contactInfo.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, address: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Street address, City, State"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Save Delivery Info
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500">
                Direct answers the AI Support employee provides when customers ask common questions
              </p>
            </div>
            <button
              onClick={openAddFaq}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.faqs?.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-2 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xs shrink-0 font-extrabold">
                      Q
                    </span>
                    <span>{faq.question}</span>
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditFaq(faq)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-600 pl-7 leading-relaxed whitespace-pre-wrap">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Policies & Refunds */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Return, Refund & Store Policies</h2>
            <p className="text-xs text-slate-500">
              Clear rules preventing disputes. The AI will never invent return policies or refund promises outside this text.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Policy Content
            </label>
            <textarea
              rows={6}
              value={formData.policies}
              onChange={(e) => setFormData({ ...formData, policies: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              placeholder="e.g. 7-day return policy for unopened items. Damaged items replaced free upon photo proof within 24 hours..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Save Policies
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit Product */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Glowing Face Oil (50ml)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Serums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Price ({currency}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description & Key Benefits
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Highlight key ingredients, usage instructions, or package contents..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                />
                <label htmlFor="inStockCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Available in Stock (AI will recommend and permit orders)
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit FAQ */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingFaqId ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button
                onClick={() => setShowFaqModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Customer Question *
                </label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Do you have a physical store for pickup?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Official Business Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Provide the exact factual answer your AI Support agent should quote..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
