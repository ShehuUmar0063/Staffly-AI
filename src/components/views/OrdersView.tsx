import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, OrderItem } from '../../types';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  XCircle,
  Edit2,
  Trash2,
  Eye,
  Phone,
  MapPin,
  Bot,
  Printer,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface OrdersViewProps {
  isCreateModalOpen?: boolean;
  setIsCreateModalOpen?: (open: boolean) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  isCreateModalOpen: externalModalOpen,
  setIsCreateModalOpen: setExternalModalOpen,
}) => {
  const {
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    businessKnowledge,
    customers,
    formatMoney,
    currency,
  } = useApp();

  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;
  const setIsModalOpen = setExternalModalOpen || setInternalModalOpen;

  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Order Details Modal / Invoice Viewer
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Create / Edit Order Form State
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(2500);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Pending');
  const [orderNotes, setOrderNotes] = useState('');
  const [lineItems, setLineItems] = useState<
    Array<{ productId?: string; productName: string; quantity: number; unitPrice: number }>
  >([
    {
      productId: businessKnowledge.products?.[0]?.id,
      productName: businessKnowledge.products?.[0]?.name || 'Product',
      quantity: 1,
      unitPrice: businessKnowledge.products?.[0]?.price || 5000,
    },
  ]);

  const openCreateModal = () => {
    setEditingOrderId(null);
    setCustomerName('');
    setCustomerPhone('');
    setDeliveryAddress('');
    setDeliveryFee(2500);
    setOrderStatus('Pending');
    setOrderNotes('');
    setLineItems([
      {
        productId: businessKnowledge.products?.[0]?.id,
        productName: businessKnowledge.products?.[0]?.name || 'Standard Item',
        quantity: 1,
        unitPrice: businessKnowledge.products?.[0]?.price || 5000,
      },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (order: Order) => {
    setEditingOrderId(order.id);
    setCustomerName(order.customerName);
    setCustomerPhone(order.customerPhone);
    setDeliveryAddress(order.deliveryAddress);
    setDeliveryFee(order.deliveryFee);
    setOrderStatus(order.status);
    setOrderNotes(order.notes || '');
    setLineItems(
      order.items.map((it) => ({
        productId: it.productId,
        productName: it.productName,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      }))
    );
    setIsModalOpen(true);
  };

  const handleAddLineItem = () => {
    const firstProduct = businessKnowledge.products?.[0];
    setLineItems([
      ...lineItems,
      {
        productId: firstProduct?.id,
        productName: firstProduct?.name || 'New Product',
        quantity: 1,
        unitPrice: firstProduct?.price || 5000,
      },
    ]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const prod = businessKnowledge.products?.find((p) => p.id === productId);
    if (prod) {
      const updated = [...lineItems];
      updated[index] = {
        productId: prod.id,
        productName: prod.name,
        quantity: updated[index].quantity,
        unitPrice: prod.price,
      };
      setLineItems(updated);
    }
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const updated = [...lineItems];
    updated[index].quantity = Math.max(1, qty);
    setLineItems(updated);
  };

  // Calculate live totals
  const subtotal = lineItems.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  const totalAmount = subtotal + Number(deliveryFee || 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || lineItems.length === 0) return;

    const formattedItems: OrderItem[] = lineItems.map((it, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      productId: it.productId,
      productName: it.productName,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      total: it.quantity * it.unitPrice,
    }));

    if (editingOrderId) {
      updateOrder(editingOrderId, {
        customerName,
        customerPhone,
        deliveryAddress,
        items: formattedItems,
        subtotal,
        deliveryFee: Number(deliveryFee),
        totalAmount,
        status: orderStatus,
        notes: orderNotes,
      });
    } else {
      addOrder({
        customerName,
        customerPhone,
        deliveryAddress,
        items: formattedItems,
        subtotal,
        deliveryFee: Number(deliveryFee),
        totalAmount,
        status: orderStatus,
        notes: orderNotes,
        source: 'Manual',
      });
    }

    setIsModalOpen(false);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrder(orderId, { status: newStatus });
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.items.some((i) => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            Confirmed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
            <Truck className="w-3 h-3 text-purple-600" />
            Processing
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            Cancelled
          </span>
        );
    }
  };

  const statuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
            <span>Order Fulfillment Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Orders Management
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Track customer orders, manage fulfillment stages, calculate delivery fees in {businessKnowledge.currency} {businessKnowledge.currencyCode}, and inspect orders drafted by AI Order Manager.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order #, customer, item..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Status Filter tabs */}
        <div className="flex items-center overflow-x-auto gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full md:w-auto no-scrollbar">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'All'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {statuses.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Grid / Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No orders match your filter</p>
            <p className="text-xs text-slate-400 mt-1">Create a new order or ask your AI Order Manager to generate one.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Order Summary */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-extrabold text-base text-slate-900 font-mono">
                      #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {order.source === 'AI Assistant' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                        <Bot className="w-3 h-3" />
                        AI Order
                      </span>
                    )}
                  </div>

                  {/* Customer Info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="font-bold text-slate-900">{order.customerName}</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {order.customerPhone}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 truncate max-w-xs">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="truncate max-w-md">
                          <strong className="text-slate-800">{it.quantity}x</strong> {it.productName}
                        </span>
                        <span className="font-medium text-slate-700 shrink-0 ml-2">
                          {formatMoney(it.total)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <p className="text-[11px] text-slate-400 italic">
                      Note: {order.notes}
                    </p>
                  )}
                </div>

                {/* Right: Pricing, Status Changer & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Total Amount
                    </span>
                    <span className="text-xl font-extrabold text-teal-700">
                      {formatMoney(order.totalAmount)}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Incl. {formatMoney(order.deliveryFee)} delivery
                    </span>
                  </div>

                  {/* Quick Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>
                          Status: {st}
                        </option>
                      ))}
                    </select>

                    {/* View Details */}
                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      title="View Invoice"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit Order */}
                    <button
                      onClick={() => openEditModal(order)}
                      title="Edit Order"
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Order */}
                    <button
                      onClick={() => deleteOrder(order.id)}
                      title="Delete Order"
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create or Edit Order */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingOrderId ? 'Edit Order Details' : 'Create New Customer Order'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Customer Information */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Customer Information
                </span>

                {/* Quick Autofill from existing customer */}
                {customers.length > 0 && !editingOrderId && (
                  <div>
                    <label className="text-[11px] text-slate-500 font-semibold mb-1 block">
                      Quick select registered customer:
                    </label>
                    <select
                      onChange={(e) => {
                        const selected = customers.find((c) => c.id === e.target.value);
                        if (selected) {
                          setCustomerName(selected.name);
                          setCustomerPhone(selected.phone);
                          setDeliveryAddress(selected.location);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700"
                    >
                      <option value="">-- Choose existing customer --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone || c.location})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g. Chioma Okonkwo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Customer Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="+234 802 334 1122"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Delivery Address & City *
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. 14 Admiralty Way, Lekki Phase 1, Lagos"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Order Items
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5"
                    >
                      {/* Product Selector */}
                      <div className="flex-1">
                        <select
                          value={item.productId || ''}
                          onChange={(e) => handleProductSelect(index, e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none"
                        >
                          {businessKnowledge.products?.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({formatMoney(p.price)})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="w-20">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs text-center font-bold text-slate-900 focus:outline-none"
                        />
                      </div>

                      {/* Line Total */}
                      <div className="w-24 text-right font-bold text-xs text-slate-900">
                        {formatMoney(item.quantity * item.unitPrice)}
                      </div>

                      {/* Delete item button */}
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(index)}
                          className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Fee & Status */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Delivery Fee ({currency})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Initial Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Order Notes
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, paid via transfer..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Order Total Preview */}
              <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 flex justify-between items-center text-sm font-bold text-teal-950">
                <span>Total Amount:</span>
                <span className="text-lg text-teal-800">{formatMoney(totalAmount)}</span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-2">
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
                  {editingOrderId ? 'Update Order' : 'Record Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Order Invoice */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Official Receipt</span>
                <h3 className="font-bold text-slate-900 text-lg">
                  Order #{selectedOrderDetails.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <span className="text-slate-500 font-medium">Status:</span>
                {getStatusBadge(selectedOrderDetails.status)}
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedOrderDetails.customerName}
                </span>
                <span className="text-slate-500 block">{selectedOrderDetails.customerPhone}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Address</span>
                <span className="text-slate-700">{selectedOrderDetails.deliveryAddress}</span>
              </div>

              {/* Line Items */}
              <div className="border-t border-slate-100 pt-2 space-y-1.5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Items Ordered</span>
                {selectedOrderDetails.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700">
                    <span>
                      {it.quantity}x {it.productName}
                    </span>
                    <span className="font-bold text-slate-900">{formatMoney(it.total)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-1 flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatMoney(selectedOrderDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Fee</span>
                  <span>{formatMoney(selectedOrderDetails.deliveryFee)}</span>
                </div>
                <div className="border-t border-slate-200 pt-1 flex justify-between font-extrabold text-slate-900 text-sm">
                  <span>Total</span>
                  <span className="text-teal-700">{formatMoney(selectedOrderDetails.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const cleanPhone = selectedOrderDetails.customerPhone.replace(/\D/g, '');
                    const itemsText = selectedOrderDetails.items.map(it => `• ${it.quantity}x ${it.productName} (${formatMoney(it.total)})`).join('\n');
                    const text = `Hello ${selectedOrderDetails.customerName}! 🌟\n\nThank you for choosing ${businessKnowledge.businessName}. Your order #${selectedOrderDetails.orderNumber} is confirmed!\n\n${itemsText}\n\nDelivery Fee: ${formatMoney(selectedOrderDetails.deliveryFee)}\nTotal Payable: *${formatMoney(selectedOrderDetails.totalAmount)}*\nDelivery Address: ${selectedOrderDetails.deliveryAddress}\nStatus: ${selectedOrderDetails.status}\n\nWe will update you as soon as your package is dispatched!`;
                    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
                    window.open(waUrl, '_blank');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Send on WhatsApp</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
