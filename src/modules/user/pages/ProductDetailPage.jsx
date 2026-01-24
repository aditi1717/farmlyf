import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useShop } from '../../../context/ShopContext';
import { PACKS } from '../../../mockData/data';
import {
    Star,
    ArrowLeft,
    Minus,
    Plus,
    PlusCircle,
    Heart,
    Share2,
    Truck,
    RotateCcw,
    ChevronRight,
    ShoppingBag,
    CheckCircle2,
    Leaf,
    WheatOff,
    Activity,
    Award,
    Tag,
    Percent,
    Bookmark,
    Package,
    Gift
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        addToCart,
        toggleWishlist,
        isInWishlist,
        getProductById,
        getPackById,
        getActiveCoupons,
        addToRecentlyViewed,
        getRecentlyViewed,
        getRecommendations,
        addToSaved,
        products
    } = useShop();

    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState('');
    const [activeTab, setActiveTab] = useState('Description');
    const [copiedCouponId, setCopiedCouponId] = useState(null);

    useEffect(() => {
        // Try to find in group products first
        const foundProduct = getProductById(id);
        if (foundProduct) {
            setProduct(foundProduct);
            setSelectedVariant(foundProduct.variants[0]);

            // Track view
            if (user) {
                addToRecentlyViewed(user.id, foundProduct.id);
            }
        } else {
            // Fallback for legacy packs
            const foundPack = getPackById(id);
            if (foundPack) {
                setProduct(foundPack);
                if (user && foundPack.productId) {
                    addToRecentlyViewed(user.id, foundPack.productId);
                }
            }
        }
        window.scrollTo(0, 0);
    }, [id, user]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-300">Loading Product...</h2>
                </div>
            </div>
        );
    }

    const isGroupProduct = !!product.variants;
    const currentPrice = isGroupProduct ? selectedVariant.price : product.price;
    const currentMrp = isGroupProduct ? selectedVariant.mrp : product.mrp;
    const currentDiscount = isGroupProduct ? selectedVariant.discount : product.discount;
    const currentUnitPrice = isGroupProduct ? selectedVariant.unitPrice : product.unitPrice;

    const discountPercentage = Math.round(((currentMrp - currentPrice) / currentMrp) * 100);
    const saveAmount = currentMrp - currentPrice;

    const baseTabs = ['Description', 'Benefits', 'Specifications', 'Reviews', 'FAQ', 'Nutrition Info'];
    const tabs = product.contents ? ['Pack Includes', ...baseTabs] : baseTabs;

    const isCombo = product.category === 'combos-packs' || product.category === 'Combos';

    if (isCombo) {
        return (
            <div className="bg-white min-h-screen font-['Inter'] pb-12">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 md:px-12 py-4 flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-600 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center text-[12px] font-medium text-gray-500 gap-2">
                        <Link to="/" className="hover:text-primary">Home</Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-400">Combos</span>
                        <ChevronRight size={14} />
                        <span className="text-footerBg font-bold truncate max-w-[200px]">{product.name}</span>
                    </div>
                </div>

                <div className="container mx-auto px-4 md:px-12 space-y-8 mt-2">

                    {/* SECTION A & B: Header & Images */}
                    <div className="">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-[#2A2A2A]">
                            {/* Left: Images */}
                            <div className="lg:col-span-5 space-y-4">
                                <div className="bg-white rounded-2xl border border-gray-100 p-4 relative group overflow-hidden shadow-sm h-[400px] flex items-center justify-center">
                                    <motion.img
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {product.tag && (
                                        <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                                            {product.tag}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => toggleWishlist(user.id, product.id)}
                                        className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        <Heart size={20} fill={user && isInWishlist(user.id, product.id) ? "currentColor" : "none"} />
                                    </button>
                                </div>
                                {/* Thumbnails */}
                                {product.galleryImages && product.galleryImages.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                                        {[product.image, ...product.galleryImages].map((img, idx) => (
                                            <div key={idx} className="w-20 h-20 bg-white border border-gray-200 rounded-xl p-2 cursor-pointer hover:border-primary transition-all">
                                                <img src={img} alt="" className="w-full h-full object-contain" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: Info & Actions */}
                            <div className="lg:col-span-7 flex flex-col justify-center">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                                            {product.brand || 'FARMLYF COMBOS'}
                                        </span>
                                        <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                            <span>{product.rating || 4.8}</span>
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-gray-400 font-medium ml-1">(Verified)</span>
                                        </div>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-black text-footerBg mb-4 leading-tight">
                                        {product.name}
                                    </h1>
                                    <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-xl">
                                        {product.shortDescription || product.description?.substring(0, 150) + '...'}
                                    </p>
                                </div>

                                {/* Pricing Card */}
                                <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100 mb-8 max-w-lg">
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-4xl font-black text-footerBg">₹{product.price}</span>
                                        {product.individualTotal && (
                                            <span className="text-lg text-gray-400 line-through font-bold mb-1">₹{product.individualTotal}</span>
                                        )}
                                        {product.discountPercentage > 0 && (
                                            <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-1 rounded mb-2">
                                                {product.discountPercentage}% OFF
                                            </span>
                                        )}
                                    </div>
                                    {product.savings > 0 && (
                                        <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                                            <CheckCircle2 size={14} />
                                            You save ₹{product.savings} on this combo!
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                                    <button
                                        onClick={() => {
                                            if (!user) return navigate('/login');
                                            addToCart(user.id, product.id, 1);
                                            navigate('/cart');
                                        }}
                                        className="flex-1 bg-footerBg text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-footerBg/20 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={18} /> Add to Cart
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!user) return navigate('/login');
                                            addToCart(user.id, product.id, 1);
                                            navigate('/cart');
                                        }}
                                        className="flex-1 bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primaryDeep transition-all shadow-lg shadow-primary/20"
                                    >
                                        Buy Now
                                    </button>
                                </div>
                                <div className="mt-6 flex items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Truck size={14} /> Free Delivery</span>
                                    <span className="flex items-center gap-2"><RotateCcw size={14} /> Easy Returns</span>
                                    <span className="flex items-center gap-2"><CheckCircle2 size={14} /> 100% Authentic</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION C: What's Inside (Most Important) */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-footerBg uppercase tracking-tight flex items-center gap-3">
                            <Package className="text-primary" strokeWidth={2.5} />
                            What's Inside This Pack?
                        </h3>
                        <div className="space-y-3">
                            {product.contents?.map((item, idx) => {
                                const itemProduct = products.find(p => p.id === item.productId);
                                const itemImage = itemProduct?.image || product.image;

                                return (
                                    <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center p-1 shrink-0">
                                            <img src={itemImage} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-footerBg">{item.productName || item.name}</h4>
                                            <p className="text-[10px] text-gray-500 font-medium mt-0.5">Quantity: <span className="text-gray-800">{item.quantity}</span></p>
                                        </div>
                                        <div className="text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                                            {item.variant || 'Standard'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* SECTION D & E: Comparison & Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Price Transparency */}
                        <div className="md:col-span-7 bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-footerBg uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Activity size={18} className="text-gray-400" /> Price Transparency
                            </h3>
                            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium text-gray-500 pb-4 border-b border-gray-200">
                                    <span>Individual Items Total Cost</span>
                                    <span className="line-through">₹{product.individualTotal || (product.mrp || product.price * 1.2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-black text-footerBg">
                                    <span>Combo Deal Price</span>
                                    <span className="text-primary">₹{product.price}</span>
                                </div>
                                <div className="flex justify-between items-center bg-green-100 p-3 rounded-xl text-green-800 text-sm font-bold">
                                    <span>Your Total Savings</span>
                                    <span>₹{product.savings || (product.mrp - product.price)}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium mt-4 text-center">
                                * Buying this combo is {Math.round((product.savings / product.individualTotal) * 100)}% cheaper than buying items individually.
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="md:col-span-5 bg-footerBg text-white rounded-[32px] p-8 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-fullblur-3xl -mr-10 -mt-10"></div>
                            <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
                                <Gift size={18} className="text-primary" /> Why Choose This?
                            </h3>
                            <ul className="space-y-4 relative z-10">
                                {(product.benefits || ['Perfect for Gifting', 'Premium Quality', 'Value for Money']).map((benefit, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle2 size={12} className="text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-300">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* SECTION F: Description */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-footerBg uppercase tracking-widest mb-4">Description</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {product.description}
                        </p>
                    </div>

                    {/* SECTION H: Related Combos */}
                    <div className="pt-8">
                        <h3 className="text-xl font-black text-footerBg uppercase tracking-tight mb-6 flex items-center gap-2">
                            <Package size={20} className="text-primary" /> You Might Also Like
                        </h3>
                        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
                            {products
                                .filter(p => (p.category === 'combos-packs' || p.category === 'Combos') && p.id !== product.id)
                                .slice(0, 5)
                                .map(item => (
                                    <div key={item.id} className="min-w-[280px]">
                                        <ProductCard product={item} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-white min-h-screen font-['Inter'] pb-12">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 md:px-12 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center text-[12px] font-medium text-gray-400 gap-2">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <Link to="/catalog" className="hover:text-primary transition-colors">Shop</Link>
                    <ChevronRight size={14} />
                    <span className="text-footerBg font-semibold text-gray-600 truncate max-w-[300px]">{product.name}</span>
                </div>
            </div>

            <main className="container mx-auto px-4 md:px-12 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-[#2A2A2A]">

                    {/* LEFT COLUMN - IMAGE (5/12) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 relative overflow-hidden group shadow-sm">
                            <motion.img
                                key={isGroupProduct ? selectedVariant.id : product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                src={product.image}
                                alt={product.name}
                                className="w-full h-auto object-contain max-h-[380px] mx-auto mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                            />
                            {product.tag && (
                                <span className="absolute top-4 left-0 bg-[#A0522D] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-r w-fit shadow-md">
                                    {product.tag}
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    if (!user) return navigate('/login');
                                    toggleWishlist(user.id, product.id);
                                }}
                                className={`absolute top-3 right-3 p-2 bg-white rounded-full border shadow-sm transition-all z-20 ${user && isInWishlist(user.id, product.id)
                                    ? 'text-red-500 border-red-100 bg-red-50'
                                    : 'text-gray-400 border-gray-100 hover:text-red-500 hover:border-red-100 hover:bg-red-50'
                                    }`}
                            >
                                <Heart size={18} fill={user && isInWishlist(user.id, product.id) ? "currentColor" : "none"} />
                            </button>
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none justify-center">
                            {[product.image, product.image, product.image, product.image].map((img, idx) => (
                                <button key={idx} className={`shrink-0 w-16 h-16 bg-white border-2 ${idx === 0 ? 'border-primary' : 'border-gray-100'} rounded-lg p-1 hover:border-primary transition-all`}>
                                    <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - DETAILS (7/12) */}
                    <div className="lg:col-span-7 lg:pl-6">
                        <div className="mb-5 border-b border-gray-100 pb-5">
                            {/* Brand Name */}
                            <div className="mb-2">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                    {product.brand}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-[#222] leading-tight mb-2 font-['Poppins'] tracking-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-1.5 bg-primary text-white px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                                    <span>{product.rating}</span>
                                    <Star size={10} fill="currentColor" />
                                </div>
                                <span className="text-xs text-gray-500 font-medium hover:text-primary cursor-pointer border-b border-gray-300 hover:border-primary transition-colors">11 reviews / Write a review</span>
                                <button className="text-gray-400 hover:text-primary transition-colors">
                                    <Share2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-end gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-gray-400">MRP:</span>
                                    <span className="text-base text-gray-400 line-through">₹{currentMrp}</span>
                                    <span className="text-2xl font-bold text-primary">₹{currentPrice}</span>
                                    <span className="text-gray-500 text-xs font-medium">incl. of all taxes</span>
                                    <span className="bg-[#E63946] text-white text-[10px] font-bold px-2 py-0.5 rounded ml-2 shadow-sm animate-pulse">
                                        {currentDiscount || `${discountPercentage}% OFF`}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">({currentUnitPrice})</span>
                                </div>
                                <p className="text-xs font-medium text-primary">Save ₹{saveAmount}</p>
                            </div>
                        </div>

                        {/* Variant Selection - Flipkart/Nutraj Style */}
                        {isGroupProduct && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Select Variant</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <div
                                            key={variant.id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`border-2 rounded-lg px-4 py-2 cursor-pointer transition-all min-w-[100px] text-center relative shadow-sm hover:shadow-md ${selectedVariant.id === variant.id
                                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                : 'border-gray-200 bg-white hover:border-gray-300 opacity-80 hover:opacity-100'
                                                }`}
                                        >
                                            <div className={`text-sm font-bold ${selectedVariant.id === variant.id ? 'text-primary' : 'text-gray-600'}`}>
                                                {variant.weight}
                                            </div>
                                            <div className="text-[10px] text-gray-400 line-through">₹{variant.mrp}</div>
                                            <div className={`text-xs font-bold ${selectedVariant.id === variant.id ? 'text-footerBg' : 'text-gray-600'}`}>
                                                ₹{variant.price}
                                            </div>
                                            {selectedVariant.id === variant.id && (
                                                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5 shadow-sm">
                                                    <CheckCircle2 size={12} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!isGroupProduct && (
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Pack Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    <div className="border-2 border-primary bg-primary/5 rounded-lg px-3 py-1.5 cursor-pointer transition-all min-w-[90px] text-center relative shadow-sm">
                                        <div className="text-sm font-bold text-primary">Default</div>
                                        <div className="text-[10px] text-gray-400 line-through">₹{product.mrp}</div>
                                        <div className="text-xs font-bold text-[#222]">₹{product.price}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Available Offers - Industry Standard Discovery */}
                        <div className="mb-6 bg-[#FDFCF0] border border-[#F5E6A3] rounded-xl p-4">
                            <h3 className="text-xs font-black text-[#856404] mb-3 uppercase tracking-widest flex items-center gap-2">
                                <Tag size={14} />
                                Available Offers
                            </h3>
                            <div className="space-y-3">
                                {getActiveCoupons().slice(0, 3).map((coupon) => (
                                    <div key={coupon.id} className="flex items-start gap-3 border-b border-[#F5E6A3]/50 pb-3 last:border-0 last:pb-0">
                                        <div className="mt-1 bg-white p-1 rounded border border-[#F5E6A3]">
                                            <Percent size={12} className="text-primary" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-footerBg tracking-tight font-mono border-2 border-dashed border-primary/30 px-2 py-0.5 rounded bg-white">
                                                    {coupon.code}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(coupon.code);
                                                        setCopiedCouponId(coupon.id);
                                                        setTimeout(() => setCopiedCouponId(null), 2000);
                                                    }}
                                                    className="text-[10px] font-bold text-primary hover:underline transition-all"
                                                >
                                                    {copiedCouponId === coupon.id ? 'COPIED!' : 'COPY'}
                                                </button>
                                            </div>
                                            <p className="text-[11px] text-gray-600 font-medium mt-1">
                                                {coupon.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-stretch">
                            <div className="flex flex-col gap-1 w-full sm:w-auto">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Quantity</label>
                                <div className="flex items-center border border-gray-300 rounded-md w-fit h-[42px] shadow-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-300"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-10 text-center text-sm font-bold text-[#2A2A2A]">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-300"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 flex gap-3 mt-auto">
                                <button
                                    onClick={() => {
                                        if (!user) return navigate('/login');
                                        const skuId = isGroupProduct ? selectedVariant.id : product.id;
                                        addToCart(user.id, skuId, quantity);
                                        navigate('/cart');
                                    }}
                                    className="flex-1 bg-primary text-white h-[42px] rounded font-bold text-sm uppercase tracking-wider shadow-md hover:bg-primaryHover hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag size={16} />
                                    Add To Cart
                                </button>
                                <button
                                    onClick={() => {
                                        if (!user) return navigate('/login');
                                        const skuId = isGroupProduct ? selectedVariant.id : product.id;
                                        addToCart(user.id, skuId, quantity);
                                        navigate('/cart');
                                    }}
                                    className="flex-1 bg-white text-primary border border-primary h-[42px] rounded font-bold text-sm uppercase tracking-wider hover:bg-green-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    Buy It Now
                                </button>
                                <button
                                    onClick={() => {
                                        if (!user) return navigate('/login');
                                        const skuId = isGroupProduct ? selectedVariant.id : product.id;
                                        addToSaved(user.id, skuId, quantity);
                                    }}
                                    className="w-[42px] h-[42px] flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all active:scale-95"
                                    title="Add to Vault"
                                >
                                    <Bookmark size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Pincode Check */}
                        <div className="border border-gray-200 rounded-lg p-1 max-w-sm mb-6 flex shadow-sm">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                className="flex-1 px-3 text-sm outline-none bg-transparent placeholder-gray-400"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                            <button className="bg-[#222] text-white px-4 py-1.5 rounded text-xs font-bold uppercase hover:bg-black transition-colors">
                                Check
                            </button>
                        </div>

                        <div className="flex items-center gap-5 text-xs text-gray-600 font-medium mb-8">
                            <div className="flex items-center gap-1.5">
                                <Truck size={16} className="text-primary" />
                                <span>Estimate delivery time</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <RotateCcw size={14} className="text-primary" />
                                <span className="font-bold text-gray-700">COD AVAILABLE</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* BOTTOM SECTION - Tabs */}
                <div className="mt-10">
                    {/* Benefits Icons Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border-b border-gray-100 pb-6">
                        {(product.benefits || ['Heart-Healthy', 'Gluten Free', 'Powerful Nutrition', 'Cholesterol Free']).slice(0, 4).map((b, i) => {
                            const iconMap = {
                                'Heart': <Heart size={20} strokeWidth={2} />,
                                'Gluten': <WheatOff size={20} strokeWidth={2} />,
                                'Nutrition': <Award size={20} strokeWidth={2} />,
                                'Fat': <Activity size={20} strokeWidth={2} />,
                                'Cholesterol': <Activity size={20} strokeWidth={2} />
                            };
                            const icon = Object.keys(iconMap).find(key => b.includes(key)) ? iconMap[Object.keys(iconMap).find(key => b.includes(key))] : <Leaf size={20} />;

                            return (
                                <div key={i} className="text-center flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-green-50/50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                                        {icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">{b}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Tab Navigation */}
                    <div className="hidden md:flex items-center justify-center gap-0 border-b border-gray-200 mb-6">
                        {tabs.map((tab, index) => (
                            <React.Fragment key={tab}>
                                <button
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 text-xs font-semibold tracking-wider transition-all relative uppercase
                                        ${activeTab === tab
                                            ? 'text-primary border-b-2 border-primary bg-primary/5'
                                            : 'text-gray-500 hover:text-gray-800'
                                        }
                                    `}
                                >
                                    {tab}
                                </button>
                                {/* Vertical Divider */}
                                {index < tabs.length - 1 && (
                                    <span className="h-4 w-[1px] bg-gray-200"></span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-4xl mx-auto text-center"
                        >
                            {activeTab === 'Pack Includes' && product.contents && (
                                <div className="text-left max-w-2xl mx-auto bg-[#FDFCF0] p-8 rounded-2xl border border-[#F5E6A3]">
                                    <h3 className="text-lg font-bold text-footerBg mb-6 flex items-center gap-2">
                                        <Package size={20} className="text-primary" />
                                        What's Inside This Pack?
                                    </h3>
                                    <div className="space-y-4">
                                        {product.contents.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-primary font-black text-sm">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="font-bold text-gray-700">{item.name}</span>
                                                </div>
                                                <span className="text-xs font-black text-white bg-primary px-3 py-1 rounded-full uppercase tracking-wider">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-[#F5E6A3] text-center">
                                        <p className="text-xs font-bold text-[#856404] uppercase tracking-widest">
                                            Total Net Weight: {product.variants && product.variants[0] ? product.variants[0].weight : '1kg'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Description' && (
                                <div className="space-y-6">
                                    <p className="text-sm text-gray-600 leading-7 text-justify">
                                        {product.description || `Nutraj brings a premium assortment of walnut kernels to your plate in the form of ${product.name}. As the name says, these Anmol walnut kernels are nothing short of precious treats as they come from 1% of the Rarest Crop, grown worldwide. Since the crop is handpicked from the best, these walnut kernels are jumbo-sized, extra crunchier in taste, and contain exceptional nutritional value.`}
                                    </p>
                                    <img src={product.image} className="w-full max-h-[300px] object-cover rounded-xl mt-8 opacity-90" alt="" />
                                </div>
                            )}

                            {activeTab === 'Benefits' && (
                                <div className="text-left space-y-4">
                                    <h3 className="text-lg font-bold text-gray-800">Health Benefits</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 leading-relaxed">
                                        {(product.benefits || [
                                            'Rich in Antioxidants: Walnuts have higher antioxidant activity than any other common nut.',
                                            'Super Plant Source of Omega-3s: Significantly higher omega-3 fat content than any other nut.'
                                        ]).map((b, i) => (
                                            <li key={i}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activeTab === 'Specifications' && (
                                <div className="text-left border border-gray-200 rounded-lg overflow-hidden">
                                    {(product.specifications || [
                                        { label: 'Brand Name', value: product.brand },
                                        { label: 'Shelf Life', value: '6 Months' }
                                    ]).map((spec, idx) => (
                                        <div key={idx} className={`grid grid-cols-1 md:grid-cols-2 p-4 text-sm ${idx !== (product.specifications?.length - 1) ? 'border-b border-gray-200' : ''}`}>
                                            <div className="font-bold text-primary">{spec.label}</div>
                                            <div className="text-gray-600">{spec.value}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'Reviews' && (
                                <div className="text-left">
                                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex text-primary">
                                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                                                </div>
                                                <span className="text-lg font-bold text-gray-800">4.82 out of 5</span>
                                            </div>
                                            <p className="text-sm text-gray-500">Based on 11 reviews</p>
                                        </div>
                                        <button className="bg-primary text-white px-6 py-2 rounded font-bold text-sm hover:bg-primaryHover transition-colors">
                                            Write a review
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            { name: 'Vinod Kumar', date: '01/19/2024', rating: 5, title: 'Walnuts', text: 'Excellent product although a little expensive' },
                                            { name: 'chunduru nageswara r.', date: '09/08/2023', rating: 4, title: 'SMALL AND BIG PICES CAME', text: '' },
                                            { name: 'SAIRAM V.', date: '09/02/2023', rating: 5, title: 'Nice quality', text: '' }
                                        ].map((review, idx) => (
                                            <div key={idx} className="border-b border-gray-50 pb-6 last:border-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex text-primary">
                                                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-800 text-sm">{review.name}</span>
                                                        <span className="bg-[#333] text-white text-[10px] px-1 rounded flex items-center gap-1">Verified</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{review.date}</span>
                                                </div>
                                                {review.title && <h4 className="font-bold text-sm text-gray-700 mb-1">{review.title}</h4>}
                                                {review.text && <p className="text-sm text-gray-600">{review.text}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'FAQ' && (
                                <div className="text-left space-y-4">
                                    {(product.faqs || [
                                        { q: 'How to store?', a: 'Store in a cool, dry place away from sunlight.' }
                                    ]).map((item, idx) => (
                                        <div key={idx} className="pb-4 border-b border-gray-50 last:border-0">
                                            <h4 className="text-primary font-medium text-sm mb-2">{item.q}</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'Nutrition Info' && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left p-6 bg-gray-50 rounded-xl">
                                    {[
                                        { label: 'Energy', value: product.nutrition?.energy || 'N/A' },
                                        { label: 'Protein', value: product.nutrition?.protein || 'N/A' },
                                        { label: 'Total Fat', value: product.nutrition?.fat || 'N/A' },
                                        { label: 'Carbs', value: product.nutrition?.carbs || 'N/A' }
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 bg-white rounded-lg shadow-sm">
                                            <div className="text-xs text-gray-500 uppercase">{stat.label}</div>
                                            <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Recently Viewed Section */}
                {
                    user && getRecentlyViewed(user.id).length > 0 && (
                        <div className="mt-20 pt-16 bg-[#FDFCF6] -mx-4 md:-mx-12 px-4 md:px-12 pb-8 rounded-t-[48px] border-x border-t border-orange-100/30">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-footerBg font-['Poppins']">Recently Viewed</h3>
                            </div>
                            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-none">
                                {getRecentlyViewed(user.id).filter(p => p.id !== product.id).map((item) => (
                                    <div key={item.id} className="min-w-[260px] w-[260px]">
                                        <ProductCard product={item} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* Recommendations Section */}
                {
                    user && (
                        <div className="mt-0 pt-8 font-['Inter'] bg-[#F4F9F6] -mx-4 md:-mx-12 px-4 md:px-12 pb-20 rounded-b-[48px] border-x border-b border-green-100/30">
                            <div className="flex items-center justify-between mb-10">
                                <div className="space-y-1.5">
                                    <h3 className="text-2xl font-black text-footerBg uppercase tracking-tight">Personally Recommended</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                                        <span className="w-8 h-[1px] bg-slate-200"></span>
                                        Picked for your unique taste
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-none">
                                {getRecommendations(user.id, 10).map((item) => (
                                    <div key={item.id} className="min-w-[260px] w-[260px]">
                                        <ProductCard product={item} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </main >
        </div >
    );
};

export default ProductDetailPage;
