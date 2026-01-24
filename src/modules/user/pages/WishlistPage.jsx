
import React from 'react';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getWishlist, packs, products } = useShop();

    const wishlistIds = user ? getWishlist(user.id) : [];
    const wishlistItems = wishlistIds.map(id =>
        products.find(p => p.id === id) || packs.find(p => p.id === id)
    ).filter(Boolean);

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <Heart size={80} className="text-gray-200 mb-6" />
                <h2 className="text-2xl font-bold text-footerBg mb-2">Your Wishlist is Empty</h2>
                <p className="text-gray-500 mb-8">Save items you love here for later.</p>
                <Link to="/catalog" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfcfc] min-h-screen py-12">
            <div className="container mx-auto px-4 md:px-12">
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-black text-footerBg uppercase tracking-tight">My Wishlist</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlistItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};


export default WishlistPage;
