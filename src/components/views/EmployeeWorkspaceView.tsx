import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AIEmployeeRole, ChatMessage } from '../../types';
import { generateClientSmartFallback } from '../../services/aiFallback';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
  Info,
  ChevronDown,
  Loader2,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  UserPlus,
  Share2,
} from 'lucide-react';

export const EmployeeWorkspaceView: React.FC = () => {
  const {
    selectedEmployee,
    setSelectedEmployee,
    employees,
    businessKnowledge,
    customers,
    addCustomer,
    orders,
    addOrder,
    recordAITask,
    addActivity,
    setCurrentView,
    formatMoney,
  } = useApp();

  const currentEmp = employees.find((e) => e.id === selectedEmployee) || employees[0];

  // Chat message state per employee stored in memory
  const [messagesByRole, setMessagesByRole] = useState<Record<AIEmployeeRole, ChatMessage[]>>({
    customer_support: [
      {
        id: 'msg-init-cs',
        role: 'assistant',
        content: `Hello! I am Amina, your AI Customer Support Specialist at **${businessKnowledge.businessName}**. How may I assist you today? Feel free to ask about our products, pricing, delivery options, or store policies.`,
        timestamp: 'Just now',
      },
    ],
    sales_assistant: [
      {
        id: 'msg-init-sa',
        role: 'assistant',
        content: `Welcome! I'm Chidi, your AI Sales Assistant at **${businessKnowledge.businessName}**. Tell me what you're looking for or any skin goals you have, and I will recommend our best-suited products!`,
        timestamp: 'Just now',
      },
    ],
    order_manager: [
      {
        id: 'msg-init-om',
        role: 'assistant',
        content: `Hi there! I am Tunde, your AI Order Manager. I can help compile and verify your order. To get started, please tell me your name, phone number, the items you'd like to purchase, and your delivery location.`,
        timestamp: 'Just now',
      },
    ],
    business_assistant: [
      {
        id: 'msg-init-ba',
        role: 'assistant',
        content: `Greetings! I am Kola, your AI Operations Advisor for **${businessKnowledge.businessName}**. I can summarize your recent orders, review lead conversion status, or draft operational checklists and promotions. What would you like to review?`,
        timestamp: 'Just now',
      },
    ],
  });

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [orderCreatedSuccess, setOrderCreatedSuccess] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const activeMessages = messagesByRole[selectedEmployee] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }
  }, [selectedEmployee]);

  // Helper to parse order draft from assistant text
  const parseOrderDraft = (text: string) => {
    const draftRegex = /<<<ORDER_DRAFT>>>([\s\S]*?)<<<END_ORDER_DRAFT>>>/;
    const match = text.match(draftRegex);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        console.error('Failed to parse order draft JSON:', e);
        return null;
      }
    }
    return null;
  };

  // Helper to parse lead draft from assistant text
  const parseLeadDraft = (text: string) => {
    const leadRegex = /<<<LEAD_DETECTED>>>([\s\S]*?)<<<END_LEAD_DETECTED>>>/;
    const match = text.match(leadRegex);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        console.error('Failed to parse lead draft JSON:', e);
        return null;
      }
    }
    return null;
  };

  const cleanMessageContent = (text: string) => {
    return text
      .replace(/<<<ORDER_DRAFT>>>[\s\S]*?<<<END_ORDER_DRAFT>>>/g, '')
      .replace(/<<<LEAD_DETECTED>>>[\s\S]*?<<<END_LEAD_DETECTED>>>/g, '')
      .trim();
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(cleanMessageContent(text));
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = cleanMessageContent(text).replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice input is not supported by your current browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...activeMessages, userMsg];
    setMessagesByRole((prev) => ({
      ...prev,
      [selectedEmployee]: newMessages,
    }));
    setInputValue('');
    setLoading(true);

    try {
      // Prepare context data for business assistant or order manager
      const contextData = {
        customersCount: customers.length,
        leadsCount: customers.filter((c) => c.status === 'Lead').length,
        ordersCount: orders.length,
        pendingOrdersCount: orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length,
        recentOrders: orders.slice(0, 5).map((o) => ({
          orderNumber: o.orderNumber,
          customerName: o.customerName,
          totalAmount: o.totalAmount,
          status: o.status,
        })),
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeRole: selectedEmployee,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          businessKnowledge,
          contextData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const rawReply = data.reply || "I apologize, I could not complete that request right now.";
      const draft = parseOrderDraft(rawReply);
      const lead = parseLeadDraft(rawReply);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: rawReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        orderDraft: draft || undefined,
        leadDraft: lead || undefined,
      };

      setMessagesByRole((prev) => ({
        ...prev,
        [selectedEmployee]: [...newMessages, assistantMsg],
      }));

      // Record task completed for this AI employee
      recordAITask(selectedEmployee);
    } catch (err: any) {
      console.warn('API endpoint unreachable, generating client-side AI response with business knowledge base:', err);
      // Seamless static hosting fallback (e.g. GitHub Pages without Node server)
      const fallbackReply = generateClientSmartFallback(selectedEmployee, text, businessKnowledge);
      const draft = parseOrderDraft(fallbackReply);
      const lead = parseLeadDraft(fallbackReply);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        orderDraft: draft || undefined,
        leadDraft: lead || undefined,
      };

      setMessagesByRole((prev) => ({
        ...prev,
        [selectedEmployee]: [...newMessages, assistantMsg],
      }));

      recordAITask(selectedEmployee);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessagesByRole((prev) => ({
      ...prev,
      [selectedEmployee]: [
        {
          id: `msg-reset-${Date.now()}`,
          role: 'assistant',
          content: `Chat history cleared. I'm ready to help you with ${currentEmp.name}'s responsibilities!`,
          timestamp: 'Just now',
        },
      ],
    }));
  };

  const handleSaveCapturedLead = (lead: NonNullable<ChatMessage['leadDraft']>) => {
    addCustomer({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      location: 'Inquired via AI Assistant',
      interests: lead.interest ? [lead.interest] : [],
      notes: `Lead captured during consultation with ${currentEmp.name}.`,
      status: 'Lead',
      leadStage: 'New',
      totalOrders: 0,
      totalSpend: 0,
    });

    const confirmMsg: ChatMessage = {
      id: `sys-lead-${Date.now()}`,
      role: 'assistant',
      content: `✅ **Lead "${lead.name}" (${lead.phone}) has been saved to your Customers & Leads database!**\n\nYou can track and convert them anytime in the Customers tab.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesByRole((prev) => ({
      ...prev,
      [selectedEmployee]: [...prev[selectedEmployee], confirmMsg],
    }));
  };

  const handleConfirmAndSaveOrder = (draft: NonNullable<ChatMessage['orderDraft']>) => {
    // Generate order item records
    const orderItems = draft.items.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
    }));

    const calculatedSubtotal = orderItems.reduce((acc, curr) => acc + curr.total, 0);
    const fee = draft.deliveryFee || 2500;
    const finalTotal = draft.totalAmount || calculatedSubtotal + fee;

    const createdOrder = addOrder({
      customerName: draft.customerName || 'Customer',
      customerPhone: draft.customerPhone || 'Not specified',
      deliveryAddress: draft.deliveryAddress || 'Pending confirmation',
      items: orderItems,
      subtotal: calculatedSubtotal,
      deliveryFee: fee,
      totalAmount: finalTotal,
      status: 'Confirmed',
      source: 'AI Assistant',
      notes: `Order compiled and confirmed via AI Order Manager (${currentEmp.name}).`,
    });

    setOrderCreatedSuccess(createdOrder.orderNumber);

    // Append confirmation message in chat
    const confirmMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      role: 'assistant',
      content: `✅ **Order #${createdOrder.orderNumber} has been officially recorded in your Orders database!**\n\n• **Customer:** ${createdOrder.customerName} (${createdOrder.customerPhone})\n• **Address:** ${createdOrder.deliveryAddress}\n• **Total:** ${formatMoney(createdOrder.totalAmount)}\n• **Status:** Confirmed\n\nYou can track and update fulfillment anytime in the Orders tab.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessagesByRole((prev) => ({
      ...prev,
      [selectedEmployee]: [...prev[selectedEmployee], confirmMsg],
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-11rem)] lg:h-[calc(100dvh-8rem)] bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Bar: Employee Identity & Switcher */}
      <div className="bg-slate-900 text-white px-3.5 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setCurrentView('employees')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Back to all employees"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg sm:text-xl shrink-0">
            {currentEmp.avatar}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm sm:text-base text-white truncate">{currentEmp.name}</span>
              <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-800 text-teal-400 border border-slate-700 shrink-0">
                {currentEmp.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live AI
              </span>
              <span>•</span>
              <span className="truncate max-w-[120px] sm:max-w-xs">{businessKnowledge.businessName}</span>
            </div>
          </div>
        </div>

        {/* Right side controls: Role Tabs & Knowledge Info */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Employee Quick Switcher Tabs (Desktop) */}
          <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
            {employees.map((emp) => (
              <button
                key={emp.id}
                onClick={() => setSelectedEmployee(emp.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedEmployee === emp.id
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>{emp.avatar}</span>
                <span>{emp.name}</span>
              </button>
            ))}
          </div>

          {/* View Knowledge button */}
          <button
            onClick={() => setShowKnowledgeModal(true)}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Inspect knowledge base fed to this AI"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Knowledge</span>
          </button>

          {/* Clear Chat */}
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile-only Employee Switcher Pill Strip */}
      <div className="flex md:hidden items-center gap-1.5 px-3 py-1.5 bg-slate-900 border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0 mr-1">
          Role:
        </span>
        {employees.map((emp) => (
          <button
            key={emp.id}
            onClick={() => setSelectedEmployee(emp.id)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1 transition-all cursor-pointer ${
              selectedEmployee === emp.id
                ? 'bg-teal-400 text-slate-950 font-bold shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{emp.avatar}</span>
            <span>{emp.name}</span>
          </button>
        ))}
      </div>

      {/* Suggested Starters Strip */}
      <div className="bg-slate-50 border-b border-slate-200/80 px-4 py-2.5 overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Suggested:
        </span>
        {currentEmp.promptStarters.map((starter, i) => (
          <button
            key={i}
            onClick={() => handleSend(starter)}
            disabled={loading}
            className="shrink-0 text-xs bg-white hover:bg-teal-50 hover:border-teal-300 border border-slate-200/80 text-slate-700 px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {starter}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {activeMessages.map((msg) => {
          const isUser = msg.role === 'user';
          const draft = msg.orderDraft;
          const lead = msg.leadDraft;
          const displayContent = cleanMessageContent(msg.content);

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-xs ${
                  isUser
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-900'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : currentEmp.avatar}
              </div>

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-tr-xs shadow-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {/* Assistant Name Label & Message Actions */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                      <span>{currentEmp.name} • {currentEmp.title}</span>
                      <div className="flex items-center gap-2">
                        <span>{msg.timestamp}</span>
                        {/* Read Aloud button */}
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.id, msg.content)}
                          className="hover:text-teal-600 cursor-pointer p-0.5"
                          title={speakingMsgId === msg.id ? 'Stop audio' : 'Listen to response'}
                        >
                          {speakingMsgId === msg.id ? (
                            <VolumeX className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        {/* Copy button */}
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:text-teal-600 cursor-pointer p-0.5"
                          title="Copy response text"
                        >
                          {copiedMsgId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Markdown-like formatted content */}
                  <div className="whitespace-pre-wrap space-y-1">
                    {displayContent}
                  </div>
                </div>

                {/* Interactive Lead Captured Card if present */}
                {lead && (
                  <div className="bg-white border-2 border-blue-500/40 rounded-2xl p-4 shadow-md text-slate-900 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-900">
                          New Lead Detected in Chat
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Lead Opportunity
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Name</span>
                        <span className="font-semibold text-slate-800">{lead.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone Number</span>
                        <span className="font-semibold text-slate-800">{lead.phone}</span>
                      </div>
                      {lead.interest && (
                        <div className="col-span-2">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Interest</span>
                          <span className="font-medium text-slate-700">{lead.interest}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleSaveCapturedLead(lead)}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Add to Customers & Leads</span>
                    </button>
                  </div>
                )}

                {/* Interactive Order Draft Card if present */}
                {draft && (
                  <div className="bg-white border-2 border-teal-500/40 rounded-2xl p-4 shadow-md text-slate-900 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-teal-600" />
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-900">
                          Order Draft Ready for Confirmation
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        Requires Approval
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer</span>
                        <span className="font-semibold text-slate-800">{draft.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
                        <span className="font-semibold text-slate-800">{draft.customerPhone}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Address</span>
                        <span className="font-medium text-slate-700">{draft.deliveryAddress}</span>
                      </div>
                    </div>

                    {/* Items table */}
                    <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1 border border-slate-200/60">
                      {draft.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-700">
                          <span>
                            {it.quantity}x {it.productName}
                          </span>
                          <span className="font-bold text-slate-900">
                            {formatMoney(it.quantity * it.unitPrice)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-slate-200 pt-1 flex justify-between text-slate-500">
                        <span>Delivery Fee</span>
                        <span>{formatMoney(draft.deliveryFee || 0)}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-1 flex justify-between font-bold text-slate-900 text-sm">
                        <span>Grand Total</span>
                        <span className="text-teal-700">{formatMoney(draft.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Action Button to persist order */}
                    <button
                      onClick={() => handleConfirmAndSaveOrder(draft)}
                      className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Save Order in System</span>
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      *Creates an official order record in your Orders tab with status Confirmed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-900 flex items-center justify-center text-sm shadow-xs">
              {currentEmp.avatar}
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span>{currentEmp.name} is consulting business knowledge...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Field */}
      <div className="p-2.5 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-1.5 sm:gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? 'Listening... click to stop' : 'Click to speak using microphone'}
            className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to voice...'
                : `Ask ${currentEmp.name} (${currentEmp.title})...`
            }
            disabled={loading}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-400">
          <span>Responses are grounded strictly in your Business Knowledge Base.</span>
          <button
            onClick={() => setShowKnowledgeModal(true)}
            className="text-teal-700 hover:underline cursor-pointer flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            <span>View Loaded Context</span>
          </button>
        </div>
      </div>

      {/* Knowledge Context Drawer Modal */}
      {showKnowledgeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <div>
                  <h3 className="font-bold text-base">Active Business Knowledge</h3>
                  <p className="text-xs text-slate-400">Context provided to {currentEmp.name} in real-time</p>
                </div>
              </div>
              <button
                onClick={() => setShowKnowledgeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Business Overview</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {businessKnowledge.description}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">
                  Products Catalog ({businessKnowledge.products?.length || 0})
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {businessKnowledge.products?.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">{p.name}</span>
                        <span className="text-[10px] text-slate-500 block">{p.description}</span>
                      </div>
                      <span className="font-bold text-teal-700">
                        {formatMoney(p.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Delivery Information</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {businessKnowledge.deliveryInfo}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Operating Hours & Contact</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {businessKnowledge.businessHours} • Phone: {businessKnowledge.contactInfo.phone}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Return & Refund Policy</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {businessKnowledge.policies}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <button
                onClick={() => {
                  setShowKnowledgeModal(false);
                  setCurrentView('knowledge');
                }}
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Edit in Business Knowledge Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setShowKnowledgeModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
