
import React from 'react';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ReturnsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getReturns } = useShop();

    const returns = user ? getReturns(user.id) : [];

    if (returns.length === 0) {
        return (
            <div className="bg-[#fcfcfc] min-h-screen py-12 flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <RefreshCw size={32} />
                </div>
                <h2 className="text-2xl font-black text-footerBg mb-2">No Returns Yet</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    You haven't placed any return or replacement requests yet.
                </p>
                <Link to="/orders" className="bg-footerBg text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg">
                    Go to My Orders
                </Link>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Approved': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Picked Up': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Quality Check': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
            case 'Dispatched': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Refunded': return 'bg-green-100 text-green-700 border-green-200';
            case 'Delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="bg-[#fcfcfc] min-h-screen py-12">
            <div className="px-4 md:px-12 w-full">
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => navigate('/orders')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-footerBg uppercase tracking-tight">Returns & Refunds</h1>
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">Manage Your Requests</p>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto space-y-6">
                    {returns.map((request, index) => (
                        <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-bold text-footerBg text-lg tracking-tighter">{request.id}</span>
                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border transition-all ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={10} />
                                        {new Date(request.requestDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${request.type === 'replace' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                        {request.type === 'replace' ? 'Exchange' : 'Refund'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex-1 w-full space-y-4">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Items</p>
                                        <div className="flex gap-3 overflow-x-auto pb-2 pt-2">
                                            {request.items.map((item, i) => (
                                                <div key={i} className="relative group shrink-0">
                                                    <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-footerBg text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm leading-none">
                                                        {item.qty}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto flex md:flex-col gap-3">
                                        <button
                                            onClick={() => navigate(`/${request.type === 'replace' ? 'replacement' : 'return'}/${request.id}`)}
                                            className="flex-1 md:flex-none w-full bg-white border border-footerBg text-footerBg px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-footerBg hover:text-white transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
                                        >
                                            View Status
                                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                {request.status === 'Pending' && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 items-center text-xs text-gray-500">
                                        <AlertCircle size={14} className="text-blue-500" />
                                        Your request is under review. We will update you shortly.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReturnsPage;
