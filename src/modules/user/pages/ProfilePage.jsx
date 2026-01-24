import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useShop } from '../../../context/ShopContext';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    User,
    Mail,
    Copy,
    Check,
    Settings,
    LogOut,
    Package,
    Heart,
    Shield,
    ChevronRight,
    Tag,
    Home,
    MapPin,
    CreditCard,
    Bell,
    Edit3,
    ChevronDown,
    Calendar,
    Ticket,
    Headphones,
    ShieldCheck,
    Plus,
    Trash2,
    Lock,
    RefreshCw,
    AlertCircle,
    Clock,
    Bookmark,
    Share2,
    Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../../assets/logo.png';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const {
        getOrders,
        getActiveCoupons,
        getReturns,
        getRecentlyViewed,
        getRecommendations,
        getPackById
    } = useShop();
    const navigate = useNavigate();
    const { tab } = useParams();
    const activeTab = tab ? tab.charAt(0).toUpperCase() + tab.slice(1) : 'Overview';
    const [copied, setCopied] = useState(false);
    const [copiedCode, setCopiedCode] = useState('');
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        gender: 'Male',
        birthDate: ''
    });
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState(null);
    const [addressForm, setAddressForm] = useState({
        type: 'Home',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Load fresh user data from localStorage to get latest credits
        const storedUsers = JSON.parse(localStorage.getItem('farmlyf_users')) || [];
        const freshUser = storedUsers.find(u => u.id === user.id);
        if (freshUser) {
            setUserData(freshUser);
        } else {
            setUserData(user);
        }
    }, [user, navigate]);

    useEffect(() => {
        if (userData) {
            setEditForm({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                gender: userData.gender || 'Male',
                birthDate: userData.birthDate || ''
            });
        }
    }, [userData]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        const storedUsers = JSON.parse(localStorage.getItem('farmlyf_users')) || [];
        const updatedUsers = storedUsers.map(u =>
            u.id === user.id ? {
                ...u,
                name: editForm.name,
                email: editForm.email,
                phone: editForm.phone,
                gender: editForm.gender,
                birthDate: editForm.birthDate
            } : u
        );
        localStorage.setItem('farmlyf_users', JSON.stringify(updatedUsers));
        setUserData({
            ...userData,
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            gender: editForm.gender,
            birthDate: editForm.birthDate
        });
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
    };

    const handleAddAddress = () => {
        setAddressToEdit(null);
        setAddressForm({
            type: 'Home',
            fullName: userData?.name || '',
            phone: userData?.phone || '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            isDefault: (userData?.addresses || []).length === 0
        });
        setShowAddressForm(true);
    };

    const handleEditAddress = (addr) => {
        setAddressToEdit(addr);
        setAddressForm(addr);
        setShowAddressForm(true);
    };

    const handleSaveAddress = (e) => {
        e.preventDefault();
        const storedUsers = JSON.parse(localStorage.getItem('farmlyf_users')) || [];
        const currentUser = storedUsers.find(u => u.id === user.id);

        let updatedAddresses = [...(currentUser.addresses || [])];

        if (addressForm.isDefault) {
            updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
        }

        if (addressToEdit) {
            updatedAddresses = updatedAddresses.map(a => a.id === addressToEdit.id ? { ...addressForm } : a);
        } else {
            const newAddress = { ...addressForm, id: Date.now() };
            updatedAddresses.push(newAddress);
        }

        const updatedUsers = storedUsers.map(u =>
            u.id === user.id ? { ...u, addresses: updatedAddresses } : u
        );

        localStorage.setItem('farmlyf_users', JSON.stringify(updatedUsers));
        setUserData({ ...userData, addresses: updatedAddresses });
        setShowAddressForm(false);
    };

    const handleDeleteAddress = (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        const storedUsers = JSON.parse(localStorage.getItem('farmlyf_users')) || [];
        const currentUser = storedUsers.find(u => u.id === user.id);
        const updatedAddresses = (currentUser.addresses || []).filter(a => a.id !== id);

        if (updatedAddresses.length > 0 && !updatedAddresses.find(a => a.isDefault)) {
            updatedAddresses[0].isDefault = true;
        }

        const updatedUsers = storedUsers.map(u =>
            u.id === user.id ? { ...u, addresses: updatedAddresses } : u
        );

        localStorage.setItem('farmlyf_users', JSON.stringify(updatedUsers));
        setUserData({ ...userData, addresses: updatedAddresses });
    };

    const renderDashboard = () => (
        <div className="max-w-4xl p-10">
            <div className="mb-10 flex items-center gap-5">
                <button
                    onClick={() => navigate('/')}
                    className="p-2.5 bg-slate-50 text-footerBg rounded-xl hover:bg-footerBg hover:text-white transition-all group"
                >
                    <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-footerBg tracking-tight uppercase">Product Dashboard</h1>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manage your profile, orders, and rewards</p>
                </div>
            </div>

            {/* Theme-Aligned Stats Summary */}
            <div className="bg-white rounded-3xl p-6 mb-8 border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Orders</p>
                        <p className="text-xl font-bold text-footerBg">{getOrders(userData?.id).length}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Active Coupons</p>
                        <p className="text-2xl font-bold text-footerBg">{getActiveCoupons().length}</p>
                    </div>
                </div>
            </div>

            {/* Dashboard Sections */}
            <div className="space-y-10">
                {/* Group 1: Shopping & Rewards */}
                <div>
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.25em] mb-6 px-2 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-primary"></span>
                        Shopping & Rewards
                    </h4>
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        {[
                            { id: 'orders', label: 'Order History', icon: Package, desc: 'View status, track shipments, and reorder', action: () => navigate('/orders') },
                            { id: 'Returns', label: 'Returns & Replacement', icon: RefreshCw, desc: 'Track your returns, refunds and exchanges', action: () => navigate('/returns') },
                            { id: 'Wishlist', label: 'Your Wishlist', icon: Heart, desc: 'Manage your saved and favorite items', action: () => navigate('/wishlist') },
                            { id: 'Coupons', label: 'Available Coupons', icon: Ticket, desc: 'Discover extra discounts and festive offers', action: () => navigate('/profile/coupons') },
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                onClick={item.action}
                                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all border-b last:border-0 border-gray-50 group text-left"
                            >
                                <div className="flex items-center gap-5">
                                    <item.icon size={20} className="text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                    <div>
                                        <h5 className="font-semibold text-footerBg group-hover:text-primary transition-colors">{item.label}</h5>
                                        <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Group 2: Account & Support */}
                <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-6 px-2 flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-slate-200"></span>
                        Account & Support
                    </h4>
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        {[
                            { id: 'Settings', label: 'Account Settings', icon: User, desc: 'Update profile and security details', action: () => { setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
                            { id: 'Addresses', label: 'Saved Addresses', icon: MapPin, desc: 'Add, edit, or delete shipping locations', action: () => navigate('/profile/addresses') },
                            { id: 'Vault', label: 'My Farm Vault', icon: Bookmark, desc: 'View your reserved and saved dry fruit treasures', action: () => navigate('/vault') },
                            { id: 'Payment', label: 'Payment Methods', icon: CreditCard, desc: 'Manage saved UPI IDs and card details', action: () => navigate('/profile/payment') },
                            { id: 'Support', label: 'Help & Support', icon: Headphones, desc: 'Contact us for any order related queries', action: () => navigate('/profile/support') },
                        ].map((item, idx) => (
                            <button
                                key={idx}
                                onClick={item.action}
                                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-all border-b last:border-0 border-gray-50 group text-left"
                            >
                                <div className="flex items-center gap-5">
                                    <item.icon size={20} className="text-primary group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                    <div>
                                        <h5 className="font-semibold text-footerBg group-hover:text-primary transition-colors">{item.label}</h5>
                                        <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Personalized Recommendations Section */}


            {/* Recently Viewed Section */}

        </div>
    );







    const renderCoupons = () => {
        const coupons = getActiveCoupons();
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 md:p-10 min-h-[600px]"
            >
                <div className="mb-10 flex items-center gap-5">
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-2.5 bg-slate-50 text-footerBg rounded-xl hover:bg-footerBg hover:text-white transition-all group"
                    >
                        <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-footerBg tracking-tight uppercase">Available Coupons</h2>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Discover extra discounts and festive offers</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div />
                    <div className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Available Offers
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.length > 0 ? coupons.map(coupon => (
                        <div key={coupon.id} className="relative group bg-primary/[0.03] border border-primary/20 rounded-[24px] p-4 hover:border-primary hover:bg-primary/[0.06] transition-all shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                    <Percent size={14} />
                                </div>
                                <span className="text-[8px] font-bold text-primary uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-primary/10 shadow-sm">
                                    {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                </span>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-bold text-footerBg mb-0.5 tracking-tight uppercase">{coupon.code}</h4>
                                <p className="text-[9px] text-slate-500 font-medium leading-tight line-clamp-2">
                                    {coupon.description || `Valid on orders above ₹${coupon.minOrderValue}`}
                                </p>
                            </div>

                            <button
                                onClick={() => handleCopyCode(coupon.code)}
                                className="w-full bg-footerBg border-0 py-2 rounded-xl font-bold text-[9px] text-white hover:bg-primary transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                            >
                                <Copy size={12} />
                                {copiedCode === coupon.code ? 'COPIED!' : 'Copy Code'}
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-full py-16 text-center bg-gray-50/50 rounded-none border border-dashed border-gray-200">
                            <Ticket size={32} className="mx-auto text-gray-200 mb-3" />
                            <h3 className="text-base font-bold text-gray-300">No active coupons right now</h3>
                            <p className="text-[10px] text-gray-400">Keep checking for festive offers and deals!</p>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    const renderSupport = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 md:p-10 min-h-[600px]"
        >
            <div className="mb-10 flex items-center gap-5">
                <button
                    onClick={() => navigate('/profile')}
                    className="p-2.5 bg-slate-50 text-footerBg rounded-xl hover:bg-footerBg hover:text-white transition-all group"
                >
                    <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-footerBg tracking-tight uppercase">Help & Support</h2>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Contact us for any order related queries</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div />
                <div className="px-6 py-2 bg-purple-50 text-purple-600 rounded-full text-xs font-black uppercase tracking-widest">
                    Help Center
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-2xl font-bold text-footerBg mb-2">We're here to help!</h2>
                    <p className="text-xs text-slate-400 font-medium mb-8">Our team is available from 10am to 7pm (Mon-Sat) to assist you with any queries.</p>

                    <div className="space-y-3">
                        <div className="p-5 rounded-2xl bg-footerBg/[0.03] border border-footerBg/5 flex items-center gap-5 group hover:bg-footerBg/[0.06] transition-all">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-footerBg/5">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email us at</p>
                                <div className="flex items-center gap-0.5 font-brand">
                                    <span className="text-sm font-bold text-footerBg">support@</span>
                                    <img src={logo} alt="FarmLyf" className="h-4 w-auto object-contain mx-0.5" />
                                    <span className="font-bold text-sm text-footerBg">.com</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-primary/[0.03] border border-primary/5 flex items-center gap-5 group hover:bg-primary/[0.06] transition-all">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-primary/5">
                                <Share2 size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-primary/60 uppercase tracking-widest mb-0.5">WhatsApp Support</p>
                                <p className="text-sm font-bold text-footerBg group-hover:text-primary transition-colors">+91 98765-43210</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">FAQ Quick Links</h4>
                    <div className="space-y-2.5">
                        {[
                            { q: 'Track my order status', link: '/orders' },
                            { q: 'Return and placement policy', link: '/returns' },
                            { q: 'Payment issues and refunds', link: '/returns' }
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(item.link)}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white font-bold text-footerBg text-xs hover:border-primary hover:bg-primary/[0.02] transition-all text-left group"
                            >
                                <span className="group-hover:translate-x-1 transition-transform">{item.q}</span>
                                <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );



    const renderAddresses = () => {
        const addresses = userData?.addresses || [];

        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 md:p-10 min-h-[600px]"
            >
                <div className="mb-10 flex items-center gap-5">
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-2.5 bg-slate-50 text-footerBg rounded-xl hover:bg-footerBg hover:text-white transition-all group"
                    >
                        <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-footerBg tracking-tight uppercase">Saved Addresses</h2>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Add, edit, or delete shipping locations</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-footerBg tracking-tight">Saved Addresses</h2>
                    </div>
                    {!showAddressForm && (
                        <button
                            onClick={handleAddAddress}
                            className="px-6 py-3 bg-primary text-white rounded-none text-[10px] font-bold uppercase tracking-[0.1em] flex items-center gap-2 hover:bg-footerBg hover:-translate-y-0.5 transition-all shadow-md shadow-primary/10 active:scale-95 shrink-0"
                        >
                            <Plus size={16} />
                            Add New
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {showAddressForm ? (
                        <motion.div
                            key="address-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl"
                        >
                            <div className="mb-8 flex items-center justify-between">
                                <h3 className="text-xl font-black text-footerBg">{addressToEdit ? 'Edit Address' : 'Add New Address'}</h3>
                                <button onClick={() => setShowAddressForm(false)} className="text-gray-400 hover:text-footerBg font-bold text-sm">Cancel</button>
                            </div>

                            <form onSubmit={handleSaveAddress} className="space-y-6">
                                {/* Address Type Selector */}
                                <div className="flex gap-4 mb-4">
                                    {['Home', 'Office', 'Other'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setAddressForm({ ...addressForm, type })}
                                            className={`px-6 py-3 rounded-none font-bold text-xs uppercase tracking-widest transition-all ${addressForm.type === type ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            required
                                            value={addressForm.fullName}
                                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 font-semibold text-footerBg focus:border-primary outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input
                                            required
                                            value={addressForm.phone}
                                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 font-semibold text-footerBg focus:border-primary outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
                                            placeholder="+91 98765-43210"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Address</label>
                                    <textarea
                                        required
                                        value={addressForm.address}
                                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                        rows="3"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 font-semibold text-footerBg focus:border-primary outline-none transition-all resize-none placeholder:font-medium placeholder:text-slate-300"
                                        placeholder="Flat No, Building, Street Name"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">City</label>
                                        <input
                                            required
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 font-semibold text-footerBg focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">State</label>
                                        <input
                                            required
                                            value={addressForm.state}
                                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 font-semibold text-footerBg focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
                                        <input
                                            required
                                            value={addressForm.pincode}
                                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 font-semibold text-footerBg focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isDefault"
                                        checked={addressForm.isDefault}
                                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                                        className="w-5 h-5 rounded-none border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="isDefault" className="text-xs font-semibold text-slate-400 uppercase tracking-widest cursor-pointer">Set as default address</label>
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className="w-full bg-footerBg text-white py-5 rounded-none font-bold uppercase tracking-[0.2em] text-sm hover:bg-primary transition-all shadow-xl shadow-footerBg/10"
                                    >
                                        {addressToEdit ? 'Update Address' : 'Save Address'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="address-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-5"
                        >
                            {addresses.length > 0 ? addresses.map(addr => (
                                <div key={addr.id} className={`p-8 rounded-[32px] border ${addr.isDefault ? 'border-primary/30 bg-primary/5 ring-1 ring-primary/10' : 'border-gray-100 bg-gray-50/30'} relative group hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500`}>
                                    <div className="flex justify-between items-start mb-8">
                                        <div className={`w-14 h-14 ${addr.isDefault ? 'bg-primary text-white' : 'bg-white text-primary'} rounded-2xl flex items-center justify-center shadow-sm border border-gray-100`}>
                                            {addr.type === 'Home' ? <Home size={24} /> : <MapPin size={24} />}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditAddress(addr)}
                                                className="w-10 h-10 bg-white text-gray-400 hover:text-primary rounded-xl border border-gray-100 flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                className="w-10 h-10 bg-white text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xl font-bold text-footerBg tracking-tight flex items-center gap-3">
                                                {addr.type}
                                                {addr.isDefault && (
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-primary text-white px-3 py-1 rounded-full">Default</span>
                                                )}
                                            </h4>
                                        </div>

                                        <div className="space-y-1.5">
                                            <p className="text-sm font-bold text-footerBg/80">{addr.fullName}</p>
                                            <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                                                {addr.address}, {addr.city}<br />
                                                {addr.state} - {addr.pincode}
                                            </p>
                                        </div>

                                        <div className="pt-5 border-t border-gray-100 flex items-center gap-2 text-primary">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">{addr.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center bg-gray-50/50 rounded-none border border-dashed border-gray-200">
                                    <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-400 font-bold">No saved addresses found</p>
                                    <button onClick={handleAddAddress} className="mt-4 text-primary font-black uppercase tracking-widest text-xs">Add your first address</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };





    const renderSettings = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 md:p-10 min-h-[600px]"
        >
            <div className="mb-10 flex items-center gap-5">
                <button
                    onClick={() => navigate('/profile')}
                    className="p-2.5 bg-slate-50 text-footerBg rounded-xl hover:bg-footerBg hover:text-white transition-all group"
                >
                    <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-footerBg tracking-tight uppercase">Account Settings</h2>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Update profile and security details</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div />
                <div className="px-6 py-2 bg-gray-50 text-gray-600 rounded-full text-xs font-black uppercase tracking-widest">
                    Account Security
                </div>
            </div>

            <div className="max-w-xl">
                <h2 className="text-4xl font-black text-footerBg mb-4">Profile Settings</h2>
                <p className="text-gray-400 font-medium mb-12">Update your personal information and keep your account secure.</p>

                <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Full Name</label>
                            <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 font-bold text-footerBg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 font-bold text-footerBg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-6">
                        <button
                            type="submit"
                            className="bg-footerBg text-white px-10 py-4 rounded-none font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-lg shadow-footerBg/10"
                        >
                            Save Changes
                        </button>
                        {updateSuccess && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-emerald-500 font-black text-xs uppercase tracking-widest flex items-center gap-2"
                            >
                                <Check size={16} /> Updated Successfully!
                            </motion.span>
                        )}
                    </div>
                </form>

                <div className="mt-16 pt-12 border-t border-gray-100">
                    <h4 className="text-sm font-black text-footerBg uppercase tracking-widest mb-6">Security Settings</h4>
                    <button className="w-full flex items-center justify-between p-6 rounded-none border border-gray-100 bg-gray-50/50 group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-none flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                <Lock size={20} />
                            </div>
                            <span className="font-bold text-footerBg text-sm">Change Account Password</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                    </button>
                </div>
            </div>
        </motion.div>
    );

    const renderPayment = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 md:p-10 min-h-[600px]"
        >
            <div className="mb-10 flex items-center gap-5">
                <button
                    onClick={() => navigate('/profile')}
                    className="p-2.5 bg-slate-50 text-footerBg rounded-xl hover:bg-footerBg hover:text-white transition-all group"
                >
                    <ChevronRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h2 className="text-xl font-bold text-footerBg tracking-tight uppercase">Payment Methods</h2>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Manage saved UPI IDs and card details</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div />
                <button className="px-6 py-3 bg-footerBg text-white rounded-none text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-all shadow-lg shadow-footerBg/20">
                    <Plus size={16} />
                    Add New Method
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Credit Card 1 */}
                <div className="bg-gradient-to-br from-footerBg to-footerBg/80 rounded-[32px] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary/20 transition-all" />
                    <div className="relative z-10 h-full flex flex-col justify-between min-h-[160px]">
                        <div className="flex justify-between items-start">
                            <CreditCard size={32} strokeWidth={1.5} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Debit Card</span>
                        </div>
                        <div>
                            <p className="text-xl font-black tracking-[0.2em] mb-4">•••• •••• •••• 4242</p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Card Holder</p>
                                    <p className="text-sm font-bold uppercase">{userData.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-50 mb-1">Expires</p>
                                    <p className="text-sm font-bold">12 / 28</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* UPI Method */}
                <div className="bg-gray-50 border border-gray-100 rounded-[32px] p-8 flex flex-col justify-between hover:border-primary/30 transition-all group">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                <Shield size={24} />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified UPI</span>
                        </div>
                        <h4 className="text-lg font-black text-footerBg mb-1">upi_id@okaxis</h4>
                        <p className="text-xs text-gray-400 font-medium">Primary Payment Method</p>
                    </div>
                    <div className="pt-6 flex gap-3">
                        <button className="flex-1 bg-white border border-gray-200 py-3 rounded-xl font-bold text-[10px] text-footerBg hover:bg-footerBg hover:text-white transition-all uppercase tracking-widest">Remove</button>
                        <button className="flex-1 bg-white border border-gray-200 py-3 rounded-xl font-bold text-[10px] text-footerBg hover:bg-footerBg hover:text-white transition-all uppercase tracking-widest">Set Default</button>
                    </div>
                </div>
            </div>

            <div className="mt-12 p-8 bg-footerBg/5 rounded-[32px] border border-footerBg/10 flex items-start gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Shield size={24} />
                </div>
                <div>
                    <h4 className="font-black text-footerBg mb-1">Secure Payments</h4>
                    <p className="text-xs text-footerBg/70 font-medium leading-relaxed max-w-2xl">
                        Your payment information is encrypted and securely stored. We never share your card details with anyone. All transactions are protected by industry-standard SSL encryption.
                    </p>
                </div>
            </div>
        </motion.div>
    );

    if (!userData) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    const ordersData = getOrders(userData.id);

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-20 font-['Inter']">


            <div className="w-full">
                <div className="flex flex-col lg:flex-row items-stretch min-h-screen">

                    {/* LEFT SIDEBAR - Integrated Profile Info */}
                    <div className="w-full lg:w-[350px] bg-footerBg text-white relative overflow-hidden shrink-0 flex flex-col sticky top-0 h-screen">
                        {/* Decorative background circle */}
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                        <div className="relative z-10 flex-1 p-8 overflow-y-auto">
                            {/* Header: Hey Name + Avatar */}
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-xl font-bold font-['Poppins'] tracking-tight">Hey</h3>
                                    <h2 className="text-3xl font-bold font-['Poppins'] tracking-tight text-white">{userData.name.split(' ')[0]}</h2>
                                </div>
                                <div className="relative">
                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-2xl font-bold lowercase">
                                        {userData.name.charAt(0)}
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (isEditing) {
                                                const fakeEvent = { preventDefault: () => { } };
                                                handleUpdateProfile(fakeEvent);
                                                setIsEditing(false);
                                            } else {
                                                setIsEditing(true);
                                            }
                                        }}
                                        className={`absolute -top-1 -right-1 w-7 h-7 ${isEditing ? 'bg-primary text-white' : 'bg-white text-footerBg'} rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all`}
                                    >
                                        {isEditing ? <Check size={12} /> : <Edit3 size={12} />}
                                    </button>
                                </div>
                            </div>

                            {/* Info Fields */}
                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest ml-1">Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 font-semibold text-white outline-none focus:border-primary transition-all"
                                            autoFocus
                                        />
                                    ) : (
                                        <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-semibold text-white/90">
                                            {userData.name}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest ml-1">Email Address</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 font-semibold text-white outline-none focus:border-primary transition-all"
                                        />
                                    ) : (
                                        <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-semibold text-white/90 truncate text-sm">
                                            {userData.email}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest ml-1 text-left">Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            value={editForm.phone}
                                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                            className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 font-semibold text-white outline-none focus:border-primary transition-all text-left"
                                        />
                                    ) : (
                                        <div className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-semibold text-left ${userData.phone ? 'text-white/90' : 'text-white/40'}`}>
                                            {userData.phone || 'Mobile Not Linked'}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest ml-1">Gender</label>
                                        {isEditing ? (
                                            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                                                {['Male', 'Female'].map((g) => (
                                                    <button
                                                        key={g}
                                                        type="button"
                                                        onClick={() => setEditForm({ ...editForm, gender: g })}
                                                        className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${editForm.gender === g ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
                                                    >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-semibold text-white/90 text-xs">
                                                {userData.gender || 'Not Specified'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-bold text-white/50 uppercase tracking-widest ml-1">Birth Date</label>
                                        {isEditing ? (
                                            <div className="relative group">
                                                <input
                                                    type="date"
                                                    value={editForm.birthDate}
                                                    onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                                                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-3.5 pl-3 pr-2 font-semibold text-white outline-none focus:border-primary transition-all text-xs"
                                                />
                                                <Calendar size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none ml-2 shrink-0" />
                                            </div>
                                        ) : (
                                            <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-semibold text-white/90 text-xs">
                                                {userData.birthDate || 'Not Set'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Footer: Full-width Red Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center bg-[#ef4444] text-white hover:bg-[#dc2626] transition-all group border-0 shrink-0"
                        >
                            <div className="w-20 h-20 bg-black/10 flex items-center justify-center shrink-0 group-hover:bg-black/20 transition-all border-r border-white/10">
                                <LogOut size={24} />
                            </div>
                            <div className="flex-1 px-6 text-left">
                                <p className="text-sm font-bold uppercase tracking-[0.2em]">Logout</p>
                                <p className="text-[10px] text-white/60 font-medium">End current session</p>
                            </div>
                        </button>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 bg-white min-w-0 h-screen overflow-y-auto">
                        <AnimatePresence mode="wait">
                            {activeTab === 'Overview' && (
                                <motion.div
                                    key="dashboard"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    {renderDashboard()}
                                </motion.div>
                            )}
                            {activeTab === 'Coupons' && renderCoupons()}

                            {activeTab === 'Support' && renderSupport()}
                            {activeTab === 'Addresses' && renderAddresses()}
                            {activeTab === 'Settings' && renderSettings()}
                            {activeTab === 'Payment' && renderPayment()}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
