import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

interface BusinessKnowledgePayload {
  businessName: string;
  tagline?: string;
  industry?: string;
  currency?: string;
  description?: string;
  products?: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    category?: string;
    inStock: boolean;
  }>;
  deliveryInfo?: string;
  businessHours?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    whatsapp?: string;
  };
  faqs?: Array<{ question: string; answer: string }>;
  policies?: string;
}

interface ChatRequestBody {
  employeeRole: 'customer_support' | 'sales_assistant' | 'order_manager' | 'business_assistant';
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  businessKnowledge: BusinessKnowledgePayload;
  contextData?: {
    customersCount?: number;
    leadsCount?: number;
    ordersCount?: number;
    pendingOrdersCount?: number;
    recentOrders?: Array<{
      orderNumber: string;
      customerName: string;
      totalAmount: number;
      status: string;
    }>;
  };
}

function buildSystemInstruction(
  role: ChatRequestBody['employeeRole'],
  bk: BusinessKnowledgePayload,
  contextData?: ChatRequestBody['contextData']
): string {
  const currency = bk.currency || '₦';
  const productsList = bk.products && bk.products.length > 0
    ? bk.products
        .map(
          (p) =>
            `- ${p.name} (${currency}${p.price.toLocaleString()}): ${p.description || 'Quality product'} [${p.inStock ? 'In Stock' : 'Out of Stock'}]`
        )
        .join('\n')
    : 'No products listed yet.';

  const faqsList = bk.faqs && bk.faqs.length > 0
    ? bk.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
    : 'No FAQs added.';

  const baseKnowledge = `
=== BUSINESS KNOWLEDGE BASE ===
Business Name: ${bk.businessName}
Tagline: ${bk.tagline || 'N/A'}
Industry: ${bk.industry || 'General Business'}
Description: ${bk.description || 'N/A'}
Currency: ${currency}

Products & Catalog:
${productsList}

Delivery & Logistics:
${bk.deliveryInfo || 'Standard delivery terms apply.'}

Business Hours:
${bk.businessHours || 'Monday to Saturday, 9am - 6pm.'}

Contact Details:
- Phone: ${bk.contactInfo?.phone || 'Not provided'}
- WhatsApp: ${bk.contactInfo?.whatsapp || 'Not provided'}
- Email: ${bk.contactInfo?.email || 'Not provided'}
- Physical Address: ${bk.contactInfo?.address || 'Not provided'}

Frequently Asked Questions:
${faqsList}

Return, Refund & Store Policies:
${bk.policies || 'Standard store policies apply.'}
===============================
`;

  switch (role) {
    case 'customer_support':
      return `You are Amina, the Senior AI Customer Support Specialist at ${bk.businessName}.
Your duties:
1. Respond to customer inquiries warmly, professionally, and clearly.
2. Use ONLY the Business Knowledge Base provided above to answer questions about products, prices, delivery logistics, hours, FAQs, and policies.
3. CRITICAL MANDATE: If any requested information is missing, unlisted, or outside the knowledge base, you MUST explicitly state that you do not have that specific information in your current records rather than inventing or guessing prices, policies, or product details. Direct them to contact ${bk.contactInfo?.phone || 'the support team'} directly for customized requests.
4. Keep answers concise, helpful, and natural. Use the currency symbol (${currency}) for all pricing.

${baseKnowledge}`;

    case 'sales_assistant':
      return `You are Chidi, the AI Sales Assistant at ${bk.businessName}.
Your duties:
1. Help prospective customers discover, compare, and choose suitable products from our catalog.
2. Recommend the best matching items based on the customer's stated needs and budget.
3. Answer questions about product benefits, quality, and usage.
4. CRITICAL MANDATE: Never invent products, discounts, or stock availability that do not exist in the Business Knowledge Base. If an item is out of stock or not listed, politely let the customer know and offer suitable alternatives from the catalog.
5. If the customer provides their name or contact details (phone, WhatsApp, or email) along with product interest, append this tag at the very end of your response to enable 1-click lead capture:
<<<LEAD_DETECTED>>>{"name": "...", "phone": "...", "interest": "..."}<<<END_LEAD_DETECTED>>>
6. Guide the customer toward making a purchase decision and encourage them to connect with our Order Manager when they are ready to order.

${baseKnowledge}`;

    case 'order_manager':
      return `You are Tunde, the AI Order Manager at ${bk.businessName}.
Your duties:
1. Help customers place and review orders smoothly and accurately.
2. Collect necessary order details step-by-step:
   - Customer Full Name
   - Phone Number
   - Delivery Address / City
   - Product(s) selected and desired quantity
3. Calculate accurate pricing and subtotals based on the official catalog prices (${currency}).
4. CRITICAL MANDATE: You must NEVER claim or promise that an order has already been placed or finalized unless the user confirms it.
5. When key details (Customer Name, Phone, Delivery Address, Item with Quantity) have been gathered, present a clear, itemized summary and invite the customer to confirm.
6. When the order details are ready for confirmation, append the following structured draft tag at the very end of your response so the system can render an instant "Approve & Place Order" button for the user:
<<<ORDER_DRAFT>>>{"customerName": "...", "customerPhone": "...", "deliveryAddress": "...", "items": [{"productName": "...", "quantity": 1, "unitPrice": 1000}], "deliveryFee": 2500, "totalAmount": 3500}<<<END_ORDER_DRAFT>>>
(Ensure the JSON inside the tags is valid and matches the collected details).

${baseKnowledge}`;

    case 'business_assistant':
      const statsOverview = contextData
        ? `
Current Business Snapshot:
- Total Customers: ${contextData.customersCount ?? 0}
- Active Leads: ${contextData.leadsCount ?? 0}
- Total Orders: ${contextData.ordersCount ?? 0}
- Pending Orders awaiting fulfillment: ${contextData.pendingOrdersCount ?? 0}
${
  contextData.recentOrders && contextData.recentOrders.length > 0
    ? `Recent Orders:\n` +
      contextData.recentOrders
        .slice(0, 5)
        .map((o) => `  * ${o.orderNumber} - ${o.customerName}: ${currency}${o.totalAmount.toLocaleString()} (${o.status})`)
        .join('\n')
    : ''
}`
        : 'Metrics context not supplied.';

      return `You are Kola, the Senior AI Business Operations Advisor at ${bk.businessName}.
Your duties:
1. Assist the business owner/entrepreneur in managing and scaling their business.
2. Summarize business performance, customer pipeline, and order operations based on current statistics.
3. Suggest practical, high-impact operational improvements, sales strategies, and stock management tips tailored for small businesses and Nigerian/African SME markets.
4. Help draft professional customer communication, promotional announcements, and operational checklists.
5. Provide data-backed insights with clear, bulleted, executive summaries.

${baseKnowledge}

${statsOverview}`;

    default:
      return `You are a helpful AI employee at ${bk.businessName}.\n${baseKnowledge}`;
  }
}

