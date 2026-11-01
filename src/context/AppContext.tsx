import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  BusinessKnowledge,
  Customer,
  Order,
  ActivityItem,
  AIEmployeeRole,
  AIEmployeeInfo,
} from '../types';
import { StorageService } from '../services/storage';

export type AppView =
  | 'welcome'
  | 'dashboard'
  | 'employees'
  | 'employee_workspace'
  | 'customers'
  | 'orders'
  | 'knowledge'
  | 'reports'
  | 'settings';

export const AI_EMPLOYEES: AIEmployeeInfo[] = [
  {
    id: 'customer_support',
    name: 'Amina',
    avatar: '👩🏾‍💼',
    title: 'AI Customer Support',
    shortDesc: 'Resolves questions on products, pricing, delivery, hours, and store policies.',
    longDesc:
      'Amina acts as your frontline customer support lead. She reads your business knowledge base in real-time, provides exact answers, and never fabricates policies or prices.',
    duties: [
      'Answers common product & stock inquiries',
      'Quotes exact delivery rates and timelines',
      'Explains return, refund, and payment policies',
      'Provides store contact info and operating hours',
    ],
    status: 'Online',
    tasksCompleted: 142,
    satisfactionRate: '98.4%',
    avgResponseTime: '< 2s',
    specialtyTag: 'Frontline Inquiries',
    accentColor: 'from-teal-500 to-emerald-600',
    promptStarters: [
      'Do you deliver outside Lagos and how much does it cost?',
      'What are your store operating hours?',
      'What is your return and refund policy for damaged goods?',
      'Which payment methods do you accept?',
    ],
  },
  {
    id: 'sales_assistant',
    name: 'Chidi',
    avatar: '👨🏾‍💼',
    title: 'AI Sales Assistant',
    shortDesc: 'Recommends products, answers buying questions, and converts leads into buyers.',
    longDesc:
      'Chidi is your proactive sales closer. He learns what prospective customers need, recommends matching items from your catalog, and guides them towards a purchase.',
    duties: [
      'Recommends products tailored to customer needs',
      'Highlights product benefits, ingredients, and specs',
      'Answers pre-purchase questions and compares items',
      'Encourages ready buyers to place an order',
    ],
    status: 'Online',
    tasksCompleted: 89,
    satisfactionRate: '97.2%',
    avgResponseTime: '< 2s',
    specialtyTag: 'Conversion & Upsell',
    accentColor: 'from-blue-600 to-indigo-600',
    promptStarters: [
      'Which product do you recommend for fading dark spots and glowing skin?',
      'What are your top 3 best-selling products right now?',
      'I have very dry skin, what is your most hydrating body product?',
      'Do you have any sun protection products with no white cast?',
    ],
  },
  {
    id: 'order_manager',
    name: 'Tunde',
    avatar: '👨🏾‍💻',
    title: 'AI Order Manager',
    shortDesc: 'Collects order details, calculates totals, and creates confirmed orders.',
    longDesc:
      'Tunde handles the transactional flow. He gathers buyer details, ensures item availability, computes prices accurately, and prepares verified orders for fulfillment.',
    duties: [
      'Collects buyer name, phone, and delivery address',
      'Compiles order items with correct catalog prices',
      'Calculates subtotals, delivery fees, and order totals',
      'Generates actionable order drafts for 1-click database registration',
    ],
    status: 'Online',
    tasksCompleted: 64,
    satisfactionRate: '99.1%',
    avgResponseTime: '< 2s',
    specialtyTag: 'Order Intake & Tracking',
    accentColor: 'from-amber-500 to-orange-600',
    promptStarters: [
      'I want to place an order for 2 Vitamin C Serums to Lekki, Lagos',
      'Can you help me order the Shea Butter Cream and Black Soap?',
      'How much would it cost to deliver 3 Sunscreens to Abuja?',
      'I need an order draft for Chioma Okonkwo',
    ],
  },
  {
    id: 'business_assistant',
    name: 'Kola',
    avatar: '👨🏾‍💼',
    title: 'AI Business Assistant',
    shortDesc: 'Summarizes activity, analyzes leads, and provides operational growth advice.',
    longDesc:
      'Kola serves as your executive operations advisor. He inspects your customer pipeline, summarizes pending orders, and drafts promotions and operational checklists.',
    duties: [
      'Summarizes orders, revenue, and active leads',
      'Identifies pending orders needing urgent dispatch',
      'Suggests seasonal marketing campaigns & promotions',
      'Advises on SME growth and inventory management',
    ],
    status: 'Online',
    tasksCompleted: 53,
    satisfactionRate: '96.8%',
    avgResponseTime: '< 2s',
    specialtyTag: 'Operations & Strategy',
    accentColor: 'from-violet-600 to-purple-700',
    promptStarters: [
      'Summarize our current orders status and pending dispatches',
      'Review our active leads and suggest follow-up actions',
      'Draft a WhatsApp promotional message for our Vitamin C Serum',
      'What operational improvements do you recommend for our Lagos delivery workflow?',
    ],
  },
];

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedEmployee: AIEmployeeRole;
  setSelectedEmployee: (role: AIEmployeeRole) => void;
  openEmployeeWorkspace: (role: AIEmployeeRole) => void;

  businessKnowledge: BusinessKnowledge;
  updateBusinessKnowledge: (bk: BusinessKnowledge) => void;

  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'createdAt' | 'lastContactedAt'>) => Customer;
  updateCustomer: (id: string, cust: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrder: (id: string, order: Partial<Order>) => void;
  deleteOrder: (id: string) => void;

  activities: ActivityItem[];
  addActivity: (act: Omit<ActivityItem, 'id' | 'timestamp'>) => void;

  aiTaskCounts: Record<AIEmployeeRole, number>;
  recordAITask: (role: AIEmployeeRole) => void;

  currency: string;
  setCurrency: (cur: string) => void;
  formatMoney: (amount: number) => string;

  employees: AIEmployeeInfo[];
  resetAllData: () => void;

  hasApiKey: boolean;
  activeGuestSession: boolean;
  enterGuestDashboard: () => void;
  exitToWelcome: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [activeGuestSession, setActiveGuestSession] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<AIEmployeeRole>('customer_support');

  const [businessKnowledge, setBusinessKnowledgeState] = useState<BusinessKnowledge>(() =>
    StorageService.getBusinessKnowledge()
  );
  const [customers, setCustomersState] = useState<Customer[]>(() =>
    StorageService.getCustomers()
  );
  const [orders, setOrdersState] = useState<Order[]>(() =>
    StorageService.getOrders()
  );
  const [activities, setActivitiesState] = useState<ActivityItem[]>(() =>
    StorageService.getActivities()
  );
  const [aiTaskCounts, setAiTaskCountsState] = useState<Record<AIEmployeeRole, number>>(() =>
    StorageService.getAITasksCount()
  );
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    // Check health endpoint for API key availability
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasApiKey) {
          setHasApiKey(true);
        }
      })
      .catch(() => {});
  }, []);

  const updateBusinessKnowledge = (bk: BusinessKnowledge) => {
    const updated = { ...bk, lastUpdated: new Date().toISOString() };
    setBusinessKnowledgeState(updated);
    StorageService.saveBusinessKnowledge(updated);

    addActivity({
      type: 'knowledge_updated',
      title: 'Business Knowledge Updated',
      description: `Saved profile updates for "${bk.businessName}".`,
      badge: 'Knowledge',
    });
  };

  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt' | 'lastContactedAt'>): Customer => {
    const newCustomer: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastContactedAt: new Date().toISOString(),
    };
    const updated = [newCustomer, ...customers];
    setCustomersState(updated);
    StorageService.saveCustomers(updated);

    addActivity({
      type: 'customer_added',
      title: `Added ${custData.status}: ${custData.name}`,
      description: `${custData.location ? `${custData.location} • ` : ''}${custData.interests.join(', ') || 'No interests noted'}`,
      badge: custData.status === 'Lead' ? 'New Lead' : 'Customer',
    });

    return newCustomer;
  };

  const updateCustomer = (id: string, custData: Partial<Customer>) => {
    const updated = customers.map((c) => {
      if (c.id === id) {
        const isConverting = c.status === 'Lead' && custData.status === 'Customer';
        if (isConverting) {
          addActivity({
            type: 'lead_converted',
            title: `Lead Converted: ${c.name}`,
            description: `Upgraded to active Customer status with ${custData.totalOrders ?? c.totalOrders} orders.`,
            badge: 'Conversion',
          });
        }
        return { ...c, ...custData, lastContactedAt: new Date().toISOString() };
      }
      return c;
    });
    setCustomersState(updated);
    StorageService.saveCustomers(updated);
  };

  const deleteCustomer = (id: string) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomersState(updated);
    StorageService.saveCustomers(updated);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `STF-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newOrder, ...orders];
    setOrdersState(updated);
    StorageService.saveOrders(updated);

    addActivity({
      type: 'order_created',
      title: `New Order #${newOrder.orderNumber}`,
      description: `${newOrder.customerName} ordered ${newOrder.items.length} item(s) • ${businessKnowledge.currency}${newOrder.totalAmount.toLocaleString()}`,
      badge: 'Order Created',
      employeeRole: orderData.source === 'AI Assistant' ? 'order_manager' : undefined,
    });

    // If customer exists, update spend
    if (orderData.customerName) {
      const existing = customers.find(
        (c) =>
          c.name.toLowerCase() === orderData.customerName.toLowerCase() ||
          (orderData.customerPhone && c.phone.includes(orderData.customerPhone.slice(-7)))
      );
      if (existing) {
        updateCustomer(existing.id, {
          status: 'Customer',
          leadStage: 'Converted',
          totalOrders: existing.totalOrders + 1,
          totalSpend: existing.totalSpend + orderData.totalAmount,
        });
      }
    }

    return newOrder;
  };

  const updateOrder = (id: string, orderData: Partial<Order>) => {
    const updated = orders.map((o) => {
      if (o.id === id) {
        if (orderData.status && orderData.status !== o.status) {
          addActivity({
            type: 'order_status',
            title: `Order #${o.orderNumber} Status: ${orderData.status}`,
            description: `Order for ${o.customerName} updated from ${o.status} to ${orderData.status}.`,
            badge: orderData.status,
          });
        }
        return { ...o, ...orderData, updatedAt: new Date().toISOString() };
      }
      return o;
    });
    setOrdersState(updated);
    StorageService.saveOrders(updated);
  };

  const deleteOrder = (id: string) => {
    const updated = orders.filter((o) => o.id !== id);
    setOrdersState(updated);
    StorageService.saveOrders(updated);
  };

  const addActivity = (actData: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...actData,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Just now',
    };
    const updated = [newActivity, ...activities.slice(0, 30)];
    setActivitiesState(updated);
    StorageService.saveActivities(updated);
  };

  const recordAITask = (role: AIEmployeeRole) => {
    const updated = {
      ...aiTaskCounts,
      [role]: (aiTaskCounts[role] || 0) + 1,
    };
    setAiTaskCountsState(updated);
    StorageService.saveAITasksCount(updated);
  };

  const setCurrency = (cur: string) => {
    updateBusinessKnowledge({
      ...businessKnowledge,
      currency: cur,
    });
  };

  const formatMoney = (amount: number): string => {
    const symbol = businessKnowledge.currency || '₦';
    return `${symbol}${amount.toLocaleString('en-US')}`;
  };

  const resetAllData = () => {
    StorageService.resetToSampleData();
    setBusinessKnowledgeState(StorageService.getBusinessKnowledge());
    setCustomersState(StorageService.getCustomers());
    setOrdersState(StorageService.getOrders());
    setActivitiesState(StorageService.getActivities());
    setAiTaskCountsState(StorageService.getAITasksCount());
  };

  const enterGuestDashboard = () => {
    setActiveGuestSession(true);
    setCurrentView('dashboard');
  };

  const exitToWelcome = () => {
    setCurrentView('welcome');
  };

  const openEmployeeWorkspace = (role: AIEmployeeRole) => {
    setSelectedEmployee(role);
    setCurrentView('employee_workspace');
  };

  // Keep employee counts in sync
  const employees: AIEmployeeInfo[] = AI_EMPLOYEES.map((emp) => ({
    ...emp,
    tasksCompleted: aiTaskCounts[emp.id] ?? emp.tasksCompleted,
  }));

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedEmployee,
        setSelectedEmployee,
        openEmployeeWorkspace,
        businessKnowledge,
        updateBusinessKnowledge,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        activities,
        addActivity,
        aiTaskCounts,
        recordAITask,
        currency: businessKnowledge.currency || '₦',
        setCurrency,
        formatMoney,
        employees,
        resetAllData,
        hasApiKey,
        activeGuestSession,
        enterGuestDashboard,
        exitToWelcome,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
