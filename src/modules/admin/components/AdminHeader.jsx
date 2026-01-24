import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const AdminHeader = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-footerBg border-b border-white/5 flex items-center justify-between sticky top-0 z-40 text-left">
            {/* Search Bar */}
            <div className="relative w-96 ml-8">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search orders, products or users..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm font-semibold text-white focus:bg-white/10 focus:border-primary outline-none transition-all placeholder:text-gray-600"
                />
            </div>

            {/* Right Actions with Dark Background */}
            <div className="h-full bg-white/5 px-8 flex items-center gap-6 border-l border-white/5">
                <button className="relative p-2.5 bg-white/5 text-gray-400 rounded-xl hover:text-white border border-white/10 shadow-sm transition-all focus:ring-2 focus:ring-primary/10">
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-footerBg shadow-sm"></span>
                </button>

                <div className="h-8 w-px bg-white/10 mx-1" />

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right">
                        <p className="text-sm font-black text-white leading-none">{user?.name || 'Admin User'}</p>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1.5">Staff Account</p>
                    </div>
                    <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center border border-white/10 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