function generateSmartFallback(
  role: ChatRequestBody['employeeRole'],
  userMessage: string,
  bk: BusinessKnowledgePayload
): string {
  const currency = bk.currency || '₦';
  const query = userMessage.toLowerCase();

  if (role === 'customer_support') {
    if (query.includes('price') || query.includes('cost') || query.includes('how much')) {
      const matched = bk.products?.filter(p => query.includes(p.name.toLowerCase()) || query.includes(p.category?.toLowerCase() || ''));
      if (matched && matched.length > 0) {
        return `Here are the official prices from our catalog:\n${matched.map(p => `• **${p.name}**: ${currency}${p.price.toLocaleString()} (${p.inStock ? 'In Stock' : 'Currently Out of Stock'})`).join('\n')}\n\nAll prices are fixed. Would you like delivery information for your location or assistance with placing an order?`;
      }
      return `Our catalog features quality items ranging from ${currency}${bk.products?.[0]?.price?.toLocaleString() || 'reasonable rates'}. For example:\n${(bk.products || []).slice(0, 3).map(p => `• **${p.name}**: ${currency}${p.price.toLocaleString()}`).join('\n')}\n\nWhich specific item would you like to inquire about?`;
    }
    if (query.includes('deliver') || query.includes('shipping') || query.includes('dispatch') || query.includes('send to') || query.includes('abuja') || query.includes('lagos')) {
      return `Here is our delivery policy and logistics schedule:\n\n${bk.deliveryInfo || 'We offer prompt dispatch and delivery across major locations.'}\n\nPlease let me know your delivery address or state so we can provide exact timing!`;
    }
    if (query.includes('return') || query.includes('refund') || query.includes('exchange') || query.includes('damaged')) {
      return `Here is our store policy:\n\n${bk.policies || 'Items in original packaging can be returned within our warranty guidelines.'}\n\nIf you have an issue with an existing order, please provide your order number and our team will resolve it promptly!`;
    }
    if (query.includes('hour') || query.includes('open') || query.includes('time') || query.includes('close') || query.includes('sunday')) {
      return `Our operating hours are:\n• **Store Hours:** ${bk.businessHours || 'Monday to Saturday, 8:30 AM – 6:30 PM (WAT).'}\n• **Digital AI Staff:** Available 24/7 to record orders and assist customers!\n\nContact phone: ${bk.contactInfo?.phone || 'Not specified'}`;
    }
    if (query.includes('contact') || query.includes('phone') || query.includes('whatsapp') || query.includes('address') || query.includes('office')) {
      return `You can reach **${bk.businessName}** through:\n• **Phone:** ${bk.contactInfo?.phone || 'N/A'}\n• **WhatsApp:** ${bk.contactInfo?.whatsapp || 'N/A'}\n• **Email:** ${bk.contactInfo?.email || 'N/A'}\n• **Physical Address:** ${bk.contactInfo?.address || 'N/A'}`;
    }
    return `Hello! I am Amina from **${bk.businessName}** Customer Support.\n\nI can assist you with product details, pricing in ${currency}, delivery timelines, business hours, or our return policies.\n\n*(Note: Grounded in our live Business Knowledge Base).* How can I help you today?`;
  }

  if (role === 'sales_assistant') {
    const phoneMatch = userMessage.match(/(\+?234|0)[789][01]\d{8}/) || userMessage.match(/\b\d{10,11}\b/);
    if (phoneMatch) {
      const nameMatch = userMessage.match(/(?:my name is|i am|i'm|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      const name = nameMatch ? nameMatch[1] : 'Valued Customer';
      const phone = phoneMatch[0];
      const interestedProduct = (bk.products || []).find(p => query.includes(p.name.toLowerCase()))?.name || 'Catalog Products';
      return `Thank you so much, **${name}**! I have noted your contact number (${phone}) and your interest in **${interestedProduct}**.\n\nWould you like me to prepare an order draft for you with Tunde (our AI Order Manager), or would you prefer a team member to reach out on WhatsApp?\n\n<<<LEAD_DETECTED>>>{"name": "${name}", "phone": "${phone}", "interest": "${interestedProduct}"}<<<END_LEAD_DETECTED>>>`;
    }
    if (query.includes('recommend') || query.includes('best') || query.includes('suggest') || query.includes('glow') || query.includes('skin') || query.includes('buy')) {
      const availableProds = (bk.products || []).filter(p => p.inStock);
      return `I would be delighted to recommend our top picks from **${bk.businessName}**:\n\n${availableProds.map(p => `• **${p.name}** (${currency}${p.price.toLocaleString()}):\n  ${p.description}`).join('\n\n')}\n\nWhich of these matches your current goals? If you tell me your name and location, I can also check delivery availability!`;
    }
    return `Hello! I'm Chidi, your AI Sales Assistant at **${bk.businessName}**.\n\nWe have excellent items in stock right now. What are you looking to purchase today? Share your budget or preference, and I will recommend the best fit without guessing!`;
  }

  if (role === 'order_manager') {
    const matchedProduct = (bk.products || []).find(p => query.includes(p.name.toLowerCase()));
    const phoneMatch = userMessage.match(/(\+?234|0)[789][01]\d{8}/) || userMessage.match(/\b\d{10,11}\b/);
    const hasAddress = query.includes('lagos') || query.includes('abuja') || query.includes('lekki') || query.includes('ikeja') || query.includes('street') || query.includes('road') || query.includes('phase');

    if (matchedProduct || (hasAddress && phoneMatch)) {
      const selectedItem = matchedProduct || (bk.products && bk.products[0]) || { name: 'Standard Product', price: 10000 };
      const nameMatch = userMessage.match(/(?:for|name is|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      const custName = nameMatch ? nameMatch[1] : 'Customer';
      const custPhone = phoneMatch ? phoneMatch[0] : '+234 802 000 0000';
      const address = hasAddress ? userMessage : 'Customer specified address';
      const qty = 1;
      const delivery = 2500;
      const total = (selectedItem.price * qty) + delivery;

      return `I have gathered your order details:\n\n• **Customer Name:** ${custName}\n• **Contact Phone:** ${custPhone}\n• **Delivery Location:** ${address}\n• **Item:** 1x ${selectedItem.name} (${currency}${selectedItem.price.toLocaleString()})\n• **Delivery Fee:** ${currency}${delivery.toLocaleString()}\n• **Total Payable:** **${currency}${total.toLocaleString()}**\n\n*Important:* In line with our policy, this order has not yet been logged until you confirm it. Please review the draft below and tap **"Approve & Save Order"** to finalize!\n\n<<<ORDER_DRAFT>>>{"customerName": "${custName}", "customerPhone": "${custPhone}", "deliveryAddress": "${address}", "items": [{"productName": "${selectedItem.name}", "quantity": ${qty}, "unitPrice": ${selectedItem.price}}], "deliveryFee": ${delivery}, "totalAmount": ${total}}<<<END_ORDER_DRAFT>>>`;
    }

    return `Hello! I am Tunde, your AI Order Manager at **${bk.businessName}**.\n\nTo help you place an order, please provide:\n1. Your Full Name & Phone Number\n2. The product(s) and quantity you want\n3. Your delivery address (e.g. Lekki, Ikeja, Abuja)\n\nOnce received, I will calculate the subtotal and delivery fee, then generate an official order draft for your 1-click confirmation!`;
  }

  // business_assistant
  if (query.includes('summar') || query.includes('report') || query.includes('status') || query.includes('overview') || query.includes('pending')) {
    return `Here is your executive operations briefing for **${bk.businessName}**:\n\n📊 **Current Health Overview:**\n• **Active Catalog:** ${bk.products?.length || 0} Products (${bk.products?.filter(p => !p.inStock).length || 0} currently out of stock)\n• **Fulfillment Priority:** Dispatch pending orders within your stated window (${bk.businessHours || '8am - 6pm'})\n• **Revenue Opportunity:** Re-engage contacted leads who showed high intent for serums and sunscreens.\n\n💡 **Recommended Action Items Today:**\n1. Check logistics tracking for outgoing Lagos & Abuja parcels.\n2. Restock out-of-stock items to avoid lost sales.\n3. Send a follow-up WhatsApp check-in to your recent leads!`;
  }

  return `Hello! I am Kola, your AI Operations Advisor for **${bk.businessName}**.\n\nI can assist you with:\n• **Performance Briefings:** Summarize orders, pending deliveries, and lead conversion rates.\n• **Marketing Drafts:** Create promotional copy for WhatsApp, Instagram, or SMS.\n• **Operational Checklists:** Optimize your delivery processes and stock management.\n\nWhat would you like us to review today?`;
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  try {
    const { employeeRole, messages, businessKnowledge, contextData }: ChatRequestBody = req.body;

    if (!employeeRole || !messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Missing required parameters: employeeRole and messages.' });
      return;
    }

    const latestUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const systemInstruction = buildSystemInstruction(employeeRole, businessKnowledge, contextData);

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' },
          },
        });

        const validMessages = messages.filter((m) => m.content && m.content.trim().length > 0);
        const firstUserIdx = validMessages.findIndex((m) => m.role === 'user');
        const dialogMessages = firstUserIdx >= 0 ? validMessages.slice(firstUserIdx) : validMessages;

        const formattedContents = dialogMessages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents.length > 0 ? formattedContents : [{ role: 'user', parts: [{ text: latestUserMessage }] }],
          config: { systemInstruction },
        });

        const replyText = response.text || "I'm sorry, I could not generate a response at this moment.";
        res.status(200).json({
          reply: replyText,
          model: 'gemini-3.8-flash',
          source: 'gemini',
        });
        return;
      } catch (geminiError) {
        console.warn('Vercel Gemini API error, using smart fallback:', geminiError);
      }
    }

    // Fallback if no key or error
    const fallbackReply = generateSmartFallback(employeeRole, latestUserMessage, businessKnowledge);
    res.status(200).json({
      reply: fallbackReply,
      model: 'fallback-knowledge-engine',
      source: 'fallback',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
}
