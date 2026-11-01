import { BusinessKnowledge, Customer, Order, ActivityItem, AIEmployeeRole } from '../types';

export const INITIAL_BUSINESS_KNOWLEDGE: BusinessKnowledge = {
  businessName: 'LuxeAura Skincare & Wellness',
  tagline: 'Premium organic beauty crafted for glowing, healthy skin.',
  industry: 'Health & Beauty / Cosmetics',
  currency: '₦',
  currencyCode: 'NGN',
  description:
    'LuxeAura is a premier Nigerian natural skincare and personal care brand based in Lagos. We formulate chemical-free serums, black soap cleansers, shea body butters, and sunscreen specially developed for tropical skin tones.',
  products: [
    {
      id: 'prod-1',
      name: 'Glow Radiance Vitamin C Serum (30ml)',
      category: 'Serums',
      price: 12500,
      description: 'Brightens dark spots, evens hyperpigmentation, and boosts natural collagen.',
      inStock: true,
    },
    {
      id: 'prod-2',
      name: 'Whipped Shea & Cocoa Butter Cream (250g)',
      category: 'Body Care',
      price: 8500,
      description: 'Deep moisture treatment for dry, textured skin infused with sweet almond oil.',
      inStock: true,
    },
    {
      id: 'prod-3',
      name: 'Purifying African Black Soap Liquid Cleanser (500ml)',
      category: 'Face & Body Wash',
      price: 6500,
      description: 'Gentle clarifying wash with tea tree oil, turmeric, and raw honey for acne-prone skin.',
      inStock: true,
    },
    {
      id: 'prod-4',
      name: 'Hydra-Shield SPF 50 Invisible Sunscreen (50ml)',
      category: 'Sun Protection',
      price: 14000,
      description: 'Ultra-lightweight, zero white cast sunscreen with hyaluronic acid and niacinamide.',
      inStock: true,
    },
    {
      id: 'prod-5',
      name: 'Clarifying Rosewater & Witch Hazel Toner (150ml)',
      category: 'Toners',
      price: 5500,
      description: 'Minimizes enlarged pores, balances skin pH, and cools irritated skin.',
      inStock: false,
    },
  ],
  deliveryInfo:
    'Lagos Island & Mainland dispatch: ₦2,500 (Same-day or next-day delivery). Major cities (Abuja, Port Harcourt, Ibadan, Benin): ₦4,500 (2 to 3 working days via GIG Logistics). Free shipping on orders above ₦50,000.',
  businessHours: 'Monday – Saturday: 8:30 AM – 6:30 PM (WAT). Sunday: Closed for store pick-ups, but online AI orders are recorded 24/7.',
  contactInfo: {
    phone: '+234 803 456 7890',
    whatsapp: '+234 812 987 6543',
    email: 'hello@luxeaura.ng',
    address: 'Suite 14, Admiralty Plaza, Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
  },
  faqs: [
    {
      id: 'faq-1',
      question: 'Are your products safe for sensitive and acne-prone skin?',
      answer:
        'Yes! All LuxeAura products are dermatologist-tested, hypoallergenic, and formulated without harsh parabens, sulfates, or bleaching agents.',
    },
    {
      id: 'faq-2',
      question: 'Do you deliver outside Lagos?',
      answer:
        'Yes, we ship nationwide across all 36 states in Nigeria using reliable courier partners (GIG Logistics, DHL, and Speedaf). Interstate delivery typically takes 2 to 4 business days.',
    },
    {
      id: 'faq-3',
      question: 'How do I know which serum is right for my skin concerns?',
      answer:
        'For dark spots, sun damage, and dullness, we strongly recommend our Vitamin C Serum. If you are struggling with active breakouts, pair our African Black Soap Cleanser with the Hydra-Shield Sunscreen.',
    },
    {
      id: 'faq-4',
      question: 'What payment methods do you accept?',
      answer:
        'We accept direct bank transfers, USSD, debit cards via Paystack/Flutterwave, and Pay on Delivery for verified Lagos customers.',
    },
  ],
  policies:
    'Return and Refund Policy: We offer a 7-day hassle-free replacement or store credit for sealed, undamaged products. If an item arrives broken or leaked during transit, please notify us within 24 hours with photos for an immediate free replacement. For hygiene and safety reasons, opened cosmetics cannot be refunded.',
  lastUpdated: new Date().toISOString(),
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Chioma Okonkwo',
    email: 'chioma.o@gmail.com',
    phone: '+234 802 334 1122',
    location: 'Lekki Phase 1, Lagos',
    interests: ['Vitamin C Serum', 'Sunscreen SPF 50', 'Anti-aging'],
    notes: 'Loyal customer. Prefers doorstep delivery after 5 PM.',
    status: 'Customer',
    leadStage: 'Converted',
    totalOrders: 4,
    totalSpend: 78000,
    createdAt: '2026-09-12T10:14:00Z',
    lastContactedAt: '2026-10-28T14:20:00Z',
  },
  {
    id: 'cust-2',
    name: 'Babajide Adeleke',
    email: 'baba.adeleke@outlook.com',
    phone: '+234 809 555 8899',
    location: 'Ikeja GRA, Lagos',
    interests: ['African Black Soap', 'Shea Butter Cream'],
    notes: 'Inquired about wholesale bulk discount for salon gift packs.',
    status: 'Lead',
    leadStage: 'Contacted',
    totalOrders: 0,
    totalSpend: 0,
    createdAt: '2026-10-22T08:30:00Z',
    lastContactedAt: '2026-10-29T11:45:00Z',
  },
  {
    id: 'cust-3',
    name: 'Zainab Mohammed',
    email: 'zainab.m@abuja.biz',
    phone: '+234 814 678 9012',
    location: 'Wuse 2, Abuja',
    interests: ['Sunscreen SPF 50', 'Glow Radiance Serum'],
    notes: 'Saw Instagram ad. Asked about interstate shipping times to Abuja.',
    status: 'Lead',
    leadStage: 'New',
    totalOrders: 0,
    totalSpend: 0,
    createdAt: '2026-10-30T16:05:00Z',
    lastContactedAt: '2026-10-30T16:05:00Z',
  },
  {
    id: 'cust-4',
    name: 'Emeka Umeh',
    email: 'emeka.umeh@ymail.com',
    phone: '+234 703 112 4455',
    location: 'GRA Phase 2, Port Harcourt',
    interests: ['Shea & Cocoa Butter', 'African Black Soap'],
    notes: 'Ordered 2 tubs of shea butter. Very satisfied with delivery speed.',
    status: 'Customer',
    leadStage: 'Converted',
    totalOrders: 2,
    totalSpend: 34000,
    createdAt: '2026-10-04T12:00:00Z',
    lastContactedAt: '2026-10-24T09:15:00Z',
  },
  {
    id: 'cust-5',
    name: 'Funke Balogun',
    email: 'funke.b@lagoshealth.org',
    phone: '+234 816 777 3321',
    location: 'Victoria Island, Lagos',
    interests: ['Sunscreen SPF 50'],
    notes: 'Wants 3 bottles for outdoor sporting event. Contacted on WhatsApp.',
    status: 'Lead',
    leadStage: 'Contacted',
    totalOrders: 0,
    totalSpend: 0,
    createdAt: '2026-10-29T15:20:00Z',
    lastContactedAt: '2026-10-31T09:00:00Z',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'STF-1041',
    customerId: 'cust-1',
    customerName: 'Chioma Okonkwo',
    customerPhone: '+234 802 334 1122',
    customerEmail: 'chioma.o@gmail.com',
    deliveryAddress: 'Block 4, Flat B, Admiralty Homes, Lekki Phase 1, Lagos',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Glow Radiance Vitamin C Serum (30ml)',
        quantity: 2,
        unitPrice: 12500,
        total: 25000,
      },
      {
        id: 'item-2',
        productId: 'prod-4',
        productName: 'Hydra-Shield SPF 50 Invisible Sunscreen (50ml)',
        quantity: 1,
        unitPrice: 14000,
        total: 14000,
      },
    ],
    subtotal: 39000,
    deliveryFee: 2500,
    totalAmount: 41500,
    status: 'Completed',
    notes: 'Customer confirmed package received in good condition.',
    createdAt: '2026-10-26T14:10:00Z',
    updatedAt: '2026-10-27T16:30:00Z',
    source: 'Website',
  },
  {
    id: 'ord-102',
    orderNumber: 'STF-1042',
    customerId: 'cust-4',
    customerName: 'Emeka Umeh',
    customerPhone: '+234 703 112 4455',
    customerEmail: 'emeka.umeh@ymail.com',
    deliveryAddress: '19 Tombia Street, GRA Phase 2, Port Harcourt, Rivers State',
    items: [
      {
        id: 'item-3',
        productId: 'prod-2',
        productName: 'Whipped Shea & Cocoa Butter Cream (250g)',
        quantity: 2,
        unitPrice: 8500,
        total: 17000,
      },
      {
        id: 'item-4',
        productId: 'prod-3',
        productName: 'Purifying African Black Soap Liquid Cleanser (500ml)',
        quantity: 1,
        unitPrice: 6500,
        total: 6500,
      },
    ],
    subtotal: 23500,
    deliveryFee: 4500,
    totalAmount: 28000,
    status: 'Processing',
    notes: 'Dispatched via GIG Logistics tracking #GIG-PH-88219.',
    createdAt: '2026-10-29T10:45:00Z',
    updatedAt: '2026-10-30T09:15:00Z',
    source: 'AI Assistant',
  },
  {
    id: 'ord-103',
    orderNumber: 'STF-1043',
    customerName: 'Dr. Halima Abubakar',
    customerPhone: '+234 805 999 1234',
    customerEmail: 'halima.abubakar@gmail.com',
    deliveryAddress: 'Plot 312, Constitution Avenue, Central Business District, Abuja',
    items: [
      {
        id: 'item-5',
        productId: 'prod-4',
        productName: 'Hydra-Shield SPF 50 Invisible Sunscreen (50ml)',
        quantity: 3,
        unitPrice: 14000,
        total: 42000,
      },
    ],
    subtotal: 42000,
    deliveryFee: 4500,
    totalAmount: 46500,
    status: 'Confirmed',
    notes: 'Payment confirmed via bank transfer. Packaged awaiting carrier pickup.',
    createdAt: '2026-10-31T11:20:00Z',
    updatedAt: '2026-10-31T12:00:00Z',
    source: 'AI Assistant',
  },
  {
    id: 'ord-104',
    orderNumber: 'STF-1044',
    customerName: 'Folake Adele',
    customerPhone: '+234 818 222 3456',
    deliveryAddress: '15 Allen Avenue, Ikeja, Lagos',
    items: [
      {
        id: 'item-6',
        productId: 'prod-1',
        productName: 'Glow Radiance Vitamin C Serum (30ml)',
        quantity: 1,
        unitPrice: 12500,
        total: 12500,
      },
    ],
    subtotal: 12500,
    deliveryFee: 2500,
    totalAmount: 15000,
    status: 'Pending',
    notes: 'Order initiated via AI Order Manager. Awaiting rider assignment.',
    createdAt: '2026-10-31T17:15:00Z',
    updatedAt: '2026-10-31T17:15:00Z',
    source: 'AI Assistant',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'ai_interaction',
    title: 'AI Customer Support resolved inquiry',
    description: 'Amina answered customer query on interstate shipping rates and delivery timelines to Abuja.',
    timestamp: '15 minutes ago',
    employeeRole: 'customer_support',
    badge: 'Support',
  },
  {
    id: 'act-2',
    type: 'order_created',
    title: 'New Order #STF-1044 placed',
    description: 'Tunde drafted and registered an order for Folake Adele (₦15,000) via AI Order Manager.',
    timestamp: '1 hour ago',
    employeeRole: 'order_manager',
    badge: 'Order',
  },
  {
    id: 'act-3',
    type: 'lead_converted',
    title: 'Lead converted to Customer',
    description: 'Chioma Okonkwo completed order #STF-1041. Total spend increased to ₦78,000.',
    timestamp: '3 hours ago',
    badge: 'Growth',
  },
  {
    id: 'act-4',
    type: 'ai_interaction',
    title: 'Sales Consultation completed',
    description: 'Chidi recommended the Vitamin C Serum and Sunscreen combo to a prospect in Victoria Island.',
    timestamp: '5 hours ago',
    employeeRole: 'sales_assistant',
    badge: 'Sales',
  },
  {
    id: 'act-5',
    type: 'knowledge_updated',
    title: 'Knowledge Base updated',
    description: 'Updated holiday delivery policy and added FAQ for sensitive skin.',
    timestamp: 'Yesterday',
    badge: 'Knowledge',
  },
];

