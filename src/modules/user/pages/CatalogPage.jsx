
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useShop } from '../../../context/ShopContext';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ChevronRight,
    Filter,
    Star,
    ShoppingCart,
    Heart,
    Search,
    ChevronDown,
    ArrowLeft
} from 'lucide-react';
import { PRODUCTS as productsData, PACKS as packsData } from '../../../mockData/data'; // Import grouped products with variants

const categoriesData = [
    {
        id: 'nuts',
        name: 'Nuts',
        subcategories: ['Walnuts (Akhrot)', 'Almonds (Badam)', 'Cashew (Kaju)', 'Pistachio (Pista)', 'Hazelnuts', 'Macadamia Nuts', 'Pecan Nuts']
    },
    {
        id: 'dried-fruits',
        name: 'Dried Fruits',
        subcategories: ['Raisins (Kishmish)', 'Dried Figs (Anjeer)', 'Dried Apricots (Khubani)', 'Dried Kiwi', 'Dried Prunes', 'Wet Dates', 'Dry Dates']
    },
    {
        id: 'seeds-mixes',
        name: 'Seeds & Mixes',
        subcategories: ['Chia Seeds', 'Pumpkin Seeds', 'Flax Seeds', 'Sunflower Seeds', 'Berries Mix', 'Nut Mix', 'Trail Mix']
    },
    {
        id: 'combos-packs',
        name: 'Combos & Packs',
        subcategories: ['Daily Packs', 'Family Packs', 'Party Packs', 'Festival Packs', 'Health & Fitness Packs', 'Wedding Gifting Packs']
    }
];

import ProductCard from '../components/ProductCard';

const CatalogPage = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const { user } = useAuth();
    // const { addToCart, toggleWishlist, isInWishlist } = useShop(); // These are now handled in ProductCard
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSubcategory, setSelectedSubcategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredCategory, setHoveredCategory] = useState(null);

    useEffect(() => {
        if (category) {
            // Check if it matches a main category ID
            const mainCat = categoriesData.find(c => c.id === category || c.name.toLowerCase().replace(/ /g, '-') === category);
            if (mainCat) {
                setSelectedCategory(mainCat.id);
                setSelectedSubcategory('all');
                return;
            }

            // Check if it matches a subcategory
            for (const cat of categoriesData) {
                const sub = cat.subcategories.find(s => s.toLowerCase().replace(/ /g, '-') === category);
                if (sub) {
                    setSelectedCategory(cat.id);
                    setSelectedSubcategory(sub);
                    return;
                }
            }

            // Fallback for unmatched categories
            setSelectedCategory('all');
            setSelectedSubcategory('all');
        } else {
            // Reset if accessed directly via /catalog
            setSelectedCategory('all');
            setSelectedSubcategory('all');
        }
    }, [category]);

    const filteredProducts = useMemo(() => {
        const allItems = [...productsData, ...packsData];
        return allItems.filter(product => {
            const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase().replace(' & ', '-').replace(' ', '-') === selectedCategory || product.category.toLowerCase() === selectedCategory;
            // Simplified category matching logic for the demo data structure vs category IDs
            // In a real app, IDs should match perfectly. Here we do a loose check.
            const catIdMap = {
                'Nuts': 'nuts',
                'Dried Fruits': 'dried-fruits',
                'Seeds & Mixes': 'seeds-mixes',
                'Combos & Packs': 'combos-packs'
            };

            const productCatId = catIdMap[product.category] || product.category.toLowerCase();
            const isCatMatch = selectedCategory === 'all' || productCatId === selectedCategory;

            const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory === selectedSubcategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase());
            return isCatMatch && matchesSubcategory && matchesSearch;
        });
    }, [selectedCategory, selectedSubcategory, searchQuery]);

    const handleCategoryClick = (catId) => {
        if (selectedCategory === catId) {
            navigate('/catalog');
        } else {
            navigate(`/category/${catId}`);
        }
    };

    return (
        <div className="bg-[#fcfcfc] min-h-screen font-['Inter'] flex flex-col lg:flex-row">

            {/* CONSTANT SIDEBAR */}
            <aside className="lg:w-72 shrink-0 lg:sticky lg:top-0 lg:h-screen border-r border-gray-200 flex flex-col justify-between bg-[#e0f0e9] z-30">
                {/* Scrollable Collections List */}
                <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth space-y-2 pr-0 pt-4 pb-2">
                    <div>
                        <div className="flex items-center justify-between mb-2 px-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-footerBg font-['Poppins']">Collections</h3>
                            <Filter size={14} className="text-footerBg/30" />
                        </div>

                        <nav className="space-y-0">
                            <button
                                onClick={() => navigate('/catalog')}
                                className={`w-full text-left px-5 py-3 text-[13px] font-bold transition-all ${selectedCategory === 'all' ? 'text-primary bg-white border-l-4 border-primary' : 'text-footerBg hover:bg-white/50 border-l-4 border-transparent'}`}
                            >
                                All Products
                            </button>
                            {categoriesData.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="space-y-0"
                                    onMouseEnter={() => setHoveredCategory(cat.id)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                >
                                    <button
                                        onClick={() => handleCategoryClick(cat.id)}
                                        className={`w-full flex items-center justify-between px-5 py-3 text-[13px] font-bold transition-all border-l-4 ${selectedCategory === cat.id ? 'text-primary border-primary bg-white/30' : 'text-footerBg/80 border-transparent hover:text-footerBg hover:bg-white/30'}`}
                                    >
                                        {cat.name}
                                        <ChevronRight size={14} className={`transition-transform duration-300 ${selectedCategory === cat.id ? 'rotate-90 text-primary' : 'text-footerBg/30'}`} />
                                    </button>

                                    <AnimatePresence>
                                        {(selectedCategory === cat.id || hoveredCategory === cat.id) && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden bg-white/20"
                                            >
                                                {cat.subcategories.map(sub => (
                                                    <button
                                                        key={sub}
                                                        onClick={() => navigate(`/category/${sub.toLowerCase().replace(/ /g, '-')}`)}
                                                        className={`w-full text-left pl-8 pr-4 py-2.5 text-[11px] font-bold transition-all ${selectedSubcategory === sub ? 'text-primary bg-white/80' : 'text-footerBg/60 hover:text-primary hover:bg-white/20'}`}
                                                    >
                                                        {sub}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Quick Find - Fixed at Bottom of Sidebar */}
                <div className="pt-3 mt-auto border-t border-gray-200/50 bg-[#e0f0e9] z-10 px-4 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" size={14} />
                        <input
                            type="text"
                            placeholder="Quick Find..."
                            className="w-full bg-white border border-primary/20 shadow-sm rounded-lg py-2.5 pl-9 pr-4 text-[11px] font-bold text-footerBg placeholder-footerBg/40 focus:ring-1 focus:ring-primary/40 transition-all font-['Poppins']"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </aside>

            {/* PRODUCT LIST */}
            <main className="flex-1 py-10 px-6 lg:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-40 text-left">
                        <h3 className="text-2xl font-bold text-gray-300">No products found...</h3>
                    </div>
                )}
            </main>
        </div>
    );
};



export default CatalogPage;
