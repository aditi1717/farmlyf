
import React from 'react';
import { ArrowRight } from 'lucide-react';
import heroBanner from '../../../assets/images/hero.png';
import logo from '../../../assets/logo.png';

const HeroSection = () => {
    return (
        <div className="w-full bg-background py-6 md:py-10 px-4 md:px-12">
            <div className="w-full">
                <div className="relative w-full rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/6] bg-[#fdfdfd] shadow-2xl border border-mint/20 flex items-center justify-between px-6 md:px-20 group">

                    {/* Background Banner Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={heroBanner}
                            alt="FarmLyf Brand Banner"
                            className="w-full h-full object-cover object-center"
                        />
                    </div>

                    {/* Branding Overlay - Clean and separated */}
                    <div className="absolute top-4 left-6 md:left-12 z-40 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/80 font-bold block">Passion for Nutrition</span>
                        <div className="flex items-center gap-1.5">
                            <img src={logo} alt="FarmLyf" className="h-6 w-auto object-contain" />
                        </div>
                    </div>

                    {/* Left Side Content - Compact and pushed down */}
                    <div className="z-30 space-y-1 md:space-y-2 max-w-md mt-28 md:mt-24 md:ml-4 relative">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="bg-offerRed text-white text-[9px] md:text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">LIMITED TIME</span>
                            <span className="text-white bg-primary px-2.5 py-1 rounded-full font-bold text-[9px] md:text-[10px] tracking-widest uppercase shadow-md">Republic Day Special</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-white drop-shadow-lg leading-tight">
                            <span className="text-offerRed block -mb-1">Sale</span> is Live!
                        </h1>
                        <p className="text-white/95 text-xs md:text-lg font-bold max-w-xs leading-snug drop-shadow-sm">
                            Experience the crunch of health with our <span className="text-primary-light">Premium Selection</span>.
                        </p>
                        <button className="mt-3 bg-primary hover:bg-primaryHover text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold text-sm md:text-base flex items-center gap-2 transition-all shadow-xl active:scale-95">
                            Shop Collections <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Right Side Offer Box - Smaller, Straight, and Compact */}
                    <div className="hidden lg:flex flex-col items-center justify-center border border-white/60 bg-white/80 backdrop-blur-xl p-5 md:p-6 rounded-2xl shadow-2xl z-20 relative transition-all duration-500">
                        <div className="absolute -top-3 -right-3 bg-offerRed text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce uppercase tracking-tighter">
                            Hot Deal
                        </div>
                        <div className="text-center font-sans">
                            <p className="text-footerBg/60 font-black text-[9px] uppercase tracking-[0.2em]">Upto</p>
                            <div className="flex items-baseline gap-0.5 justify-center leading-none my-1">
                                <span className="text-5xl font-black text-offerRed tracking-tighter">60</span>
                                <div className="flex flex-col items-start translate-y-1">
                                    <span className="text-xl font-black text-footerBg">%</span>
                                    <span className="text-[9px] font-bold text-footerBg/70 uppercase">Off</span>
                                </div>
                            </div>
                            <div className="w-10 h-1 bg-primary/30 mx-auto rounded-full my-2"></div>
                            <p className="text-footerBg/60 font-black text-[9px] uppercase tracking-[0.2em]">Extra Save</p>
                            <div className="flex items-baseline gap-0.5 justify-center leading-none mt-1">
                                <span className="text-3xl font-black text-primary">15</span>
                                <span className="text-lg font-bold text-footerBg">%</span>
                            </div>
                        </div>
                        <div className="mt-5 bg-footerBg text-white px-5 py-2 rounded-lg text-xs font-black tracking-widest border border-white/20 select-all cursor-pointer hover:bg-primary transition-colors">
                            REPUBLICJOY
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
