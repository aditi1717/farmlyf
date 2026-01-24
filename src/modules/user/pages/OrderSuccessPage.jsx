
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';


const OrderSuccessPage = () => {
    const { orderId } = useParams();

    return (
        <div className="bg-[#fcfcfc] flex justify-center pt-4 pb-12 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-sm w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-center p-6"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                    <CheckCircle size={32} strokeWidth={3} />
                </div>

                <h1 className="text-xl font-black text-footerBg mb-2">Order Placed Successfully!</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Thank you for your purchase. Your order has been received and is being processed.
                </p>

                <div className="bg-gray-50 rounded-xl p-3 mb-6 border border-gray-100">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Order ID</p>
                    <p className="text-base font-mono font-bold text-primary tracking-wider">{orderId}</p>
                </div>

                <div className="space-y-3">
                    <Link
                        to={`/order/${orderId}`}
                        className="block w-full bg-footerBg text-white py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                        <Package size={16} />
                        View Order Details
                    </Link>

                    <Link
                        to="/"
                        className="block w-full bg-white text-footerBg border border-gray-200 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Home size={16} />
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccessPage;
