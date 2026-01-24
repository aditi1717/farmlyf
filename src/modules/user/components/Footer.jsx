
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Instagram,
    Twitter,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    ShieldCheck,
    Truck,
    RotateCcw,
    Award
} from 'lucide-react';
import logo from '../../../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-footerBg text-white pt-20 pb-10 px-4 md:px-12 relative overflow-hidden">
            {/* Newsletter Section */}
            <div className="container mx-auto mb-20">
                <div className="bg-primary/10 rounded-[3rem] p-8 md:p-12 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-3xl font-brand font-bold tracking-tight flex items-center gap-2 justify-center md:justify-start">
                            Join the <img src={logo} alt="FarmLyf" className="h-8 w-auto object-contain" /> Family!
                        </h3>
                        <p className="text-gray-400 max-w-md">Subscribe to get exclusive offers, healthy recipes, and the first taste of our new premium dry fruits.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-3">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="bg-white/5 border border-white/10 rounded-full px-6 py-4 flex-grow md:w-80 focus:outline-none focus:border-primary transition-colors text-sm"
                        />
                        <button className="bg-primary hover:bg-primaryHover text-white px-8 py-4 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 whitespace-nowrap">
                            Join Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-20">
                {/* Brand Column */}
                <div className="space-y-8">
                    <Link to="/" className="inline-block">
                        <img src={logo} alt="FarmLyf" className="h-10 w-auto object-contain" />
                    </Link>
                    <p className="text-gray-400 leading-relaxed">
                        Bringing you the finest, hand-picked dry fruits from around the globe. We believe in quality that nourishes and flavors that delight.
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Instagram, Twitter].map((Icon, i) => (
                            <Link key={i} to="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                                <Icon size={18} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-bold mb-8 font-['Poppins']">Quick Shop</h4>
                    <ul className="space-y-4 text-gray-400">
                        {['Daily Health Packs', 'Grand Family Packs', 'Energy & Fitness', 'Traditional Festival', 'Executive Gifting'].map((item, i) => (
                            <li key={i}>
                                <Link to="#" className="hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <h4 className="text-lg font-bold mb-8 font-['Poppins']">Information</h4>
                    <ul className="space-y-4 text-gray-400 text-sm">
                        {[
                            { name: 'About Us', path: '/about-us' },
                            { name: 'Track Your Order', path: '/orders' },
                            { name: 'Return & Refunds', path: '/returns' },
                            { name: 'Privacy Policy', path: '/privacy-policy' },
                            { name: 'Terms of Service', path: '#' }
                        ].map((item, i) => (
                            <li key={i}>
                                <Link to={item.path} className="hover:text-primary transition-colors flex items-center gap-2 group">
                                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-bold mb-8 font-['Poppins']">Contact Us</h4>
                    <ul className="space-y-6 text-gray-400 text-sm">
                        <li className="flex gap-4">
                            <MapPin className="text-primary shrink-0" size={20} />
                            <span>Office No 501, Princess center, 5th Floor, <br />New Palasia, Indore, Madhya Pradesh 452001</span>
                        </li>
                        <li className="flex gap-4">
                            <Phone className="text-primary shrink-0" size={20} />
                            <span>+91 98765 43210</span>
                        </li>
                        <li className="flex gap-4">
                            <Mail className="text-primary shrink-0" size={20} />
                            <span>hello@farmlyf.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="container mx-auto border-t border-white/5 pt-10 pb-20 flex flex-wrap justify-center md:justify-between items-center gap-8">
                <div className="flex items-center gap-3 text-sm text-gray-400 bg-white/5 px-6 py-3 rounded-2xl">
                    <Award className="text-primary" size={20} />
                    <span>Certified Quality</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400 bg-white/5 px-6 py-3 rounded-2xl">
                    <Truck className="text-primary" size={20} />
                    <span>Pan-India Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400 bg-white/5 px-6 py-3 rounded-2xl">
                    <ShieldCheck className="text-primary" size={20} />
                    <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400 bg-white/5 px-6 py-3 rounded-2xl">
                    <RotateCcw className="text-primary" size={20} />
                    <span>7-Day Return Policy</span>
                </div>
            </div>

            {/* Bottom Credit */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 font-medium text-xs text-gray-500 gap-4">
                <p className="flex items-center gap-1">© 2026 <img src={logo} alt="FarmLyf" className="h-4 w-auto object-contain" />. Crafted with ❤️ for healthy living.</p>
                <div className="flex gap-6">
                    <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link to="#" className="hover:text-white transition-colors">Terms</Link>
                    <Link to="#" className="hover:text-white transition-colors">Cookies</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
