import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Create({ settings = {} }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('branding');
    const [previews, setPreviews] = useState({
        main_logo: settings?.main_logo ? getUrl(settings.main_logo) : null,
        favicon: settings?.favicon ? getUrl(settings.favicon) : null,
        header_logo: settings?.header_logo ? getUrl(settings.header_logo) : null,
        footer_top_bg_image: settings?.footer_top_bg_image ? getUrl(settings.footer_top_bg_image) : null,
        footer_side_bg_image: settings?.footer_side_bg_image ? getUrl(settings.footer_side_bg_image) : null,
    });

    const { data, setData, post, processing, errors } = useForm({
        // Branding
        portal_name: settings?.portal_name ?? '',
        tagline: settings?.tagline ?? '',
        rjsc_id: settings?.rjsc_id ?? '',
        main_logo: null,
        favicon: null,
        header_logo: null,

        // Contact & Social
        hotline_phone: settings?.hotline_phone ?? '',
        official_email: settings?.official_email ?? '',
        headquarter_address: settings?.headquarter_address ?? '',
        twitter_url: settings?.twitter_url ?? '',
        facebook_url: settings?.facebook_url ?? '',
        youtube_url: settings?.youtube_url ?? '',
        linkedin_url: settings?.linkedin_url ?? '',

        // Content
        marquee_notice: settings?.marquee_notice ?? '',
        about_short: settings?.about_short ?? '',
        about_full: settings?.about_full ?? '',
        terms_conditions: settings?.terms_conditions ?? '',
        privacy_policy: settings?.privacy_policy ?? '',
        footer_copyright: settings?.footer_copyright ?? '',
        
        // Footer Details
        footer_top_bg_image: null,
        footer_side_bg_image: null,
        footer_disclaimer_text: settings?.footer_disclaimer_text ?? '',
        footer_planning_text: settings?.footer_planning_text ?? '',
        footer_tech_support_text: settings?.footer_tech_support_text ?? '',

        // Feature Toggles (stored as boolean/tinyint '1' or '0')
        toggle_center_apply: settings?.toggle_center_apply ?? 1,
        toggle_result_verify: settings?.toggle_result_verify ?? 1,
        toggle_success_students: settings?.toggle_success_students ?? 1,
        toggle_video_gallery: settings?.toggle_video_gallery ?? 1,
        toggle_photo_gallery: settings?.toggle_photo_gallery ?? 1,
        toggle_verified_centers: settings?.toggle_verified_centers ?? 1,
        toggle_sponsors: settings?.toggle_sponsors ?? 1,
        toggle_notice_board: settings?.toggle_notice_board ?? 1,
        toggle_contact_form: settings?.toggle_contact_form ?? 1,
        toggle_whatsapp: settings?.toggle_whatsapp ?? 1,
        toggle_student_portal: settings?.toggle_student_portal ?? 1,
        toggle_maintenance_mode: settings?.toggle_maintenance_mode ?? 0,
        toggle_promo_popup: settings?.toggle_promo_popup ?? 0,

        // Theme
        primary_color: settings?.primary_color ?? '#7024A8',
        secondary_color: settings?.secondary_color ?? '#581C87',
        accent_color: settings?.accent_color ?? '#F59E0B',
    });

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
        }
    };

    const handleToggle = (field) => {
        setData(field, data[field] ? 0 : 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/configDictionary', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const tabs = [
        { id: 'branding', label: 'Branding & Identifiers', icon: 'fa-palette' },
        { id: 'social', label: 'Contact & Social Links', icon: 'fa-share-nodes' },
        { id: 'content', label: 'Portal Content & Notices', icon: 'fa-file-lines' },
        { id: 'modules', label: 'Feature Switches (Toggles)', icon: 'fa-toggle-on' },
        { id: 'theme', label: 'Theme & Colors', icon: 'fa-eye-dropper' },
        { id: 'footer', label: 'Footer Settings', icon: 'fa-shoe-prints' },
        { id: 'cmshub', label: 'Frontend CMS Hub', icon: 'fa-database' },
    ];

    return (
        <AdminLayout title="🎛️ Site Control Center">
            <div className="space-y-6 max-w-7xl mx-auto pb-12">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-[#7024A8] to-[#581C87] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-purple-500/30">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
                                <i className="fa-solid fa-sliders text-amber-300"></i>
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Central Site Control Center</h1>
                        </div>
                        <p className="text-sm text-purple-100 max-w-2xl font-light">
                            Manage your entire web portal dynamically without touching code. Configure logos, SEO titles, contact info, theme colors, and toggle public frontend modules in real-time.
                        </p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all flex items-center gap-2 transform active:scale-95 disabled:opacity-50 shrink-0"
                    >
                        {processing ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <span>Saving Changes...</span>
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                <span>Publish Configuration</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-200 no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition-all whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-[#7024A8] text-white shadow-md shadow-purple-600/20 scale-[1.02]'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                            }`}
                        >
                            <i className={`fa-solid ${tab.icon} ${activeTab === tab.id ? 'text-amber-300' : 'text-slate-400'}`}></i>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8 min-h-[500px]">
                    
                    {/* TAB 1: BRANDING */}
                    {activeTab === 'branding' && (
                        <div className="space-y-8 animate-fadeIn">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-lg font-extrabold text-slate-800">Institute Identity & SEO Branding</h3>
                                <p className="text-xs text-slate-500">Configure global portal names, slogans, and official visual logos.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Portal Name / Title</label>
                                    <input
                                        type="text"
                                        value={data.portal_name}
                                        onChange={e => setData('portal_name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                        placeholder="BDNSI"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tagline / Slogan</label>
                                    <input
                                        type="text"
                                        value={data.tagline}
                                        onChange={e => setData('tagline', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                        placeholder="Quality Skill Education Across Bangladesh"
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Govt / RJSC Registration Identifier</label>
                                    <input
                                        type="text"
                                        value={data.rjsc_id}
                                        onChange={e => setData('rjsc_id', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                        placeholder="e.g. Reg No: C-18293 / Govt Affiliation ID"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                                {/* Header Logo Upload */}
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col items-center text-center space-y-3">
                                    <span className="text-xs font-bold text-slate-700 uppercase">Top Header Logo</span>
                                    <div className="w-32 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-inner overflow-hidden">
                                        {previews.header_logo ? (
                                            <img src={previews.header_logo} alt="Header Logo" className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No Image</span>
                                        )}
                                    </div>
                                    <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 hover:border-purple-500 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:text-purple-700 transition">
                                        <span>Change Header Logo</span>
                                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={e => handleFileChange(e, 'header_logo')} />
                                    </label>
                                    <p className="text-[10px] text-slate-500 mt-1">Allowed: PNG, JPEG, WEBP. Max size: 2MB</p>
                                </div>

                                {/* Main Logo Upload */}
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col items-center text-center space-y-3">
                                    <span className="text-xs font-bold text-slate-700 uppercase">Main Brand Logo</span>
                                    <div className="w-32 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-inner overflow-hidden">
                                        {previews.main_logo ? (
                                            <img src={previews.main_logo} alt="Main Logo" className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No Image</span>
                                        )}
                                    </div>
                                    <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 hover:border-purple-500 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:text-purple-700 transition">
                                        <span>Change Main Logo</span>
                                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={e => handleFileChange(e, 'main_logo')} />
                                    </label>
                                    <p className="text-[10px] text-slate-500 mt-1">Allowed: PNG, JPEG, WEBP. Max size: 2MB</p>
                                </div>

                                {/* Favicon Upload */}
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col items-center text-center space-y-3">
                                    <span className="text-xs font-bold text-slate-700 uppercase">Browser Favicon</span>
                                    <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-inner overflow-hidden">
                                        {previews.favicon ? (
                                            <img src={previews.favicon} alt="Favicon" className="w-10 h-10 object-contain" />
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No Icon</span>
                                        )}
                                    </div>
                                    <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 hover:border-purple-500 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:text-purple-700 transition">
                                        <span>Change Favicon</span>
                                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/ico, image/webp" onChange={e => handleFileChange(e, 'favicon')} />
                                    </label>
                                    <p className="text-[10px] text-slate-500 mt-1">Allowed: PNG, JPEG, ICO. Max size: 1MB</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: CONTACT & SOCIAL */}
                    {activeTab === 'social' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-lg font-extrabold text-slate-800">Contact Details & Social Media Presence</h3>
                                <p className="text-xs text-slate-500">Manage official contact information and social profiles displayed in headers and footers.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Official Hotline Phone</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400"><i className="fa-solid fa-phone"></i></span>
                                        <input
                                            type="text"
                                            value={data.hotline_phone}
                                            onChange={e => setData('hotline_phone', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                            placeholder="09649700002"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Official Email Address</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400"><i className="fa-solid fa-envelope"></i></span>
                                        <input
                                            type="email"
                                            value={data.official_email}
                                            onChange={e => setData('official_email', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                            placeholder="info@bdnsi.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Headquarter Address</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-400"><i className="fa-solid fa-location-dot"></i></span>
                                        <input
                                            type="text"
                                            value={data.headquarter_address}
                                            onChange={e => setData('headquarter_address', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                            placeholder="Dhaka, Bangladesh"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Facebook Page URL</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-blue-600"><i className="fa-brands fa-facebook"></i></span>
                                        <input
                                            type="url"
                                            value={data.facebook_url}
                                            onChange={e => setData('facebook_url', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                            placeholder="https://facebook.com/bdnsi"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">YouTube Channel URL</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-red-600"><i className="fa-brands fa-youtube"></i></span>
                                        <input
                                            type="url"
                                            value={data.youtube_url}
                                            onChange={e => setData('youtube_url', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                            placeholder="https://youtube.com/@bdnsi"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Twitter / X URL</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-800"><i className="fa-brands fa-x-twitter"></i></span>
                                        <input
                                            type="url"
                                            value={data.twitter_url}
                                            onChange={e => setData('twitter_url', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                            placeholder="https://twitter.com/bdnsi"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">LinkedIn Page URL</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-blue-700"><i className="fa-brands fa-linkedin"></i></span>
                                        <input
                                            type="url"
                                            value={data.linkedin_url}
                                            onChange={e => setData('linkedin_url', e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                            placeholder="https://linkedin.com/company/bdnsi"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: CONTENT & NOTICES */}
                    {activeTab === 'content' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-lg font-extrabold text-slate-800">Dynamic Portal Content & Marquee Notices</h3>
                                <p className="text-xs text-slate-500">Edit announcements and static information texts shown across the website.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    <span className="flex items-center gap-1.5"><i className="fa-solid fa-bullhorn text-amber-500"></i> Global Marquee Top Notice</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.marquee_notice}
                                    onChange={e => setData('marquee_notice', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                    placeholder="Enter urgent notification text scrolling at top..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Homepage About Us Summary (Short)</label>
                                    <textarea
                                        rows="4"
                                        value={data.about_short}
                                        onChange={e => setData('about_short', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                        placeholder="Short summary displayed on homepage..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full About Us Description</label>
                                    <textarea
                                        rows="4"
                                        value={data.about_full}
                                        onChange={e => setData('about_full', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                        placeholder="Detailed about us description..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Terms & Conditions</label>
                                    <textarea
                                        rows="3"
                                        value={data.terms_conditions}
                                        onChange={e => setData('terms_conditions', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Privacy Policy</label>
                                    <textarea
                                        rows="3"
                                        value={data.privacy_policy}
                                        onChange={e => setData('privacy_policy', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Footer Copyright Notice</label>
                                <input
                                    type="text"
                                    value={data.footer_copyright}
                                    onChange={e => setData('footer_copyright', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB 4: MODULE TOGGLES */}
                    {activeTab === 'modules' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="border-b border-slate-100 pb-4 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-extrabold text-slate-800">Public Frontend Module Toggles</h3>
                                    <p className="text-xs text-slate-500">Instantaneous ON/OFF control over public homepage sections and navigation buttons.</p>
                                </div>
                                <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                                    <i className="fa-solid fa-bolt text-amber-500"></i> Real-time Sync
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'toggle_center_apply', title: 'Center Apply Module', desc: 'Allows new branch/center registrations from public frontend.' },
                                    { id: 'toggle_result_verify', title: 'Student Result Verification', desc: 'Public certificate search and verification tool.' },
                                    { id: 'toggle_success_students', title: 'Success Students Carousel', desc: 'Displays approved success student stories on homepage.' },
                                    { id: 'toggle_video_gallery', title: 'Video Gallery Section', desc: 'YouTube video grid and tutorials section on homepage.' },
                                    { id: 'toggle_photo_gallery', title: 'Photo Gallery / Sliders', desc: 'Institute photo showcase and banner sliders.' },
                                    { id: 'toggle_verified_centers', title: 'Verified Centers Grid', desc: 'Shows affiliated approved training centers on homepage.' },
                                    { id: 'toggle_sponsors', title: 'Sponsors & Affiliations', desc: 'Logo grid of government and industry partners.' },
                                    { id: 'toggle_notice_board', title: 'Notice Board Ticker', desc: 'Latest urgent circulars and PDF notice board.' },
                                    { id: 'toggle_contact_form', title: 'Contact Us Form', desc: 'Public inquiry form section on homepage.' },
                                    { id: 'toggle_whatsapp', title: 'Floating WhatsApp Widget', desc: 'Live chat support floating button on bottom right.' },
                                    { id: 'toggle_student_portal', title: '🎓 Student Portal Access', desc: 'Global Kill-Switch to enable or disable student login & dashboard.' },
                                    { id: 'toggle_maintenance_mode', title: 'Maintenance Mode', desc: 'Temporarily lock the frontend for upgrades (Future Feature).' },
                                    { id: 'toggle_promo_popup', title: 'Promo Popup Banner', desc: 'Show a promotional popup on load (Future Feature).' },
                                ].map((mod) => {
                                    const isEnabled = data[mod.id] == 1 || data[mod.id] === true;
                                    return (
                                        <div
                                            key={mod.id}
                                            onClick={() => handleToggle(mod.id)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
                                                isEnabled
                                                    ? 'bg-purple-50/60 border-purple-300 shadow-sm'
                                                    : 'bg-slate-50 border-slate-200 opacity-75 hover:opacity-100'
                                            }`}
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                                                    <h4 className={`text-sm font-bold ${isEnabled ? 'text-purple-950' : 'text-slate-600'}`}>{mod.title}</h4>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 pl-4 font-light">{mod.desc}</p>
                                            </div>
                                            <div
                                                className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center shrink-0 ${
                                                    isEnabled ? 'bg-[#7024A8]' : 'bg-slate-300'
                                                }`}
                                            >
                                                <div
                                                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform flex items-center justify-center text-[10px] ${
                                                        isEnabled ? 'translate-x-6 text-purple-700 font-black' : 'translate-x-0 text-slate-400'
                                                    }`}
                                                >
                                                    <i className={`fa-solid ${isEnabled ? 'fa-check' : 'fa-xmark'}`}></i>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* TAB 5: THEME & COLORS */}
                    {activeTab === 'theme' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-lg font-extrabold text-slate-800">Visual Theme & Brand Color Palette</h3>
                                <p className="text-xs text-slate-500">Customize main portal accent colors and header styling dynamically.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { id: 'primary_color', label: 'Primary Brand Color', desc: 'Used for navbar, primary buttons, and hero headers.' },
                                    { id: 'secondary_color', label: 'Secondary Brand Color', desc: 'Used for gradients, card borders, and hover states.' },
                                    { id: 'accent_color', label: 'Accent / Highlight Color', desc: 'Used for badges, stars, and important notices.' },
                                ].map((col) => (
                                    <div key={col.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">{col.label}</label>
                                        <p className="text-xs text-slate-500 font-light h-8">{col.desc}</p>
                                        <div className="flex items-center gap-3 pt-2">
                                            <input
                                                type="color"
                                                value={data[col.id] || '#000000'}
                                                onChange={e => setData(col.id, e.target.value)}
                                                className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                                            />
                                            <input
                                                type="text"
                                                value={data[col.id]}
                                                onChange={e => setData(col.id, e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm uppercase tracking-wider font-bold focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Theme Preview Card */}
                            <div className="mt-8 p-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2 block">Live Color Preview</span>
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10" style={{ borderColor: data.accent_color }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg" style={{ backgroundColor: data.primary_color }}>
                                            {data.portal_name ? data.portal_name.substring(0, 2).toUpperCase() : 'BD'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">{data.portal_name || 'Institute Portal'}</h4>
                                            <p className="text-xs text-slate-300 font-light">Custom Theme Styling Active</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition transform active:scale-95"
                                        style={{ backgroundColor: data.accent_color, color: '#000' }}
                                    >
                                        Sample Action Button
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 5.5: FOOTER SETTINGS */}
                    {activeTab === 'footer' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-lg font-extrabold text-slate-800">BTEB Style Footer Settings</h3>
                                <p className="text-xs text-slate-500">Configure background images and text details for the BTEB styled footer.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Footer Top Background Upload */}
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col items-center text-center space-y-3">
                                    <span className="text-xs font-bold text-slate-700 uppercase">Footer Top Background Image</span>
                                    <div className="w-full h-24 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-inner overflow-hidden relative">
                                        {previews.footer_top_bg_image ? (
                                            <img src={previews.footer_top_bg_image} alt="Footer Top Bg" className="max-w-full max-h-full object-cover rounded-md" />
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No Image</span>
                                        )}
                                    </div>
                                    <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 hover:border-purple-500 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:text-purple-700 transition">
                                        <span>Change Top Bg</span>
                                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={e => handleFileChange(e, 'footer_top_bg_image')} />
                                    </label>
                                </div>

                                {/* Footer Side Background Upload */}
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col items-center text-center space-y-3">
                                    <span className="text-xs font-bold text-slate-700 uppercase">Footer Side Background Image</span>
                                    <div className="w-full h-24 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-inner overflow-hidden relative">
                                        {previews.footer_side_bg_image ? (
                                            <img src={previews.footer_side_bg_image} alt="Footer Side Bg" className="max-w-full max-h-full object-cover rounded-md" />
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No Image</span>
                                        )}
                                    </div>
                                    <label className="cursor-pointer px-4 py-2 bg-white border border-slate-300 hover:border-purple-500 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:text-purple-700 transition">
                                        <span>Change Side Bg</span>
                                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={e => handleFileChange(e, 'footer_side_bg_image')} />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Disclaimer Text</label>
                                    <textarea
                                        rows="3"
                                        value={data.footer_disclaimer_text}
                                        onChange={e => setData('footer_disclaimer_text', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                        placeholder="Site is maintained by..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Planning & Implementation By</label>
                                    <input
                                        type="text"
                                        value={data.footer_planning_text}
                                        onChange={e => setData('footer_planning_text', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                        placeholder="Cabinet Division, a2i, BCC..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Technical Support By</label>
                                    <input
                                        type="text"
                                        value={data.footer_tech_support_text}
                                        onChange={e => setData('footer_tech_support_text', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-[#7024A8] focus:outline-none"
                                        placeholder="Your Company Name"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 6: FRONTEND CMS HUB (DATA MANAGEMENT) */}
                    {activeTab === 'cmshub' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-lg font-extrabold text-slate-800">Advanced Frontend CMS Hub</h3>
                                <p className="text-xs text-slate-500">Manage dynamic data entries for homepage sections including sliders, centers, and media galleries.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {/* CMS Card: Sliders & Photo Gallery */}
                                <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition"></div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl shadow-sm">
                                            <i className="fa-solid fa-images"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 group-hover:text-blue-700 transition">Sliders & Photo Gallery</h4>
                                            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Manage hero banners, dynamic photo gallery, and event highlights shown on the homepage.</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-100 relative z-10">
                                        <a href={getUrl('/admin/slider')} className="block w-full py-2.5 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-700 text-xs font-bold rounded-xl text-center transition-colors shadow-sm">
                                            Manage Sliders &rsaquo;
                                        </a>
                                    </div>
                                </div>

                                {/* CMS Card: Certified Centers */}
                                <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition"></div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-sm">
                                            <i className="fa-solid fa-building-circle-check"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 group-hover:text-emerald-700 transition">Certified Centers</h4>
                                            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Add, review, and manage affiliated training centers shown in the Verified Centers grid.</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-100 relative z-10">
                                        <a href={getUrl('/admin/center')} className="block w-full py-2.5 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 text-xs font-bold rounded-xl text-center transition-colors shadow-sm">
                                            Manage Centers &rsaquo;
                                        </a>
                                    </div>
                                </div>

                                {/* CMS Card: Video Gallery */}
                                <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-red-500/20 transition"></div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-xl shadow-sm">
                                            <i className="fa-brands fa-youtube"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 group-hover:text-red-700 transition">Video Gallery</h4>
                                            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Embed YouTube orientation videos, tutorials, and success story clips directly onto the homepage.</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-100 relative z-10">
                                        <a href={getUrl('/admin/youtube-video')} className="block w-full py-2.5 bg-slate-50 group-hover:bg-red-600 group-hover:text-white text-slate-700 text-xs font-bold rounded-xl text-center transition-colors shadow-sm">
                                            Manage Videos &rsaquo;
                                        </a>
                                    </div>
                                </div>

                                {/* CMS Card: Leadership / Team */}
                                <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition"></div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl shadow-sm">
                                            <i className="fa-solid fa-users-gear"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 group-hover:text-purple-700 transition">Leadership / Team</h4>
                                            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Update profiles, images, and designations of the Institute's leadership panel.</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-100 relative z-10">
                                        <a href={getUrl('/admin/team')} className="block w-full py-2.5 bg-slate-50 group-hover:bg-purple-600 group-hover:text-white text-slate-700 text-xs font-bold rounded-xl text-center transition-colors shadow-sm">
                                            Manage Team &rsaquo;
                                        </a>
                                    </div>
                                </div>

                                {/* CMS Card: Sponsors & Affiliations */}
                                <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition"></div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl shadow-sm">
                                            <i className="fa-solid fa-handshake"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 group-hover:text-amber-700 transition">Sponsors & Affiliations</h4>
                                            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Add logos of government, corporate, and educational partners to the scrolling carousel.</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-100 relative z-10">
                                        <a href={getUrl('/admin/sponsor')} className="block w-full py-2.5 bg-slate-50 group-hover:bg-amber-500 group-hover:text-slate-900 text-slate-700 text-xs font-bold rounded-xl text-center transition-colors shadow-sm">
                                            Manage Sponsors &rsaquo;
                                        </a>
                                    </div>
                                </div>

                                {/* CMS Card: WhatsApp Links */}
                                <div className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-green-500/20 transition"></div>
                                    <div className="relative z-10 space-y-4">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl shadow-sm">
                                            <i className="fa-brands fa-whatsapp"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-slate-800 group-hover:text-green-700 transition">WhatsApp Support</h4>
                                            <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Manage WhatsApp floating chat numbers and automated support messages.</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-100 relative z-10">
                                        <a href={getUrl('/admin/whatapp-link')} className="block w-full py-2.5 bg-slate-50 group-hover:bg-green-500 group-hover:text-white text-slate-700 text-xs font-bold rounded-xl text-center transition-colors shadow-sm">
                                            Manage WhatsApp &rsaquo;
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Floating Save Bar */}
                    <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3.5 bg-gradient-to-r from-[#7024A8] to-[#581C87] hover:from-purple-800 hover:to-purple-950 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-purple-600/30 transition-all flex items-center gap-2.5 transform active:scale-95 disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin text-amber-300"></i>
                                    <span>Updating Portal Settings...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-check-double text-amber-300"></i>
                                    <span>Save & Apply Configuration</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
