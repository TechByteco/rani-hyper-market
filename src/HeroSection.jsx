import React from 'react';
import { useLanguage } from './LanguageContext';

export const HeroSection = ({ heroRef }) => {
  const { t, isTamil } = useLanguage();

  return (
    <section 
      ref={heroRef}
      id="hero-pinned-section"
      className="border-b border-[#E5DCCF] bg-[#F7F1E6] pt-10 sm:pt-14 pb-12 sm:pb-16 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 anim-hero-text-group">
            
            {/* Eyebrow Badge */}
            <div className="anim-hero-eyebrow inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#E5DCCF] text-xs font-bold text-[#214A38] mb-5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BD4A35]"></span>
              <span>{t.eyebrow}</span>
            </div>

            {/* Main Headline */}
            <h1 className={`anim-hero-heading text-4xl sm:text-5xl lg:text-6xl text-[#1D2921] leading-[1.1] mb-3 ${
              isTamil ? 'font-tamil font-bold tracking-normal' : 'font-serif tracking-tight'
            }`}>
              {t.headline}
            </h1>

            {/* Subline */}
            <p className="font-tamil font-bold text-[#214A38] text-base sm:text-lg mb-5">
              {t.tamilSubline}
            </p>

            {/* Supporting Copy */}
            <p className={`anim-hero-desc text-[#536259] text-base sm:text-lg leading-relaxed max-w-2xl mb-7 ${
              isTamil ? 'font-tamil' : ''
            }`}>
              {t.description}
            </p>

            {/* CTA Buttons & Offer Link */}
            <div className="anim-hero-actions flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
              <a 
                href="/store" 
                className="btn-primary text-sm sm:text-base py-3 px-6 sm:px-7 inline-flex items-center gap-2"
              >
                <span>{t.primaryCTA}</span>
                <span>→</span>
              </a>
              <a 
                href="#offers" 
                className="link-editorial text-sm sm:text-base inline-flex items-center gap-1.5"
              >
                <span>{t.secondaryCTA}</span>
                <span>→</span>
              </a>
            </div>

            {/* Search Bar Preview */}
            <form action="/store" method="GET" className="max-w-xl mb-7">
              <div className="flex items-center bg-white rounded-lg border border-[#E5DCCF] p-1 shadow-xs focus-within:border-[#214A38] transition">
                <i className="fa-solid fa-magnifying-glass text-[#536259] ml-3 text-sm"></i>
                <input 
                  type="text" 
                  name="search" 
                  placeholder={t.searchPlaceholder} 
                  aria-label={t.searchPlaceholder}
                  className="w-full px-3 py-2 text-xs sm:text-sm text-[#1D2921] placeholder-[#798880] focus:outline-none bg-transparent"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-[#214A38] hover:bg-[#18372A] text-white text-xs font-bold px-4 py-2 rounded-md transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <span>{t.searchButton}</span>
                </button>
              </div>
            </form>

            {/* Trust Row */}
            <div className={`anim-hero-trust pt-2 border-t border-[#E5DCCF] text-xs sm:text-[13px] font-semibold text-[#536259] flex flex-wrap items-center gap-y-2 ${
              isTamil ? 'font-tamil' : ''
            }`}>
              <span>{t.trust1}</span>
              <span className="mx-2 text-[#BD4A35]">·</span>
              <span>{t.trust2}</span>
              <span className="mx-2 text-[#BD4A35]">·</span>
              <span>{t.trust3}</span>
            </div>

          </div>

          {/* Right Column: Real Photograph & Compact Solid Green Offer Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Real Grocery / Store Photograph Container */}
            <div className="w-full h-72 sm:h-84 rounded-lg overflow-hidden border border-[#E5DCCF] bg-white shadow-xs relative">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80" 
                alt="Fresh Groceries and Farm Produce at Rani Hyper Market, Bodinayakanur" 
                className="anim-hero-img w-full h-full object-cover transform origin-center will-change-transform"
                loading="eager"
              />
              <div className="anim-hero-overlay absolute inset-0 bg-black/40 opacity-0 pointer-events-none transition-opacity"></div>
              <div className="absolute bottom-3 left-3 bg-[#1D2921]/90 text-white text-[11px] font-bold px-3 py-1 rounded border border-white/20 z-10">
                📍 {t.photoCaption}
              </div>
            </div>

            {/* Compact Solid Green Offer Card */}
            <div className="anim-offer-card retail-card-green p-5 sm:p-6 shadow-sm will-change-transform">
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="bg-[#BD4A35] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded">
                  {t.offerLabel}
                </span>
                <span className="text-[#C69B43] text-xs font-bold">
                  {t.offerValidity}
                </span>
              </div>
              <h3 className={`text-2xl sm:text-3xl text-white mb-2 leading-tight ${
                isTamil ? 'font-tamil font-bold' : 'font-serif'
              }`}>
                {t.offerText}
              </h3>
              <p className={`text-emerald-100 text-xs sm:text-sm leading-relaxed mb-4 ${
                isTamil ? 'font-tamil' : ''
              }`}>
                {t.offerSubtext}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#2D634C] text-xs">
                <span className="font-bold text-emerald-200">{t.offerBadge}</span>
                <a href="/store" className="text-[#C69B43] hover:text-white font-bold underline transition inline-flex items-center gap-1">
                  <span>{t.offerCTA}</span>
                  <span>→</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
