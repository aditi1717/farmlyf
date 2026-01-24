import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useShop } from '../../../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import logo from '../../../assets/logo.png';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart, toggleWishlist, isInWishlist } = useShop();

    // Handle products with variants (Flipkart style)
    const hasVariants = product.variants && product.variants.length > 0;
    const defaultVariant = hasVariants ? product.variants[0] : null;

    // Get lowest price for "From ₹X" look
    const displayPrice = hasVariants
        ? Math.min(...product.variants.map(v => v.price))
        : product.price;

    const displayMrp = hasVariants
        ? product.variants.find(v => v.price === displayPrice)?.mrp || product.variants[0].mrp
        : product.mrp;

    const displayDiscount = hasVariants
        ? product.variants.find(v => v.price === displayPrice)?.discount || product.variants[0].discount
        : product.discount;

    const displayUnitPrice = hasVariants
        ? product.variants.find(v => v.price === displayPrice)?.unitPrice || product.variants[0].unitPrice
        : product.unitPrice;

    return (
        <motion.div
            layout
            onClick={() => navigate(`/product/${product.id}`)}
            className="group relative bg-white border border-gray-100 rounded-[1rem] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer h-full"
        >
            {/* Image Header - Using Local Asset */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FDFDFD] p-4 text-center">
                {product.tag && (
                    <div className="absolute top-3 left-0 z-10">
                        <span className="bg-[#B07038] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-r-lg shadow-sm">
                            {product.tag}
                        </span>
                    </div>
                )}
                {displayDiscount && (
                    <div className="absolute top-3 right-3 z-10">
                        <span className="bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm">
                            {displayDiscount}
                        </span>
                    </div>
                )}

                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Divider Line */}
            <div className="px-4">
                <div className="h-[1px] bg-gray-100 w-full" />
            </div>

            {/* Content Section */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                            <img src={logo} alt="FarmLyf" className="h-3.5 w-auto object-contain" />
                            {product.brand && product.brand.replace(/FARMLYF/i, '').trim() && (
                                <span className="font-brand font-bold text-[11px] uppercase tracking-wide text-footerBg">
                                    {product.brand.replace(/FARMLYF/i, '').trim()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-footerBg text-white flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold">
                            <Star size={9} fill="currentColor" />
                            <span>{product.rating}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!user) return navigate('/login');
                                toggleWishlist(user.id, product.id);
                            }}
                            className="text-footerBg hover:text-red-500 transition-colors"
                        >
                            <Heart
                                size={18}
                                fill={user && isInWishlist(user.id, product.id) ? "currentColor" : "none"}
                                className={user && isInWishlist(user.id, product.id) ? "text-red-500" : ""}
                            />
                        </button>
                    </div>
                </div>

                <h3 className="text-[11px] font-bold text-[#4A4A4A] leading-tight mb-4 h-8 line-clamp-2">
                    {product.name}
                </h3>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">MRP:</span>
                        <span className="text-[10px] text-gray-300 line-through">₹{displayMrp}</span>
                        <span className="text-sm font-black text-footerBg tracking-tight">₹{displayPrice}</span>
                        {displayUnitPrice && (
                            <span className="text-[9px] text-gray-400 font-medium tracking-tighter">({displayUnitPrice})</span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!user) return navigate('/login');

                                const itemId = hasVariants
                                    ? product.variants[0].id
                                    : product.id;

                                addToCart(user.id, itemId);
                                navigate('/cart');
                            }}
                            className="flex-1 bg-white border border-footerBg text-footerBg hover:bg-footerBg hover:text-white py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center justify-center"
                        >
                            ADD TO CART
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!user) return navigate('/login');

                                const itemId = hasVariants
                                    ? product.variants[0].id
                                    : product.id;

                                navigate('/checkout', { state: { directBuyItem: { packId: itemId, qty: 1 } } });
                            }}
                            className="flex-1 bg-footerBg hover:bg-primary text-white py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center"
                        >
                            BUY NOW
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
