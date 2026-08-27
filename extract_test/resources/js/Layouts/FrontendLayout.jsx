import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import { getUrl } from '../utils/urlHelper';
import { isEnabled } from '../utils/moduleHelper';

export default function FrontendLayout({ children }) {
    const { site, app_url, site_config = {}, footer_links = [], footer_logos = [] } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!document.getElementById('reference-layout-fonts')) {
            const link = document.createElement('link');
            link.id = 'reference-layout-fonts';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap';
            document.head.appendChild(link);
        }
    }, []);



    // Filter Navigation Links based on Module Toggles
    const navLinks = [
        { label: 'Home', href: '/', icon: 'fa-house', show: true },
        { label: 'Courses', href: '/all-course', show: true },
        { label: 'Student Result', href: '/result', show: isEnabled(site_config.toggle_result_verify) },
        { label: 'Success Students', href: '/success-student', show: isEnabled(site_config.toggle_success_students) },
        { label: 'Notices', href: '/all-notice-list', show: isEnabled(site_config.toggle_notice_board) },
        { label: 'Verified Center', href: '/verified-center', show: isEnabled(site_config.toggle_verified_centers) },
        { label: 'Center Apply', href: '/center-request/create', show: isEnabled(site_config.toggle_center_apply) },
        { label: 'Contact Us', href: '/contact-us', show: isEnabled(site_config.toggle_contact_form) },
    ].filter(link => link.show);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Theme Colors fallback
    const primaryColor = site_config.primary_color || '#7024A8';
    const secondaryColor = site_config.secondary_color || '#581C87';
    const accentColor = site_config.accent_color || '#F59E0B';

    return (
        <div className="min-h-screen flex flex-col bg-[#F1F5F9] font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 antialiased relative">
            {/* Detailed Technical Education Mural Background Watermark Overlay */}
            <div 
              className="fixed inset-0 z-0 pointer-events-none print:hidden print-hide-global"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 900' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cg id='perfect-gear'%3E%3Ccircle cx='0' cy='0' r='22' fill='none' stroke='%23cbd5e1' stroke-width='2.5'/%3E%3Ccircle cx='0' cy='0' r='10' fill='none' stroke='%23cbd5e1' stroke-width='2.5'/%3E%3Cpath d='M -4 -22 L -4 -28 L 4 -28 L 4 -22 L 12 -18 L 17 -23 L 23 -17 L 18 -12 L 22 -4 L 28 -4 L 28 4 L 22 4 L 18 12 L 23 17 L 17 23 L 12 18 L 4 22 L 4 28 L -4 28 L -4 22 L -12 18 L -17 23 L -23 17 L -18 12 L -22 4 L -28 4 L -28 -4 L -22 -4 L -18 -12 L -23 -17 L -17 -23 L -12 -18 Z' fill='none' stroke='%23cbd5e1' stroke-width='2.5' stroke-linejoin='round'/%3E%3C/g%3E%3C/defs%3E%3Cg stroke='%23cbd5e1' stroke-width='2.5' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3C!-- Top Left: Gears --%3E%3Cg transform='translate(120, 100)'%3E%3Cuse href='%23perfect-gear' /%3E%3Cuse href='%23perfect-gear' transform='translate(50, 45) scale(0.65)' stroke-width='3.8'/%3E%3C/g%3E%3C!-- Top Right: Microchip --%3E%3Cg transform='translate(450, 80)'%3E%3Crect x='-35' y='-35' width='70' height='70' rx='6' /%3E%3Crect x='-18' y='-18' width='36' height='36' rx='3' /%3E%3Cpath d='M -35 -15 H -45 M -35 0 H -45 M -35 15 H -45 M 35 -15 H 45 M 35 0 H 45 M 35 15 H 45 M -15 -35 V -45 M 0 -35 V -45 M 15 -35 V -45 M -15 35 V 45 M 0 35 V 45 M 15 35 V 45' /%3E%3Cpath d='M -45 0 H -80 V 50 H -140' /%3E%3Ccircle cx='-140' cy='50' r='4' fill='%23cbd5e1'/%3E%3Cpath d='M -45 15 H -60 V 90 H -120' /%3E%3Ccircle cx='-120' cy='90' r='4' fill='%23cbd5e1'/%3E%3Cpath d='M 0 45 V 80 H -40 V 120' /%3E%3Ccircle cx='-40' cy='120' r='4' fill='%23cbd5e1'/%3E%3C/g%3E%3C!-- Mid Left: Tools --%3E%3Cg transform='translate(150, 320)'%3E%3Cg transform='rotate(-45)'%3E%3Crect x='-6' y='10' width='12' height='40' rx='3' /%3E%3Cline x1='0' y1='-25' x2='0' y2='10' /%3E%3Cpath d='M -3 -25 L -5 -35 L 5 -35 L 3 -25 Z' /%3E%3C/g%3E%3Cg transform='rotate(45)'%3E%3Crect x='-5' y='-30' width='10' height='65' rx='3' /%3E%3Cpath d='M -15 -30 C -15 -45, 15 -45, 15 -30 C 15 -25, 7 -22, 7 -22 L -7 -22 C -7 -22, -15 -25, -15 -30 Z' /%3E%3Cpath d='M -15 35 C -15 50, 15 50, 15 35 C 15 30, 7 27, 7 27 L -7 27 C -7 27, -15 30, -15 35 Z' /%3E%3C/g%3E%3C/g%3E%3C!-- Mid Right: Atom --%3E%3Cg transform='translate(450, 320)'%3E%3Ccircle cx='0' cy='0' r='8' fill='%23cbd5e1' /%3E%3Cellipse cx='0' cy='0' rx='40' ry='14' transform='rotate(0)' /%3E%3Cellipse cx='0' cy='0' rx='40' ry='14' transform='rotate(60)' /%3E%3Cellipse cx='0' cy='0' rx='40' ry='14' transform='rotate(120)' /%3E%3Ccircle cx='0' cy='-40' r='4' fill='%23cbd5e1' /%3E%3Ccircle cx='-35' cy='20' r='4' fill='%23cbd5e1' /%3E%3Ccircle cx='35' cy='20' r='4' fill='%23cbd5e1' /%3E%3C/g%3E%3C!-- Center: Circuit Tree --%3E%3Cg transform='translate(300, 500)'%3E%3Cpath d='M 0 60 V -20' /%3E%3Ccircle cx='0' cy='-20' r='4' fill='%23cbd5e1' /%3E%3Cpath d='M -15 60 V 40 H -30 V 10 H -40 V -10' /%3E%3Ccircle cx='-40' cy='-10' r='4' fill='%23cbd5e1' /%3E%3Cpath d='M 15 60 V 40 H 30 V 10 H 40 V -10' /%3E%3Ccircle cx='40' cy='-10' r='4' fill='%23cbd5e1' /%3E%3Cpath d='M -30 10 V -30' /%3E%3Ccircle cx='-30' cy='-30' r='4' fill='%23cbd5e1' /%3E%3Cpath d='M 30 10 V -30' /%3E%3Ccircle cx='30' cy='-30' r='4' fill='%23cbd5e1' /%3E%3Cpath d='M -15 40 V 0' /%3E%3Ccircle cx='-15' cy='0' r='4' fill='%23cbd5e1' /%3E%3Cpath d='M 15 40 V 0' /%3E%3Ccircle cx='15' cy='0' r='4' fill='%23cbd5e1' /%3E%3Cline x1='-30' y1='60' x2='30' y2='60' /%3E%3C/g%3E%3C!-- Bottom Left: Handshake Gear --%3E%3Cg transform='translate(150, 800)'%3E%3Cpath d='M -40 20 C -45 5, -45 -10, -40 -25 L -45 -35 L -35 -40 L -25 -30 C -15 -35, -5 -38, 5 -38 L 10 -48 L 22 -45 L 18 -35 C 30 -30, 40 -20, 45 -5 L 55 0 L 52 10 L 42 8 C 42 12, 40 18, 38 22' /%3E%3Cpath d='M -30 10 L -5 -10 L 15 -10 L 30 5' /%3E%3Cpath d='M -15 20 L -5 -5 L 15 15' /%3E%3Cpath d='M 0 -10 V 5 M 10 -10 V 5' /%3E%3C/g%3E%3C!-- Bottom Right: Robotic Arm --%3E%3Cg transform='translate(450, 750)'%3E%3Cline x1='-50' y1='0' x2='50' y2='0' /%3E%3Cpath d='M -30 0 V -20 C -30 -35, -20 -45, 0 -45 C 20 -45, 30 -35, 30 -20 V 0 Z' /%3E%3Ccircle cx='0' cy='-45' r='12' /%3E%3Ccircle cx='0' cy='-45' r='4' /%3E%3Cpath d='M -8 -54 L -38 -105 M 8 -41 L -22 -92' /%3E%3Ccircle cx='-35' cy='-100' r='10' /%3E%3Ccircle cx='-35' cy='-100' r='3' /%3E%3Cpath d='M -38 -110 L -65 -135 M -28 -105 L -55 -130' /%3E%3Crect x='-70' y='-140' width='14' height='14' transform='rotate(-40 -63 -133)' /%3E%3Cpath d='M -72 -145 C -82 -155, -92 -150, -90 -140 M -62 -135 C -52 -125, -45 -135, -55 -145' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '500px 750px',
                backgroundRepeat: 'repeat',
                opacity: 0.35
              }}
            ></div>

            {/* Opaque White Main Container Box (max-w-7xl) with 3D Shadow & Border */}
            <div className="max-w-7xl w-full mx-auto bg-white shadow-2xl border-x border-slate-200/80 min-h-screen flex flex-col relative z-10">
                {/* Level 1: Top Bar (Deep Slate / Dark Purple) */}
                <div className="w-full bg-[#0B1528] text-slate-300 py-1.5 sm:py-2 border-b border-slate-800 print:hidden print-hide-global">
                    <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[10px] sm:text-[11px] font-medium">
                        <span className="text-slate-300 font-bold truncate">
                            {site_config.site_name ? `${site_config.site_name} Official Portal` : 'Bangladesh Technical Education Portal'}
                        </span>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <div className="flex gap-2 text-[10px] sm:text-xs font-bold items-center">
                                <Link href={getUrl('/lang-change')} className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded shadow-sm hover:bg-amber-300">EN</Link>
                                <Link href={getUrl('/lang-change')} className="hover:text-amber-300 px-1 py-0.5 transition-colors">BN</Link>
                                <Link href={getUrl('/lang-change')} className="hover:text-amber-300 px-1 py-0.5 transition-colors">AR</Link>
                            </div>
                            {(site_config.rjsc_id || site_config.site_rjsc) && (
                                <span className="text-slate-400 font-mono text-[9px] sm:text-[11px]">{site_config.rjsc_id || site_config.site_rjsc}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Level 2: Main Branding Header */}
                <div className="w-full text-white py-4 sm:py-5 border-b print:hidden print-hide-global transition-colors" style={{ backgroundColor: primaryColor, borderColor: `${primaryColor}CC` }}>
                    <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <Link href={getUrl('/')} className="flex items-center gap-3 sm:gap-4 group">
                            <img
                                src={getUrl(site_config.header_logo || site_config.site_header_logo || site_config.main_logo || site_config.site_logo || '/images/1711405466.jpg')}
                                alt="Institute Seal"
                                className="h-10 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform shrink-0"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getUrl('/images/avatar.png');
                                }}
                            />
                            <div>
                                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-amber-300 leading-none">TECHNICAL EDUCATION</p>
                                <h1 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight sm:leading-none text-white mt-1">
                                    {site_config.portal_name || site_config.site_name || 'Young Technical Training Centre'}
                                </h1>
                                <p className="text-[11px] sm:text-xs text-purple-200 font-semibold mt-1">
                                    {site_config.tagline || site_config.site_tagline || 'Quality skill education across Bangladesh'}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Level 3: Sticky Navbar */}
                <header className="w-full text-white sticky top-0 z-40 shadow-md border-b print:hidden print-hide-global transition-colors" style={{ backgroundColor: secondaryColor, borderColor: `${secondaryColor}EE` }}>
                    <div className="w-full px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
                        {/* Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const fullHref = getUrl(link.href);
                                const isActive = currentPath === fullHref || (link.href !== '/' && currentPath.endsWith(link.href));
                                return (
                                    <Link
                                        key={link.label}
                                        href={fullHref}
                                        className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all flex items-center gap-1.5 ${
                                            isActive
                                                ? 'bg-white/20 text-white font-black'
                                                : 'text-purple-100 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        {link.icon && <i className={`fa-solid ${link.icon} text-[11px]`}></i>}
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right Button: CENTER LOGIN (Yellow Pill Button) */}
                        <div className="hidden lg:flex items-center">
                            <Link
                                href={getUrl('/login')}
                                className="text-slate-950 font-black px-5 py-2 rounded-md text-xs shadow-md transition hover:scale-105 tracking-wider uppercase flex items-center justify-center"
                                style={{ backgroundColor: accentColor }}
                            >
                                CENTER LOGIN
                            </Link>
                        </div>

                        {/* Mobile Header Menu */}
                        <div className="flex items-center justify-between w-full lg:hidden py-1">
                            {isEnabled(site_config.toggle_result_verify) ? (
                                <Link
                                    href={getUrl('/result')}
                                    className="text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1.5 uppercase tracking-wider"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <i className="fa-solid fa-graduation-cap text-[11px]"></i>
                                    <span>Student Result</span>
                                </Link>
                            ) : (
                                <Link
                                    href={getUrl('/all-course')}
                                    className="text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1.5 uppercase tracking-wider"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    <i className="fa-solid fa-book-open text-[11px]"></i>
                                    <span>Courses</span>
                                </Link>
                            )}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
                                aria-label="Toggle Navigation Menu"
                            >
                                <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Drawer Menu */}
                    {mobileMenuOpen && (
                        <>
                            <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
                            <div className="fixed top-0 left-0 w-3/4 max-w-sm h-screen bg-white z-50 overflow-y-auto shadow-2xl transition-transform lg:hidden flex flex-col" style={{ backgroundColor: secondaryColor, borderColor: `${primaryColor}` }}>
                                <div className="px-4 py-4 border-b border-white/20 flex justify-between items-center">
                                    <span className="text-white font-extrabold uppercase tracking-wider text-xs">MENU</span>
                                    <button onClick={() => setMobileMenuOpen(false)} className="text-white hover:text-amber-300 p-1">
                                        <i className="fa-solid fa-xmark text-lg"></i>
                                    </button>
                                </div>
                                <div className="px-4 py-4 space-y-2 flex-1">
                            <nav className="space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.label}
                                        href={getUrl(link.href)}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-2.5 rounded text-sm font-bold text-white hover:bg-white/10 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="pt-4 mt-2 border-t border-white/20">
                                <Link
                                    href={getUrl('/login')}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-center py-2.5 bg-amber-400 text-slate-950 font-black rounded text-sm uppercase shadow-sm"
                                >
                                    CENTER LOGIN
                                </Link>
                                </div>
                            </div>
                            </div>
                        </>
                    )}
                </header>

                {/* Main Page Render */}
                <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 bg-white relative z-10 print:p-0 print:m-0 print:space-y-0">
                    {children}
                </main>

                {/* Footer (BTEB / NPI Style) */}
                <footer 
                    className="print:hidden print-hide-global w-full text-[13px] text-gray-700 font-['Noto_Sans_Bengali',sans-serif] mt-8 bg-[#e9e9e9] border-t border-gray-300 relative"
                >
                    {/* Shaheed Minar Scenery Image Strip */}
                    <div 
                        style={{
                            backgroundImage: (site_config.footer_top_bg_image && !site_config.footer_top_bg_image.includes('no-image')) ? `url(${getUrl(site_config.footer_top_bg_image)})` : `url(${getUrl('/images/footer_top_bg.png')})`,
                            backgroundPosition: 'center bottom',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            height: '180px',
                            width: '100%'
                        }}
                        className="max-h-[180px] overflow-hidden"
                    ></div>
                    
                    <div className="w-full pt-4 pb-8 relative z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            
                            {/* Disclaimer */}
                            <div className="text-center text-gray-800 font-semibold mb-6 bg-white/70 backdrop-blur-sm p-3 rounded shadow-sm text-sm italic border border-white/50">
                                {site_config.footer_disclaimer_text || 'এই ওয়েবসাইটে প্রকাশিত সকল তথ্য সংশ্লিষ্ট দপ্তর কর্তৃক নিয়মিত হালনাগাদ করা হয়। তথ্যের যথার্থতা, নির্ভুলতা ও নির্ভরযোগ্যতা নিশ্চিত করতে সংশ্লিষ্ট দপ্তর সর্বদা সচেষ্ট।'}
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                {/* Left Side Links */}
                                <div className="flex-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4 font-medium">
                                        {[1, 2, 3].map((col) => {
                                            const colLinks = footer_links.filter(l => l.sort_order === col);
                                            if (colLinks.length === 0) return null;
                                            return (
                                                <ul key={`col-${col}`} className="space-y-1">
                                                    {colLinks.map((link) => (
                                                        <li key={link.id}>
                                                            <Link href={link.url} className="text-[#1568b2] hover:text-[#1b81dd] transition hover:underline">
                                                                {link.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            );
                                        })}
                                        {/* Fallback to default nav links if no dynamic footer links exist */}
                                        {footer_links.length === 0 && (
                                            <ul className="flex flex-wrap gap-x-6 gap-y-2">
                                                {navLinks.map((link, index) => (
                                                    <li key={index} className="border-r border-gray-400 pr-6 last:border-0 last:pr-0">
                                                        <Link href={getUrl(link.href)} className="text-[#1568b2] hover:text-[#1b81dd] transition hover:underline">
                                                            {link.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="text-gray-600 text-xs font-semibold relative z-20">
                                        <p>সাইটটি শেষ হাল-নাগাদ করা হয়েছে: {new Date(site_config.updated_at || Date.now()).toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div className="text-gray-500 text-xs mt-1 font-sans relative z-20">
                                        {site_config.footer_copyright || `© ${new Date().getFullYear()} ${site_config.portal_name || site_config.site_name || 'YTTC'}. All rights reserved.`}
                                    </div>
                                </div>

                                {/* Right Side - Planning & Implementation */}
                                <div className="md:w-[350px] flex-shrink-0 md:text-right relative">
                                    {/* Partner Logos */}
                                    {footer_logos.length > 0 && (
                                        <div className="flex flex-wrap md:justify-end gap-3 mb-4">
                                            {footer_logos.map(logo => (
                                                <div key={logo.id} className="bg-white p-1 rounded border shadow-sm">
                                                    {logo.url ? (
                                                        <a href={logo.url} target="_blank" rel="noopener noreferrer">
                                                            <img src={getUrl(logo.image_path)} alt={logo.name} className="h-10 object-contain" />
                                                        </a>
                                                    ) : (
                                                        <img src={getUrl(logo.image_path)} alt={logo.name} className="h-10 object-contain" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="bg-white/60 p-3 rounded backdrop-blur-sm shadow-sm inline-block w-full md:w-auto text-left md:text-right border border-white/50 relative z-20">
                                        <p className="text-gray-800 font-semibold text-[13px] mb-1 leading-relaxed">
                                            পরিকল্পনা এবং বাস্তবায়ন: {site_config.footer_planning_text || 'BDNSI Team'}
                                        </p>
                                        <div className="flex md:items-center md:justify-end items-start justify-start gap-2 mt-2">
                                            <p className="text-gray-600 text-xs font-semibold">কারিগরি সহায়তা: {site_config.footer_tech_support_text || 'BDNSI IT Team'}</p>
                                        </div>
                                    </div>
                                    
                                    {(site_config.footer_side_bg_image && !site_config.footer_side_bg_image.includes('no-image')) && (
                                        <img src={getUrl(site_config.footer_side_bg_image)} alt="Footer Decoration" className="absolute z-0 opacity-20 -right-10 -bottom-10 h-32 object-contain pointer-events-none" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

                {/* Floating WhatsApp Chat Widget (if enabled) */}
                {isEnabled(site_config.toggle_whatsapp) && site_config.site_phone && (
                    <a
                        href={`https://api.whatsapp.com/send?phone=${site_config.site_phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center text-2xl"
                        title="Chat with us on WhatsApp"
                    >
                        <i className="fa-brands fa-whatsapp"></i>
                    </a>
                )}
            </div>
        </div>
    );
}
