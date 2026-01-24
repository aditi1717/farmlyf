
import React from 'react';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const OrdersPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getOrders } = useShop();

    const orders = user ? getOrders(user.id) : [];

    if (orders.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <Package size={80} className="text-gray-200 mb-6" />
                <h2 className="text-2xl font-bold text-footerBg mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
                <Link to="/catalog" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfcfc] min-h-screen py-12">
            <div className="container mx-auto px-4 md:px-12">
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-black text-footerBg uppercase tracking-tight">My Orders</h1>
                </div>

                <div className="space-y-6 max-w-4xl mx-auto">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-footerBg text-lg">{order.id}</span>
                                        <span className="bg-blue-100 text-blue-700 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                        <Clock size={12} />
                                        {new Date(order.date).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Amount</p>
                                    <p className="text-xl font-black text-footerBg">₹{order.amount}</p>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        {order.items.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-footerBg line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <p className="text-xs text-gray-400 font-medium pl-1 text-left">+ {order.items.length - 3} more items...</p>
                                        )}
                                    </div>

                                    <div className="md:w-64 shrink-0 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Shipped To</p>
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin size={14} className="mt-0.5 shrink-0 text-primary" />
                                                <p className="line-clamp-3 leading-relaxed">
                                                    <span className="font-bold text-footerBg block mb-0.5">{order.shippingAddress.fullName}</span>
                                                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.pincode}
                                                </p>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/order/${order.id}`}
                                            className="w-full bg-white border border-footerBg text-footerBg py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-footerBg hover:text-white transition-all flex items-center justify-center gap-2 group"
                                        >
                                            View Details
                                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
