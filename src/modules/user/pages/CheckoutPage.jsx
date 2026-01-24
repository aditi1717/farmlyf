
import React, { useState, useEffect } from 'react';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, Banknote, Truck, Tag, X, Percent } from 'lucide-react';
import CouponsModal from '../components/CouponsModal';
import logo from '../../../assets/logo.png';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { getCart, placeOrder, packs, getVariantById, getPackById, validateCoupon, recordCouponUsage, getActiveCoupons } = useShop();

    const directBuyItem = location.state?.directBuyItem;
    const cartItems = directBuyItem
        ? [directBuyItem]
        : (user ? getCart(user.id) : []);
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

    const subtotal = enrichedCart.reduce((acc, item) => acc + (item.price || 0) * item.qty, 0);
    const cartCategories = [...new Set(enrichedCart.map(item => item.category))];

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);

    // Coupon management state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [showCouponsModal, setShowCouponsModal] = useState(false);

    useEffect(() => {
        if (user) {
            const storedUsers = JSON.parse(localStorage.getItem('farmlyf_users')) || [];
            const currentUser = storedUsers.find(u => u.id === user.id);
            if (currentUser) {
                // Pre-fill address from saved addresses
                if (currentUser.addresses && currentUser.addresses.length > 0) {
                    const defaultAddr = currentUser.addresses.find(a => a.isDefault) || currentUser.addresses[0];
                    setFormData({
                        fullName: defaultAddr.fullName || currentUser.name || '',
                        phone: defaultAddr.phone || currentUser.phone || '',
                        address: defaultAddr.address || '',
                        city: defaultAddr.city || '',
                        state: defaultAddr.state || '',
                        pincode: defaultAddr.pincode || '',
                    });
                } else {
                    // Fallback to basic user info
                    setFormData(prev => ({
                        ...prev,
                        fullName: currentUser.name || '',
                        phone: currentUser.phone || '',
                    }));
                }
            }
        }
    }, [user]);

    const total = subtotal - couponDiscount;
    const availableCoupons = getActiveCoupons();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        const result = validateCoupon(user.id, couponCode, subtotal, enrichedCart);

        if (result.valid) {
            setAppliedCoupon(result.coupon);
            setCouponDiscount(result.discount);
            setCouponError('');
        } else {
            setCouponError(result.error);
            setAppliedCoupon(null);
            setCouponDiscount(0);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode('');
        setCouponError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const orderData = {
                items: enrichedCart,
                shippingAddress: formData,
                paymentMethod: paymentMethod,
                amount: total,
                currency: 'INR',
                appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
                discount: couponDiscount
            };

            // Record coupon usage
            if (appliedCoupon) {
                recordCouponUsage(user.id, appliedCoupon.id);
            }

            const orderId = placeOrder(user.id, orderData, !directBuyItem);
            setLoading(false);
            navigate(`/order-success/${orderId}`);
        }, 1500);
    };

    if (enrichedCart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">No items to checkout</h2>
                    <button onClick={() => navigate('/catalog')} className="text-primary font-bold hover:underline">Return to Shop</button>
                </div>
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
                    <h1 className="text-3xl font-black text-footerBg uppercase tracking-tight">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left Column: Forms */}
                    <div className="space-y-8">
                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-footerBg mb-6 flex items-center gap-2">
                                <Truck size={20} className="text-primary" />
                                Shipping Address
                            </h3>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                        <input
                                            required
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                                        <input
                                            required
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                                    <textarea
                                        required
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Flat No, Building, Street"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                                        <input
                                            required
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                                        <input
                                            required
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                                        <input
                                            required
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-footerBg mb-6 flex items-center gap-2">
                                <CreditCard size={20} className="text-primary" />
                                Payment Method
                            </h3>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                        className="w-5 h-5 text-primary focus:ring-primary"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-footerBg flex items-center gap-2">
                                            <Banknote size={16} /> Cash on Delivery
                                        </div>
                                        <div className="text-sm text-gray-500">Pay when you receive the order</div>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={() => setPaymentMethod('online')}
                                        className="w-5 h-5 text-primary focus:ring-primary"
                                    />
                                    <div className="flex-1">
                                        <div className="font-bold text-footerBg flex items-center gap-2">
                                            <CreditCard size={16} /> Online Payment (UPI / Card)
                                        </div>
                                        <div className="text-sm text-gray-500">Secure payment gateway</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Apply Coupon */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-xl font-bold text-footerBg mb-6 flex items-center gap-2">
                                <Tag size={20} className="text-primary" />
                                Apply Coupon
                            </h3>

                            {!appliedCoupon ? (
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => {
                                                setCouponCode(e.target.value.toUpperCase());
                                                setCouponError('');
                                            }}
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all uppercase font-bold text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-sm whitespace-nowrap"
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    {couponError && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                            <X size={16} />
                                            {couponError}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => setShowCouponsModal(true)}
                                        className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
                                    >
                                        <Tag size={14} />
                                        View Available Coupons ({availableCoupons.length})
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <Percent size={18} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-black text-emerald-700 text-sm uppercase tracking-wider">{appliedCoupon.code}</p>
                                            <p className="text-xs text-emerald-600 font-medium">You saved ₹{couponDiscount}!</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}
                        </div>


                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="h-fit sticky top-28">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-footerBg" />

                            <h2 className="text-xl font-black text-footerBg uppercase tracking-tight mb-6">Order Summary</h2>

                            <div className="max-h-60 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                                {enrichedCart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-footerBg line-clamp-1">{item.name}</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500">Qty: {item.qty}</span>
                                                    {item.weight && <span className="text-[10px] text-primary font-bold">{item.weight}</span>}
                                                </div>
                                                <span className="text-sm font-bold">₹{item.price * item.qty}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 font-bold">FREE</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-emerald-600 text-sm font-bold">
                                        <span>Coupon Discount ({appliedCoupon.code})</span>
                                        <span>-₹{couponDiscount}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-xl font-black text-footerBg pt-2">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={loading}
                                className="w-full bg-footerBg text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg mt-8 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Processing...' : `Place Order • ₹${total}`}
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                By placing an order, you agree to our Terms and Conditions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupons Modal */}
            <CouponsModal
                isOpen={showCouponsModal}
                onClose={() => setShowCouponsModal(false)}
                coupons={availableCoupons}
                onApply={(code) => {
                    setCouponCode(code);
                    setTimeout(() => handleApplyCoupon(), 100);
                }}
            />
        </div>
    );
};

export default CheckoutPage;
