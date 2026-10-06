import React, { useRef, useState } from 'react';
import { useLanguage } from './LanguageContext';
import LanguageToggle from './LanguageToggle';
import HeroSection from './HeroSection';
import useScrollAnimations from './ScrollAnimations';

export const LandingPage = () => {
  const { t, isTamil } = useLanguage();
  const heroPinRef = useRef(null);
  const nextSectionRef = useRef(null);

  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Activate refined GSAP ScrollTrigger movement
  useScrollAnimations({ heroPinRef, nextSectionRef });

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className={`min-h-screen bg-[#F7F1E6] text-[#1D2921] ${isTamil ? 'font-tamil' : ''}`}>
      
      {/* 1. ANNOUNCEMENT BAR */}
      <aside className="bg-[#214A38] text-white text-xs py-2 px-4 border-b border-[#18372A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 font-medium text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C69B43]"></span>
            <span>{t.announcement}</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100">
            <span>{isTamil ? 'திறந்திருக்கும் நேரம்:' : 'Open Daily'} <strong>{t.hoursTime}</strong></span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:inline">WhatsApp: <strong className="text-white">+91 77088 34547</strong></span>
          </div>
        </div>
      </aside>

      {/* 2. HEADER */}
      <header className="bg-[#F7F1E6] border-b border-[#E5DCCF] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand Logo & Name */}
          <a href="/" className="flex items-center gap-3 sm:gap-3.5 no-underline group flex-shrink-0">
            <img 
              src="/images/rani_logo.png" 
              alt="Rani Hyper Market Official Logo" 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border border-[#214A38]/30 shadow-xs group-hover:scale-105 transition-transform bg-white"
            />
            <div>
              <span className={`text-xl sm:text-2xl text-[#1D2921] block leading-tight ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>
                Rani Hyper Market
              </span>
              <span className="text-[11px] font-bold text-[#214A38] uppercase tracking-wider block">
                {t.brandSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6 text-[13.5px] font-bold text-[#536259]">
            <a href="#about" className="hover:text-[#214A38] transition">{t.navAbout}</a>
            <a href="#departments" className="hover:text-[#214A38] transition">{t.navDepartments}</a>
            <a href="#offers" className="hover:text-[#BD4A35] transition flex items-center gap-1.5">
              <span>{t.navOffers}</span>
              <span className="bg-[#BD4A35] text-white text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase">Save</span>
            </a>
            <a href="#brands" className="hover:text-[#214A38] transition">{t.navBrands}</a>
            <a href="#faq" className="hover:text-[#214A38] transition">{t.navFaq}</a>
            <a href="#location" className="hover:text-[#214A38] transition">{t.navLocation}</a>
          </nav>

          {/* Header Action Area: Compact Language Switcher + Call + Store Link */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* PRIMARY TASK 1: Language Switcher [ தமிழ் | English ] placed before search/cart */}
            <LanguageToggle />

            {/* Direct Phone Call */}
            <a 
              href="tel:+917708834547" 
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5DCCF] bg-white text-[#1D2921] hover:border-[#214A38] text-xs font-bold transition no-underline"
            >
              <i className="fa-solid fa-phone text-[#214A38]"></i>
              <span>{t.navCall}</span>
            </a>

            {/* Explore Store Button */}
            <a href="/store" className="btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4 inline-flex items-center gap-1.5">
              <span className="hidden xs:inline">{t.navExplore}</span>
              <span className="xs:hidden">Store</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </a>

            {/* Mobile Menu Button */}
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-[#E5DCCF] text-[#1D2921] flex items-center justify-center cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <i className="fa-solid fa-bars text-sm sm:text-base"></i>
            </button>
          </div>

        </div>
      </header>

      {/* 3. HERO SECTION WITH GSAP SCROLL MOVEMENT */}
      <HeroSection heroRef={heroPinRef} />

      {/* 4. DEPARTMENTS */}
      <section 
        id="departments" 
        ref={nextSectionRef}
        className="py-14 sm:py-20 border-b border-[#E5DCCF] bg-[#FAF5ED]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E5DCCF]">
            <div>
              <span className="text-[#BD4A35] text-xs font-black uppercase tracking-wider block mb-1">
                {t.departmentsSubtitle}
              </span>
              <h2 className={`text-3xl sm:text-4xl text-[#1D2921] ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>
                {t.departmentsTitle}
              </h2>
            </div>
            <a href="/store" className="link-editorial text-xs sm:text-sm">
              <span>{t.departmentsViewAll}</span>
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* Category Cards with .anim-dept-card */}
            <a href="/store?category=rice" className="department-card anim-dept-card">
              <div>
                <div className="w-10 h-10 rounded-md bg-[#F7F1E6] border border-[#E5DCCF] flex items-center justify-center text-xl mb-3">🌾</div>
                <h4 className={`text-lg text-[#1D2921] mb-1 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.deptRice}</h4>
                <p className="text-xs text-[#536259]">{t.deptRiceDesc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5DCCF] flex items-center justify-between text-xs font-bold text-[#214A38]">
                <span>{t.deptRiceCount}</span><span>→</span>
              </div>
            </a>

            <a href="/store?category=milk" className="department-card anim-dept-card">
              <div>
                <div className="w-10 h-10 rounded-md bg-[#F7F1E6] border border-[#E5DCCF] flex items-center justify-center text-xl mb-3">🥛</div>
                <h4 className={`text-lg text-[#1D2921] mb-1 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.deptDairy}</h4>
                <p className="text-xs text-[#536259]">{t.deptDairyDesc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5DCCF] flex items-center justify-between text-xs font-bold text-[#214A38]">
                <span>{t.deptDairyCount}</span><span>→</span>
              </div>
            </a>

            <a href="/store?category=masala" className="department-card anim-dept-card">
              <div>
                <div className="w-10 h-10 rounded-md bg-[#F7F1E6] border border-[#E5DCCF] flex items-center justify-center text-xl mb-3">🌶️</div>
                <h4 className={`text-lg text-[#1D2921] mb-1 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.deptMasala}</h4>
                <p className="text-xs text-[#536259]">{t.deptMasalaDesc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5DCCF] flex items-center justify-between text-xs font-bold text-[#214A38]">
                <span>{t.deptMasalaCount}</span><span>→</span>
              </div>
            </a>

            <a href="/store?category=oil" className="department-card anim-dept-card">
              <div>
                <div className="w-10 h-10 rounded-md bg-[#F7F1E6] border border-[#E5DCCF] flex items-center justify-center text-xl mb-3">🫙</div>
                <h4 className={`text-lg text-[#1D2921] mb-1 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.deptOil}</h4>
                <p className="text-xs text-[#536259]">{t.deptOilDesc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5DCCF] flex items-center justify-between text-xs font-bold text-[#214A38]">
                <span>{t.deptOilCount}</span><span>→</span>
              </div>
            </a>

            <a href="/store?category=tea" className="department-card anim-dept-card">
              <div>
                <div className="w-10 h-10 rounded-md bg-[#F7F1E6] border border-[#E5DCCF] flex items-center justify-center text-xl mb-3">☕</div>
                <h4 className={`text-lg text-[#1D2921] mb-1 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.deptTea}</h4>
                <p className="text-xs text-[#536259]">{t.deptTeaDesc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5DCCF] flex items-center justify-between text-xs font-bold text-[#214A38]">
                <span>{t.deptTeaCount}</span><span>→</span>
              </div>
            </a>

            <a href="/store?category=biscuit" className="department-card anim-dept-card">
              <div>
                <div className="w-10 h-10 rounded-md bg-[#F7F1E6] border border-[#E5DCCF] flex items-center justify-center text-xl mb-3">🍪</div>
                <h4 className={`text-lg text-[#1D2921] mb-1 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.deptBiscuits}</h4>
                <p className="text-xs text-[#536259]">{t.deptBiscuitsDesc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5DCCF] flex items-center justify-between text-xs font-bold text-[#214A38]">
                <span>{t.deptBiscuitsCount}</span><span>→</span>
              </div>
            </a>

            <a href="/store?category=soap" className="department-card anim-dept-card">
              <div>
                <div className="w-10 h-10 rounded-md bg-[#F7F1E6] border border-[#E5DCCF] flex items-center justify-center text-xl mb-3">🧴</div>
                <h4 className={`text-lg text-[#1D2921] mb-1 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.deptPersonal}</h4>
                <p className="text-xs text-[#536259]">{t.deptPersonalDesc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5DCCF] flex items-center justify-between text-xs font-bold text-[#214A38]">
                <span>{t.deptPersonalCount}</span><span>→</span>
              </div>
            </a>

            <a href="/store?category=cleaner" className="department-card anim-dept-card">
              <div>
                <div className="w-10 h-10 rounded-md bg-[#F7F1E6] border border-[#E5DCCF] flex items-center justify-center text-xl mb-3">🧹</div>
                <h4 className={`text-lg text-[#1D2921] mb-1 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.deptCleaning}</h4>
                <p className="text-xs text-[#536259]">{t.deptCleaningDesc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E5DCCF] flex items-center justify-between text-xs font-bold text-[#214A38]">
                <span>{t.deptCleaningCount}</span><span>→</span>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* 5. ABOUT STORE / VALUES */}
      <section id="about" className="py-14 sm:py-20 border-b border-[#E5DCCF] bg-[#F7F1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <span className="text-[#BD4A35] text-xs font-black uppercase tracking-wider block mb-1">
              {t.aboutTag}
            </span>
            <h2 className={`text-3xl sm:text-4xl text-[#1D2921] mb-4 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>
              {t.aboutTitle}
            </h2>
            <p className="text-[#536259] text-base leading-relaxed">
              {t.aboutDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="retail-card p-5">
              <div className="w-9 h-9 rounded-md bg-[#214A38] text-white flex items-center justify-center text-sm mb-3">
                <i className="fa-solid fa-wheat-awn"></i>
              </div>
              <h4 className={`text-lg text-[#1D2921] mb-1.5 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.pillar1Title}</h4>
              <p className="text-xs text-[#536259] leading-relaxed">{t.pillar1Desc}</p>
            </div>

            <div className="retail-card p-5">
              <div className="w-9 h-9 rounded-md bg-[#214A38] text-white flex items-center justify-center text-sm mb-3">
                <i className="fa-solid fa-receipt"></i>
              </div>
              <h4 className={`text-lg text-[#1D2921] mb-1.5 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.pillar2Title}</h4>
              <p className="text-xs text-[#536259] leading-relaxed">{t.pillar2Desc}</p>
            </div>

            <div className="retail-card p-5">
              <div className="w-9 h-9 rounded-md bg-[#214A38] text-white flex items-center justify-center text-sm mb-3">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <h4 className={`text-lg text-[#1D2921] mb-1.5 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.pillar3Title}</h4>
              <p className="text-xs text-[#536259] leading-relaxed">{t.pillar3Desc}</p>
            </div>

            <div className="retail-card p-5">
              <div className="w-9 h-9 rounded-md bg-[#214A38] text-white flex items-center justify-center text-sm mb-3">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <h4 className={`text-lg text-[#1D2921] mb-1.5 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>{t.pillar4Title}</h4>
              <p className="text-xs text-[#536259] leading-relaxed">{t.pillar4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WEEKLY OFFERS SECTION */}
      <section id="offers" className="py-12 sm:py-16 border-b border-[#E5DCCF] bg-[#FAF5ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="retail-card p-6 sm:p-10 border-2 border-[#D6CAB8]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#BD4A35] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    {t.weeklySpecialsTag}
                  </span>
                  <span className="text-xs font-bold text-[#536259]">{t.weeklyUpdated}</span>
                </div>
                <h3 className={`text-2xl sm:text-4xl text-[#1D2921] mb-3 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>
                  {t.weeklyTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#536259] leading-relaxed max-w-2xl mb-4">
                  {t.weeklyDescription}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#1D2921]">
                  <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-[#214A38]"></i> {t.weeklyHighlight1}</span>
                  <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-[#214A38]"></i> {t.weeklyHighlight2}</span>
                  <span className="flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-[#214A38]"></i> {t.weeklyHighlight3}</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <a href="/store" className="btn-primary text-center justify-center py-3.5">
                  <span>{t.weeklyExploreBtn}</span>
                </a>
                <a 
                  href="https://wa.me/917708834547?text=Hello%20Rani%20Hyper%20Market!%20Please%20share%20this%20week's%20grocery%20offers." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-secondary text-center justify-center py-3"
                >
                  <i className="fa-brands fa-whatsapp text-sm"></i>
                  <span>{t.weeklyWhatsAppBtn}</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 7. TOP BRANDS */}
      <section id="brands" className="py-14 sm:py-20 border-b border-[#E5DCCF] bg-[#F7F1E6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E5DCCF]">
            <div>
              <span className="text-[#BD4A35] text-xs font-black uppercase tracking-wider block mb-1">
                {t.brandsTag}
              </span>
              <h2 className={`text-3xl sm:text-4xl text-[#1D2921] ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>
                {t.brandsTitle}
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#536259]">{t.brandsSubtitle}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-3.5">
            {[
              { name: 'Aashirvaad', sub: 'Atta & Flours', logo: '/images/brands/e16b4eb3-b6d3-4858-bfe6-dd6b5599e4a7-Aashirvaad.jpg' },
              { name: 'Aachi', sub: 'Spices & Masala', logo: '/images/brands/7c344540-6bc2-4226-91a6-18a3d9c799da-blob.webp' },
              { name: 'Amul', sub: 'Dairy Provisions', logo: '/images/brands/6bcfd86b-3830-4bfc-8619-986ee84581fc-blob.webp' },
              { name: 'Surf Excel', sub: 'Detergents', logo: '/images/brands/5b6fb9e9-f62f-4909-a58f-567d9fe586f5-Surfexcel.jpg' },
              { name: 'Colgate', sub: 'Oral Care', logo: '/images/brands/f52e9dee-0865-4847-8beb-853d7b6f8aac-Colgate.webp' },
              { name: 'Bru', sub: 'Filter Coffee', logo: '/images/brands/494d3b17-b09f-448b-b491-b0ee6e64407a-Bru.webp' },
              { name: 'Fortune', sub: 'Edible Oils', logo: '/images/brands/37cb9c9b-7724-4cbc-adbc-51ee91ba017e-blob-4.webp' },
              { name: 'Maggi', sub: 'Instant Noodles', logo: '/images/brands/b89abe51-5964-44ee-a576-40d16275ceaa-Maggie.jpg' },
              { name: 'Parle', sub: 'Biscuits', logo: '/images/brands/2286f3cb-335a-4fed-81d8-cf5d946f637b-blob.webp' },
              { name: 'Parachute', sub: 'Coconut Oil', logo: '/images/brands/c93b11b1-5b5c-47a4-a2cc-69f388a272e3-Parachute.jpg' },
              { name: 'Vim', sub: 'Dishwash Bar', logo: '/images/brands/86e6d9c5-48c4-46b9-aab7-f7c6a9bd91c2-Vim.jpg' },
              { name: 'Good Knight', sub: 'Repellents', logo: '/images/brands/621a9559-45cb-4539-ac6a-6bc7a749e4c1-Goodknight.webp' },
              { name: 'Brooke Bond', sub: '3 Roses Tea', logo: '/images/brands/ff6a598d-abe6-43a8-84ac-8b486833046c-brookbond-1.webp' },
              { name: 'GRB', sub: 'Pure Ghee', logo: '/images/brands/fedf2c52-297a-4012-a310-2297a790f1df-GRB.jpg' },
            ].map((brand) => (
              <a 
                key={brand.name} 
                href={`/store?search=${encodeURIComponent(brand.name.toLowerCase())}`} 
                className="brand-grid-item"
              >
                <div className="brand-logo-box">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    loading="lazy" 
                    onError={(e) => { e.currentTarget.src = 'https://nationalhypermart.com/wp-content/uploads/2026/02/e16b4eb3-b6d3-4858-bfe6-dd6b5599e4a7-Aashirvaad.jpg'; }} 
                  />
                </div>
                <span className="text-xs font-bold text-[#1D2921]">{brand.name}</span>
                <span className="text-[10px] text-[#536259]">{brand.sub}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LOCATION & HOURS */}
      <section id="location" className="py-14 sm:py-20 border-b border-[#E5DCCF] bg-[#FAF5ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-10">
            <span className="text-[#BD4A35] text-xs font-black uppercase tracking-wider block mb-1">
              {t.locationTag}
            </span>
            <h2 className={`text-3xl sm:text-4xl text-[#1D2921] mb-2 ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>
              {t.locationTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#536259]">{t.locationDescription}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="retail-card p-5">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#214A38] uppercase">
                  <i className="fa-solid fa-clock"></i>
                  <span>{t.hoursLabel}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E5DCCF] text-sm">
                  <span className="font-semibold text-[#1D2921]">{t.hoursDaily}</span>
                  <span className="font-bold text-[#214A38]">{t.hoursTime}</span>
                </div>
                <p className="text-xs text-[#536259] mt-2.5">{t.hoursNote}</p>
              </div>

              <div className="retail-card p-5">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#214A38] uppercase">
                  <i className="fa-solid fa-headset"></i>
                  <span>{t.contactLabel}</span>
                </div>
                <div className="space-y-2.5">
                  <a href="tel:+917708834547" className="flex items-center justify-between p-3 rounded-md bg-[#FAF5ED] border border-[#E5DCCF] hover:border-[#214A38] text-xs font-bold text-[#1D2921] transition no-underline">
                    <span>{t.contactCall}</span>
                    <span className="text-[#214A38]">→</span>
                  </a>
                  <a href="https://wa.me/917708834547?text=Hello%20Rani%20Hyper%20Market!%20I%20would%20like%20to%20order%20groceries." target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-md bg-[#FAF5ED] border border-[#E5DCCF] hover:border-[#214A38] text-xs font-bold text-[#1D2921] transition no-underline">
                    <span className="flex items-center gap-1.5"><i className="fa-brands fa-whatsapp text-green-600"></i> {t.contactWhatsApp}</span>
                    <span className="text-[#214A38]">→</span>
                  </a>
                  <a href="https://maps.app.goo.gl/V4CtDbvk66CXf6Xk8" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-md bg-[#FAF5ED] border border-[#E5DCCF] hover:border-[#214A38] text-xs font-bold text-[#1D2921] transition no-underline">
                    <span>{t.contactAddress}</span>
                    <span className="text-[#214A38]">→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="retail-card p-4">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-[#1D2921]">Rani Super Market Location</span>
                  <a href="https://maps.app.goo.gl/V4CtDbvk66CXf6Xk8" target="_blank" rel="noopener noreferrer" className="text-[#214A38] font-bold hover:underline">
                    {t.openMapsApp}
                  </a>
                </div>
                <div className="w-full h-72 sm:h-80 rounded-md overflow-hidden border border-[#E5DCCF] relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.064!2d77.34827!3d10.01527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b070d5a9b6fc447%3A0x20235eb3a4b2ba52!2sRani%20Super%20Market!5e0!3m2!1sen!2sin!4v1728142000000!5m2!1sen!2sin"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps Location for Rani Super Market, Bodinayakanur"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section id="faq" className="py-14 sm:py-20 border-b border-[#E5DCCF] bg-[#F7F1E6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <span className="text-[#BD4A35] text-xs font-black uppercase tracking-wider block mb-1">
              {t.faqTag}
            </span>
            <h2 className={`text-3xl sm:text-4xl text-[#1D2921] ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>
              {t.faqTitle}
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: t.faqQ1, a: t.faqA1 },
              { q: t.faqQ2, a: t.faqA2 },
              { q: t.faqQ3, a: t.faqA3 },
              { q: t.faqQ4, a: t.faqA4 },
              { q: t.faqQ5, a: t.faqA5 },
            ].map((item, idx) => (
              <div key={idx} className="faq-item">
                <button 
                  type="button" 
                  onClick={() => toggleFaq(idx)} 
                  className="faq-trigger"
                  aria-expanded={activeFaq === idx}
                >
                  <span className={isTamil ? 'font-tamil font-bold' : ''}>{item.q}</span>
                  <i 
                    className={`fa-solid fa-chevron-down text-xs text-[#536259] transition-transform duration-200 ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className={`faq-content ${isTamil ? 'font-tamil' : ''}`}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="bg-[#1D2921] text-gray-300 py-12 border-t border-[#18372A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#2A3B30]">
            
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <img 
                  src="/images/rani_logo.png" 
                  alt="Rani Hyper Market Official Logo" 
                  className="w-8 h-8 rounded-full object-cover border border-emerald-600/60 bg-white"
                />
                <span className={`text-xl text-white ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>Rani Hyper Market</span>
              </div>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed mb-4">
                {t.footerBio}
              </p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>📍 {t.footerAddress}</p>
                <p>📞 {t.footerHours}</p>
              </div>
            </div>

            <div>
              <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
                {t.footerNavTitle}
              </h5>
              <ul className="space-y-2 text-xs">
                <li><a href="/store" className="text-gray-400 hover:text-white transition">{t.footerCatalog}</a></li>
                <li><a href="#departments" className="text-gray-400 hover:text-white transition">{t.navDepartments}</a></li>
                <li><a href="#offers" className="text-gray-400 hover:text-white transition">{t.navOffers}</a></li>
                <li><a href="#brands" className="text-gray-400 hover:text-white transition">{t.navBrands}</a></li>
                <li><a href="https://maps.app.goo.gl/V4CtDbvk66CXf6Xk8" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">{t.footerMapsLink}</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
                {t.footerServiceTitle}
              </h5>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                {t.footerServiceText}
              </p>
              <a href="https://wa.me/917708834547" target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-xs py-2 w-full text-center inline-flex items-center justify-center gap-2">
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>{t.footerWhatsAppBtn}</span>
              </a>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>{t.footerCopyright}</p>
            <div className="flex items-center gap-4">
              <a href="/store" className="text-emerald-400 hover:text-emerald-300 transition">{t.footerStorefrontLink}</a>
              <span>•</span>
              <a href="https://maps.app.goo.gl/V4CtDbvk66CXf6Xk8" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition">{t.footerMapsLink}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 11. MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div 
          id="landing-mobile-menu" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            id="landing-mobile-drawer" 
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5DCCF]">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="/images/rani_logo.png" 
                    alt="Rani Hyper Market Official Logo" 
                    className="w-9 h-9 rounded-full object-cover border border-[#214A38]/30 bg-white"
                  />
                  <div>
                    <span className={`text-lg text-[#1D2921] block leading-tight ${isTamil ? 'font-tamil font-bold' : 'font-serif'}`}>
                      {t.mobDrawerTitle}
                    </span>
                    <span className="text-[10px] font-bold text-[#214A38] uppercase block">
                      {t.mobDrawerSubtitle}
                    </span>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded bg-white border border-[#E5DCCF] text-[#1D2921] flex items-center justify-center text-sm font-bold cursor-pointer"
                  aria-label="Close Navigation Menu"
                >
                  &times;
                </button>
              </div>

              {/* Language Toggle in Mobile Drawer */}
              <div className="py-4 border-b border-[#E5DCCF]">
                <LanguageToggle className="w-full justify-center" />
              </div>

              <nav className="mt-4 space-y-1 text-sm font-bold text-[#1D2921]">
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-[#FAF5ED] transition">{t.navAbout}</a>
                <a href="#departments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-[#FAF5ED] transition">{t.navDepartments}</a>
                <a href="#offers" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-[#FAF5ED] text-[#BD4A35] transition">{t.navOffers}</a>
                <a href="#brands" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-[#FAF5ED] transition">{t.navBrands}</a>
                <a href="#location" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-[#FAF5ED] transition">{t.navLocation}</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded hover:bg-[#FAF5ED] transition">{t.navFaq}</a>
              </nav>
            </div>

            <div className="pt-4 border-t border-[#E5DCCF] space-y-2">
              <a href="/store" className="btn-primary w-full py-2.5 text-xs text-center justify-center">
                <span>{t.mobExploreBtn}</span>
              </a>
              <a href="https://wa.me/917708834547" target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full py-2.5 text-xs text-center justify-center">
                <i className="fa-brands fa-whatsapp text-sm"></i>
                <span>{t.mobWhatsAppBtn}</span>
              </a>
              <a href="tel:+917708834547" className="w-full py-2 rounded border border-[#E5DCCF] bg-white text-xs font-bold text-[#1D2921] flex items-center justify-center gap-1.5 hover:bg-[#FAF5ED] transition">
                <i className="fa-solid fa-phone text-[#214A38]"></i>
                <span>{t.mobCallBtn}</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;
