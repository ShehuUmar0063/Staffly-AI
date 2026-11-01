import { BusinessKnowledge, AIEmployeeRole } from '../types';

export function generateClientSmartFallback(
  role: AIEmployeeRole,
  userMessage: string,
  bk: BusinessKnowledge
): string {
  const currency = bk.currency || '₦';
  const query = userMessage.toLowerCase();

  if (role === 'customer_support') {
    if (query.includes('price') || query.includes('cost') || query.includes('how much')) {
      const matched = bk.products?.filter(
        (p) => query.includes(p.name.toLowerCase()) || query.includes(p.category?.toLowerCase() || '')
      );
      if (matched && matched.length > 0) {
        return `Here are the official prices from our catalog:\n${matched
          .map(
            (p) =>
              `• **${p.name}**: ${currency}${p.price.toLocaleString()} (${
                p.inStock ? 'In Stock' : 'Currently Out of Stock'
              })`
          )
          .join('\n')}\n\nAll prices are fixed. Would you like delivery information for your location or assistance with placing an order?`;
      }
      return `Our catalog features quality items ranging from ${currency}${
        bk.products?.[0]?.price?.toLocaleString() || 'reasonable rates'
      }. For example:\n${(bk.products || [])
        .slice(0, 3)
        .map((p) => `• **${p.name}**: ${currency}${p.price.toLocaleString()}`)
        .join('\n')}\n\nWhich specific item would you like to inquire about?`;
    }

    if (
      query.includes('deliver') ||
      query.includes('shipping') ||
      query.includes('dispatch') ||
      query.includes('send to') ||
      query.includes('abuja') ||
      query.includes('lagos')
    ) {
      return `Here is our delivery policy and logistics schedule:\n\n${
        bk.deliveryInfo || 'We offer prompt dispatch and delivery across major locations.'
      }\n\nPlease let me know your delivery address or state so we can provide exact timing!`;
    }

    if (
      query.includes('return') ||
      query.includes('refund') ||
      query.includes('exchange') ||
      query.includes('damaged')
    ) {
      return `Here is our store policy:\n\n${
        bk.policies || 'Items in original packaging can be returned within our warranty guidelines.'
      }\n\nIf you have an issue with an existing order, please provide your order number and our team will resolve it promptly!`;
    }

    if (
      query.includes('hour') ||
      query.includes('open') ||
      query.includes('time') ||
      query.includes('close') ||
      query.includes('sunday')
    ) {
      return `Our operating hours are:\n• **Store Hours:** ${
        bk.businessHours || 'Monday to Saturday, 8:30 AM – 6:30 PM (WAT).'
      }\n• **Digital AI Staff:** Available 24/7 to record orders and assist customers!\n\nContact phone: ${
        bk.contactInfo?.phone || 'Not specified'
      }`;
    }

    if (
      query.includes('contact') ||
      query.includes('phone') ||
      query.includes('whatsapp') ||
      query.includes('address') ||
      query.includes('office')
    ) {
      return `You can reach **${bk.businessName}** through:\n• **Phone:** ${
        bk.contactInfo?.phone || 'N/A'
      }\n• **WhatsApp:** ${bk.contactInfo?.whatsapp || 'N/A'}\n• **Email:** ${
        bk.contactInfo?.email || 'N/A'
      }\n• **Physical Address:** ${bk.contactInfo?.address || 'N/A'}`;
    }

    return `Hello! I am Amina from **${bk.businessName}** Customer Support.\n\nI can assist you with product details, pricing in ${currency}, delivery timelines, business hours, or our return policies.\n\n*(Note: Grounded in our live Business Knowledge Base).* How can I help you today?`;
  }

  if (role === 'sales_assistant') {
    const phoneMatch = userMessage.match(/(\+?234|0)[789][01]\d{8}/) || userMessage.match(/\b\d{10,11}\b/);
    if (phoneMatch) {
      const nameMatch = userMessage.match(/(?:my name is|i am|i'm|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      const name = nameMatch ? nameMatch[1] : 'Valued Customer';
      const phone = phoneMatch[0];
      const interestedProduct =
        (bk.products || []).find((p) => query.includes(p.name.toLowerCase()))?.name ||
        'Catalog Products';
      return `Thank you so much, **${name}**! I have noted your contact number (${phone}) and your interest in **${interestedProduct}**.\n\nWould you like me to prepare an order draft for you with Tunde (our AI Order Manager), or would you prefer a team member to reach out on WhatsApp?\n\n<<<LEAD_DETECTED>>>{"name": "${name}", "phone": "${phone}", "interest": "${interestedProduct}"}<<<END_LEAD_DETECTED>>>`;
    }

    if (
      query.includes('recommend') ||
      query.includes('best') ||
      query.includes('suggest') ||
      query.includes('glow') ||
      query.includes('skin') ||
      query.includes('buy')
    ) {
      const availableProds = (bk.products || []).filter((p) => p.inStock);
      return `I would be delighted to recommend our top picks from **${bk.businessName}**:\n\n${availableProds
        .map((p) => `• **${p.name}** (${currency}${p.price.toLocaleString()}):\n  ${p.description}`)
        .join('\n\n')}\n\nWhich of these matches your current goals? If you tell me your name and location, I can also check delivery availability!`;
    }

    return `Hello! I'm Chidi, your AI Sales Assistant at **${bk.businessName}**.\n\nWe have excellent items in stock right now. What are you looking to purchase today? Share your budget or preference, and I will recommend the best fit without guessing!`;
  }

  if (role === 'order_manager') {
    const matchedProduct = (bk.products || []).find((p) => query.includes(p.name.toLowerCase()));
    const phoneMatch = userMessage.match(/(\+?234|0)[789][01]\d{8}/) || userMessage.match(/\b\d{10,11}\b/);
    const hasAddress =
      query.includes('lagos') ||
      query.includes('abuja') ||
      query.includes('lekki') ||
      query.includes('ikeja') ||
      query.includes('street') ||
      query.includes('road') ||
      query.includes('phase');

    if (matchedProduct || (hasAddress && phoneMatch)) {
      const selectedItem =
        matchedProduct || (bk.products && bk.products[0]) || { name: 'Standard Product', price: 10000 };
      const nameMatch = userMessage.match(/(?:for|name is|i am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      const custName = nameMatch ? nameMatch[1] : 'Customer';
      const custPhone = phoneMatch ? phoneMatch[0] : '+234 802 000 0000';
      const address = hasAddress ? userMessage : 'Customer specified address';
      const qty = 1;
      const delivery = 2500;
      const total = selectedItem.price * qty + delivery;

      return `I have gathered your order details:\n\n• **Customer Name:** ${custName}\n• **Contact Phone:** ${custPhone}\n• **Delivery Location:** ${address}\n• **Item:** 1x ${
        selectedItem.name
      } (${currency}${selectedItem.price.toLocaleString()})\n• **Delivery Fee:** ${currency}${delivery.toLocaleString()}\n• **Total Payable:** **${currency}${total.toLocaleString()}**\n\n*Important:* In line with our policy, this order has not yet been logged until you confirm it. Please review the draft below and tap **"Approve & Save Order"** to finalize!\n\n<<<ORDER_DRAFT>>>{"customerName": "${custName}", "customerPhone": "${custPhone}", "deliveryAddress": "${address}", "items": [{"productName": "${
        selectedItem.name
      }", "quantity": ${qty}, "unitPrice": ${selectedItem.price}}], "deliveryFee": ${delivery}, "totalAmount": ${total}}<<<END_ORDER_DRAFT>>>`;
    }

    return `Hello! I am Tunde, your AI Order Manager at **${bk.businessName}**.\n\nTo help you place an order, please provide:\n1. Your Full Name & Phone Number\n2. The product(s) and quantity you want\n3. Your delivery address (e.g. Lekki, Ikeja, Abuja)\n\nOnce received, I will calculate the subtotal and delivery fee, then generate an official order draft for your 1-click confirmation!`;
  }

  // business_assistant
  if (
    query.includes('summar') ||
    query.includes('report') ||
    query.includes('status') ||
    query.includes('overview') ||
    query.includes('pending')
  ) {
    return `Here is your executive operations briefing for **${bk.businessName}**:\n\n📊 **Current Health Overview:**\n• **Active Catalog:** ${
      bk.products?.length || 0
    } Products (${bk.products?.filter((p) => !p.inStock).length || 0} currently out of stock)\n• **Fulfillment Priority:** Dispatch pending orders within your stated window (${
      bk.businessHours || '8am - 6pm'
    })\n• **Revenue Opportunity:** Re-engage contacted leads who showed high intent for serums and sunscreens.\n\n💡 **Recommended Action Items Today:**\n1. Check logistics tracking for outgoing Lagos & Abuja parcels.\n2. Restock out-of-stock items to avoid lost sales.\n3. Send a follow-up WhatsApp check-in to your recent leads!`;
  }

  if (
    query.includes('whatsapp') ||
    query.includes('promo') ||
    query.includes('broadcast') ||
    query.includes('message')
  ) {
    const featured = bk.products?.[0]?.name || 'our best sellers';
    return `Here is a high-converting WhatsApp Broadcast draft you can send to your customers today:\n\n---\n*✨ Special Update from ${bk.businessName}! ✨*\n\nHello gorgeous! 🌟\n\nHope your week is going smoothly. Due to popular demand, we have fresh batches of our **${featured}** in stock and ready for same-day dispatch!\n\n🚚 *Fast Delivery:* Lagos Island, Mainland & Nationwide.\n💬 *Order easily:* Reply to this message or visit our digital portal to secure yours before stock finishes!\n\nHave a glowing day! 💕\n---`;
  }

  return `Hello! I am Kola, your AI Operations Advisor for **${bk.businessName}**.\n\nI can assist you with:\n• **Performance Briefings:** Summarize orders, pending deliveries, and lead conversion rates.\n• **Marketing Drafts:** Create promotional copy for WhatsApp, Instagram, or SMS.\n• **Operational Checklists:** Optimize your delivery processes and stock management.\n\nWhat would you like us to review today?`;
}
