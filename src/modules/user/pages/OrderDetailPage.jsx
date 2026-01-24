
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import {
    ArrowLeft, Package, MapPin, Phone, CreditCard,
    Truck, CheckCircle, Clock, Archive, RefreshCw, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getOrderById, updateOrderStatus, getReturns } = useShop();
    const [order, setOrder] = useState(null);
    const [availableItemsCount, setAvailableItemsCount] = useState(0);

    // Initial load and auto-refresh for simulation
    useEffect(() => {
        if (user && orderId) {
            const fetchOrder = () => {
                const foundOrder = getOrderById(user.id, orderId);
                if (foundOrder) {
                    setOrder(foundOrder);

                    // Fetch returns to see what's already returned
                    const allReturns = getReturns(user.id);
                    const orderReturns = allReturns.filter(r => r.orderId === orderId && r.status !== 'Rejected');
                    const returnedPackIds = new Set();
                    orderReturns.forEach(ret => {
                        ret.items.forEach(item => returnedPackIds.add(item.packId));
                    });

                    const available = foundOrder.items.filter(item => !returnedPackIds.has(item.packId));
                    setAvailableItemsCount(available.length);
                }
            };

            fetchOrder();
            // Refresh every 5 seconds to catch simulation updates
            const interval = setInterval(fetchOrder, 5000);
            return () => clearInterval(interval);
        }
    }, [user, orderId, getOrderById, getReturns]);

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading order details...</p>
            </div>
        );
    }

    // Check if eligible for return (delivered and within 7 days)
    const isDelivered = order.deliveryStatus === 'Delivered';
    const isWithinReturnWindow = () => {
        if (!order.deliveredDate) return false;
        const deliveryDate = new Date(order.deliveredDate);
        const now = new Date();
        const diffDays = Math.ceil((now - deliveryDate) / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    };

    const canReturn = isDelivered && isWithinReturnWindow() && availableItemsCount > 0;

    // Timeline steps for UI
    const steps = [
        { status: 'Processing', label: 'Order Placed', icon: Archive },
        { status: 'Packed', label: 'Packed', icon: Package },
        { status: 'Shipped', label: 'Shipped', icon: Truck },
        { status: 'Out for Delivery', label: 'Out for Delivery', icon: MapPin },
        { status: 'Delivered', label: 'Delivered', icon: CheckCircle }
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.deliveryStatus);

    return (
        <div className="bg-[#fcfcfc] min-h-screen py-12">
            <div className="container mx-auto px-4 md:px-12 max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/orders')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-footerBg uppercase tracking-tight">Order Details</h1>
                            <p className="text-gray-500 text-sm font-mono mt-1">#{order.id}</p>
                        </div>
                    </div>
                    {/* For Demo: Button to fast-forward status */}
                    <button
                        onClick={() => {
                            const modes = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
                            const nextIndex = Math.min(currentStepIndex + 1, modes.length - 1);
                            updateOrderStatus(user.id, order.id, modes[nextIndex]);
                            // Force refresh
                            window.location.reload();
                        }}
                        className="hidden lg:block text-xs bg-gray-100 px-3 py-1 rounded border border-gray-200"
                    >
                        Demo: Advance Status
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Tracking & Items */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Tracking Timeline */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="font-bold text-footerBg flex items-center gap-2 text-lg">
                                        <Truck size={20} className="text-primary" />
                                        Delivery Status
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 font-mono">Tracking ID: {order.trackingId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Estimated Delivery</p>
                                    <p className="text-sm font-bold text-footerBg">
                                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Visual Timeline - Clean & Decent */}
                            <div className="relative mb-8 px-4 py-4">
                                {/* Lines Context: 5 items => centers at 10%, 30%, 50%, 70%, 90% */}
                                {/* Line starts at 10% and ends at 90% => Width 80% */}

                                {/* Background Line */}
                                <div className="absolute top-9 left-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0" style={{ left: '10%', width: '80%' }} />

                                {/* Progress Line */}
                                <div
                                    className="absolute top-9 left-0 h-1 bg-green-600 -translate-y-1/2 rounded-full transition-all duration-1000 ease-out z-0"
                                    style={{
                                        left: '10%',
                                        width: `${(currentStepIndex / (steps.length - 1)) * 80}%`
                                    }}
                                />

                                {/* Steps */}
                                <div className="relative z-10 flex w-full">
                                    {steps.map((step, index) => {
                                        const isActive = index <= currentStepIndex;
                                        // Fix: Treat as completed if it's a past step OR if it's the current step and the status is 'Delivered'
                                        const isCompleted = index < currentStepIndex || (index === currentStepIndex && order.deliveryStatus === 'Delivered');
                                        const isCurrent = index === currentStepIndex;
                                        const Icon = step.icon;

                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                {/* Icon Circle */}
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-3
                                                        ${isCompleted ? 'bg-green-600 border-green-600 text-white' : 'bg-white'}
                                                        ${isCurrent && !isCompleted ? 'border-green-600 text-green-600 shadow-md ring-4 ring-green-50' : ''}
                                                        ${!isActive ? 'border-gray-200 text-gray-300' : ''}
                                                    `}
                                                >
                                                    <Icon size={isCurrent ? 20 : 18} />
                                                </div>

                                                {/* Label */}
                                                <p className={`text-[10px] font-bold uppercase tracking-wider text-center transition-colors
                                                    ${isActive ? 'text-green-800' : 'text-gray-400'}
                                                `}>
                                                    {step.label}
                                                </p>

                                                {/* Date/Time (Optional visual placeholder for decent look) */}
                                                {isActive && (
                                                    <p className="text-[9px] text-gray-400 mt-0.5 font-medium">
                                                        {index === 0 ? new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) :
                                                            (index === steps.length - 1 && order.deliveredDate) ? new Date(order.deliveredDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Latest Update Text */}
                            <div className="bg-gray-50 p-4 rounded-xl flex gap-3 items-start border border-gray-100">
                                <Clock size={16} className="text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-footerBg mb-0.5">Latest Update</p>
                                    {order.statusHistory.length > 0 && (
                                        <p className="text-xs text-gray-500">
                                            <span className="font-semibold">{order.statusHistory[order.statusHistory.length - 1].status}:</span> {order.statusHistory[order.statusHistory.length - 1].info}
                                            <br />
                                            <span className="text-[10px] opacity-70">
                                                {new Date(order.statusHistory[order.statusHistory.length - 1].timestamp).toLocaleString()}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <h3 className="font-bold text-footerBg flex items-center gap-2">
                                    <Package size={18} className="text-primary" />
                                    Items Ordered
                                </h3>
                                <div className="bg-green-100 text-green-700 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wide">
                                    {order.status}
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-base font-bold text-footerBg line-clamp-2 pr-4">{item.name}</h4>
                                                <p className="font-bold text-footerBg whitespace-nowrap">₹{item.price * item.qty}</p>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                            <div className="mt-2 text-xs font-medium text-gray-400 bg-gray-100 w-fit px-2 py-1 rounded">
                                                Qty: {item.qty} × ₹{item.price}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Details */}
                    <div className="space-y-6">
                        {/* Return / Replace Action Card */}
                        {isDelivered && (
                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-6">
                                <h3 className="font-bold text-footerBg mb-4">Return / Replacement</h3>
                                {canReturn ? (
                                    <div className="space-y-3">
                                        <p className="text-xs text-gray-500 mb-2">
                                            Valid until {new Date(new Date(order.deliveredDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </p>
                                        <button
                                            onClick={() => navigate(`/request-return/${order.id}`)}
                                            className="w-full bg-white text-footerBg border border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all text-sm flex items-center justify-center gap-2"
                                        >
                                            <RefreshCw size={16} />
                                            Request Return / Replace
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                        <AlertCircle size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Return window closed on {new Date(new Date(order.deliveredDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-6">
                            <h3 className="font-bold text-footerBg mb-6">Order Info</h3>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Shipping Address</p>
                                        <p className="text-sm font-bold text-footerBg mb-1">{order.shippingAddress.fullName}</p>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                            {order.shippingAddress.pincode}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                                        <CreditCard size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Payment Method</p>
                                        <p className="text-sm font-bold text-footerBg capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <p className="font-black text-footerBg uppercase text-sm">Total Amount</p>
                                        <p className="text-xl font-black text-primary">₹{order.amount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