const STORAGE_KEYS = {
  KNOWLEDGE: 'staffly_knowledge_v1',
  CUSTOMERS: 'staffly_customers_v1',
  ORDERS: 'staffly_orders_v1',
  ACTIVITIES: 'staffly_activities_v1',
  AI_TASKS: 'staffly_ai_tasks_v1',
};

export const StorageService = {
  getBusinessKnowledge(): BusinessKnowledge {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE);
      return data ? JSON.parse(data) : INITIAL_BUSINESS_KNOWLEDGE;
    } catch {
      return INITIAL_BUSINESS_KNOWLEDGE;
    }
  },

  saveBusinessKnowledge(knowledge: BusinessKnowledge): void {
    try {
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(knowledge));
    } catch (e) {
      console.error('Failed to save business knowledge:', e);
    }
  },

  getCustomers(): Customer[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  },

  saveCustomers(customers: Customer[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save customers:', e);
    }
  },

  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  },

  getActivities(): ActivityItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  },

  saveActivities(activities: ActivityItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (e) {
      console.error('Failed to save activities:', e);
    }
  },

  getAITasksCount(): Record<AIEmployeeRole, number> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AI_TASKS);
      return data
        ? JSON.parse(data)
        : {
            customer_support: 142,
            sales_assistant: 89,
            order_manager: 64,
            business_assistant: 53,
          };
    } catch {
      return {
        customer_support: 142,
        sales_assistant: 89,
        order_manager: 64,
        business_assistant: 53,
      };
    }
  },

  saveAITasksCount(counts: Record<AIEmployeeRole, number>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AI_TASKS, JSON.stringify(counts));
    } catch (e) {
      console.error('Failed to save AI tasks:', e);
    }
  },

  resetToSampleData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.KNOWLEDGE);
      localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
      localStorage.removeItem(STORAGE_KEYS.ORDERS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.AI_TASKS);
    } catch (e) {
      console.error('Failed to reset data:', e);
    }
  },
};
