export type AIEmployeeRole =
  | 'customer_support'
  | 'sales_assistant'
  | 'order_manager'
  | 'business_assistant';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  inStock: boolean;
}

export interface BusinessKnowledge {
  businessName: string;
  tagline: string;
  industry: string;
  currency: string;
  currencyCode: string;
  description: string;
  products: Product[];
  deliveryInfo: string;
  businessHours: string;
  contactInfo: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
  };
  faqs: Array<{ id: string; question: string; answer: string }>;
  policies: string;
  lastUpdated: string;
}

export type LeadStage = 'New' | 'Contacted' | 'Converted';
export type CustomerStatus = 'Lead' | 'Customer';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  interests: string[];
  notes: string;
  status: CustomerStatus;
  leadStage?: LeadStage;
  totalOrders: number;
  totalSpend: number;
  createdAt: string;
  lastContactedAt: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Completed' | 'Cancelled';

export interface OrderItem {
  id: string;
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  source: 'AI Assistant' | 'Manual' | 'Website';
}

export type ActivityType =
  | 'ai_interaction'
  | 'order_created'
  | 'order_status'
  | 'customer_added'
  | 'lead_converted'
  | 'knowledge_updated';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  employeeRole?: AIEmployeeRole;
  badge?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  orderDraft?: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items: Array<{
      productName: string;
      quantity: number;
      unitPrice: number;
    }>;
    deliveryFee: number;
    totalAmount: number;
  };
  leadDraft?: {
    name: string;
    phone: string;
    email?: string;
    interest?: string;
  };
}

export interface AIEmployeeInfo {
  id: AIEmployeeRole;
  name: string;
  avatar: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  duties: string[];
  status: 'Online' | 'Busy';
  tasksCompleted: number;
  satisfactionRate: string;
  avgResponseTime: string;
  promptStarters: string[];
  specialtyTag: string;
  accentColor: string;
}
