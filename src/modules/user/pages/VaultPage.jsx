
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useShop } from '../../../context/ShopContext';
import { useNavigate, Link } from 'react-router-dom';
import { Bookmark, ShoppingCart, Trash2, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { PACKS } from '../../../mockData/data';

const VaultPage = () => {
    const { user } = useAuth();
    const { saveForLater, moveToCartFromSaved, removeFromSaved, getPackById } = useShop();
    const navigate = useNavigate();

    const savedItems = user ? saveForLater(user.id) : [];

    const handleMoveToCart = (packId) => {
        moveToCartFromSaved(user.id, packId);
    };

    const handleRemove = (packId) => {
        removeFromSaved(user.id, packId);
    };

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <Bookmark size={64} className="text-gray-200 mb-4" />
                <h2 className="text-2xl font-bold text-footerBg mb-2">Your Vault is Locked</h2>
                <p className="text-gray-500 mb-6 text-center max-w-md">Login to see your saved treasures and curated collection.</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
                >
                    Login to Unlock
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 md:px-12">
            <div className="container mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-gray-50 text-footerBg rounded-full hover:bg-footerBg hover:text-white transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-black text-footerBg uppercase tracking-tight">Your Reserved Vault</h1>
                </div>

                {savedItems.length === 0 ? (
                    <div className="bg-gray-50 rounded-[40px] p-12 text-center border border-dashed border-gray-200">
                        <Bookmark size={48} className="text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-footerBg mb-2">Your Vault is Empty</h2>
                        <p className="text-gray-400 mb-8 max-w-sm mx-auto font-medium">Start saving your favorite picks here.</p>
                        <Link
                            to="/catalog"
                            className="inline-flex items-center gap-2 bg-footerBg text-white px-8 py-3 rounded-xl font-bold hover:bg-primary transition-all shadow-md"
                        >
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {savedItems.map((item) => {
                            const product = getPackById(item.packId);
                            if (!product) return null;
                            return (
                                <ProductCard key={product.id} product={product} />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VaultPage;
