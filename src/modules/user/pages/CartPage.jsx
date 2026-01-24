import React from 'react';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Percent, Tag, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const DUMMY_PRODUCTS = [
    {
        id: 101,
        name: 'Premium Kashmiri Saffron',
        category: 'Spices',
        price: 599,
        mrp: 899,
        brand: 'FARMLYF Premium',
        image: 'https://images.unsplash.com/photo-1564417539002-3f1912a520cb?auto=format&fit=crop&q=80&w=400',
        rating: 4.9
    },
    {
        id: 102,
        name: 'Organic Chia Seeds',
        category: 'Seeds',
        price: 249,
        mrp: 349,
        brand: 'FARMLYF Organics',
        image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400',
        rating: 4.5
    },
    {
        id: 103,
        name: 'Cold Pressed Coconut Oil',
        category: 'Oils',
        price: 399,
        mrp: 599,
        brand: 'FARMLYF Oils',
        image: 'https://images.unsplash.com/photo-1585642652174-8b63e8a38a79?auto=format&fit=crop&q=80&w=400',
        rating: 4.7
    },
    {
        id: 104,
        name: 'Raw Forest Honey',
        category: 'Sweeteners',
        price: 450,
        mrp: 650,
        brand: 'FARMLYF Naturals',
        image: 'https://images.unsplash.com/photo-1587049352851-8d4e1613d285?auto=format&fit=crop&q=80&w=400',
        rating: 4.8
    }
];

const CartPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        getCart,
        removeFromCart,
        updateCartQty,
        packs,
        getVariantById,
        getPackById,
        getActiveCoupons,
        saveForLater,
        moveToSaveForLater,
        moveToCartFromSaved,
        removeFromSaved,
        getRecommendations,
        addToCart
    } = useShop();

    const handleAddToCart = (e, item) => {
        e.stopPropagation();
        e.preventDefault();
        addToCart(user?.id, item.id);
    };

    const handleBuyNow = (e, item) => {
        e.stopPropagation();
        e.preventDefault();
        addToCart(user?.id, item.id);
        navigate('/checkout');
    };

    const cartItems = user ? getCart(user.id) : [];

    // Enrich cart items with product details
    const enrichedCart = cartItems.map(item => {
        // Try to get variant first
        const variantData = getVariantById(item.packId);
        if (variantData) {
            return {
                ...item,
                id: variantData.id,
                name: variantData.product.name,
                weight: variantData.weight,
                price: variantData.price,
                mrp: variantData.mrp,
                image: variantData.product.image,
                category: variantData.product.category,
                productId: variantData.product.id
            };
        }

        // Fallback to legacy pack
        const pack = getPackById(item.packId);
        if (pack) {
            return { ...item, ...pack };
        }
        return null;
    }).filter(Boolean);

    const savedItems = user ? saveForLater(user.id) : [];
    const enrichedSaved = savedItems.map(item => {
        const variantData = getVariantById(item.packId);
        if (variantData) {
            return {
                ...item,
                id: variantData.id,
                name: variantData.product.name,
                weight: variantData.weight,
                price: variantData.price,
                mrp: variantData.mrp,
                image: variantData.product.image,
                category: variantData.product.category,
                productId: variantData.product.id
            };
        }
        const pack = getPackById(item.packId);
        if (pack) return { ...item, ...pack };
        return null;
    }).filter(Boolean);

    const subtotal = enrichedCart.reduce((acc, item) => acc + (item.price || 0) * item.qty, 0);
    const cartCategories = [...new Set(enrichedCart.map(item => item.category))];
    const availableCoupons = getActiveCoupons().filter(c => {
        // Simple filter for coupons that are theoretically applicable (min order value check)
        return subtotal >= c.minOrderValue;
    });

    if (enrichedCart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <ShoppingBag size={80} className="text-gray-200 mb-6" />
                <h2 className="text-2xl font-bold text-footerBg mb-2">Your Bag is Empty</h2>
                <p className="text-gray-500 mb-8">Add something to your bag and it will show up here.</p>
                <Link to="/catalog" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all">
                    Shop Now
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
                    <h1 className="text-3xl font-black text-footerBg uppercase tracking-tight">Shopping Bag</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {enrichedCart.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex gap-6 shadow-sm group">
                                <div
                                    onClick={() => navigate(`/product/${item.id}`)}
                                    className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0 cursor-pointer"
                                >
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div
                                            onClick={() => navigate(`/product/${item.productId || item.id}`)}
                                            className="cursor-pointer"
                                        >
                                            <h3 className="font-bold text-footerBg text-lg group-hover:text-primary transition-colors">{item.name}</h3>
                                            <div className="flex gap-4 items-center">
                                                <p className="text-gray-500 text-sm">{item.category}</p>
                                                {item.weight && (
                                                    <span className="text-primary font-bold text-xs bg-primary/5 px-2 py-0.5 rounded">
                                                        {item.weight}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => moveToSaveForLater(user.id, item.id)}
                                                className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline"
                                            >
                                                Save for later
                                            </button>
                                            <span className="text-gray-200">|</span>
                                            <button
                                                onClick={() => removeFromCart(user.id, item.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end mt-4">
                                        <div className="flex items-center border border-gray-100 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => updateCartQty(user.id, item.id, item.qty - 1)}
                                                className="p-2 hover:bg-gray-50 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center font-bold">{item.qty}</span>
                                            <button
                                                onClick={() => updateCartQty(user.id, item.id, item.qty + 1)}
                                                className="p-2 hover:bg-gray-50 transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gray-400 text-sm line-through">₹{929 * item.qty}</div>
                                            <div className="text-xl font-black text-footerBg">₹{item.price * item.qty}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-fit sticky top-28">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <h2 className="text-xl font-black text-footerBg uppercase tracking-tight">Order Summary</h2>
                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between text-xl font-black text-footerBg">
                                    <span>Total</span>
                                    <span>₹{subtotal}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-footerBg text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                            >
                                Checkout
                            </button>
                        </div>

                        {/* Available Coupons Discovery */}
                        {availableCoupons.length > 0 && (
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mt-6">
                                <h3 className="text-xs font-black text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                                    <Tag size={14} />
                                    Available Coupons
                                </h3>
                                <div className="space-y-3">
                                    {availableCoupons.slice(0, 2).map((coupon) => (
                                        <div key={coupon.id} className="p-3 rounded-2xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
                                            onClick={() => navigate('/checkout')}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-primary/20 shrink-0">
                                                    <Percent size={14} className="text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black text-footerBg mb-0.5">{coupon.code}</p>
                                                    <p className="text-[10px] text-gray-500 line-clamp-2">{coupon.description}</p>
                                                </div>
                                                <ChevronRight size={14} className="text-gray-300 group-hover:text-primary transition-colors mt-1" />
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="w-full py-2 text-[10px] font-bold text-primary uppercase tracking-wider hover:underline"
                                    >
                                        Apply at checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save for Later Section */}
                {enrichedSaved.length > 0 && (
                    <div className="mt-20 border-t border-gray-100 pt-16">
                        <div className="flex items-center gap-3 mb-8">
                            <h3 className="text-xl font-black text-footerBg uppercase tracking-tight">Your Reserved Vault</h3>
                            <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                {enrichedSaved.length} Items
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrichedSaved.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-3xl border border-gray-100 flex gap-4 shadow-sm hover:shadow-md transition-all">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-footerBg text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-[10px] text-gray-500 font-bold">{item.weight || 'Default Pack'}</p>
                                            <p className="text-primary font-black text-sm mt-1">₹{item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <button
                                                onClick={() => moveToCartFromSaved(user.id, item.id)}
                                                className="text-[10px] font-bold text-white bg-footerBg px-3 py-1.5 rounded-lg hover:bg-primary transition-all whitespace-nowrap"
                                            >
                                                Move to Cart
                                            </button>
                                            <button
                                                onClick={() => removeFromSaved(user.id, item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommended Section - "You might also like" */}
                {user && (
                    <div className="mt-20 border-t border-gray-100 pt-16">
                        <div className="space-y-1 mb-8 flex items-end justify-between">
                            <div>
                                <h3 className="text-xl font-black text-footerBg uppercase tracking-tight">You Might Also Like</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Based on your personality & cart</p>
                            </div>
                            <button className="text-xs font-bold text-primary hover:underline">View All</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(getRecommendations(user.id, 4).length > 0 ? getRecommendations(user.id, 4) : DUMMY_PRODUCTS).map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
