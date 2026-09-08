import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/inertia-react';
import { getUrl } from '../utils/urlHelper';

export default function StaffLayout({ children, title = 'Staff Operations Hub' }) {
    const { auth, flash } = usePage().props;
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const [copied, setCopied] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);

    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post(getUrl('/staff/logout'));
    };

    const staffUser = auth?.staff;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const copyReferralLink = () => {
        if (staffUser?.referral_link) {
            navigator.clipboard.writeText(staffUser.referral_link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const navItems = [
        { label: 'Dashboard', href: '/staff/dashboard', icon: 'fa-gauge-high' },
        { label: 'My Custom Courses', href: '/staff/courses', icon: 'fa-book-bookmark' },
        { label: 'Academic Sessions', href: '/staff/sessions', icon: 'fa-calendar-check' },
        { label: 'Student Admissions', href: '/staff/students', icon: 'fa-user-graduate' },
        { label: 'Enroll New Student', href: '/staff/students/create', icon: 'fa-user-plus' },
        { label: 'Document Processing', href: '/staff/documents', icon: 'fa-file-invoice' },
        { label: 'My Commissions', href: '/staff/commissions', icon: 'fa-hand-holding-dollar' },
    ];

    const isActive = (path) => {
        const fullPath = getUrl(path);
        return currentPath === fullPath || currentPath.endsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-[#0B1528] text-slate-300 border-r border-slate-800 shadow-2xl fixed inset-y-0 z-40">
                {/* Brand Header */}
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">
                        <i className="fa-solid fa-briefcase"></i>
                    </div>
                    <div>
                        <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                            BDNSI STAFF
                        </h1>
                        <p className="text-[11px] text-purple-400 font-semibold mt-1">
                            Team & Partner Portal
                        </p>
                    </div>
                </div>

                {/* Referral Link Box in Sidebar */}
                {staffUser?.referral_code && (
                    <div className="mx-4 mt-4 p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between text-indigo-300 font-bold text-[10px] uppercase tracking-wider">
                            <span><i className="fa-solid fa-link mr-1"></i> Your Ref Code</span>
                            <span className="bg-indigo-600/40 text-indigo-200 px-1.5 py-0.5 rounded font-mono text-[11px]">
                                {staffUser.referral_code}
                            </span>
                        </div>
                        <button
                            onClick={copyReferralLink}
                            type="button"
                            className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition text-[11px] flex items-center justify-center gap-1.5 shadow"
                        >
                            <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                            <span>{copied ? 'Link Copied!' : 'Copy Referral Link'}</span>
                        </button>
                    </div>
                )}

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1 mt-2">
                    <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                        STAFF MODULES
                    </p>
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.label}
                                href={getUrl(item.href)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    active
                                        ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white font-bold border-l-4 border-purple-500 bg-[#16233B]'
                                        : 'text-slate-400 hover:bg-[#14223A] hover:text-white'
                                }`}
                            >
                                <i className={`fa-solid ${item.icon} w-4 text-center text-sm ${active ? 'text-purple-400' : 'text-slate-500'}`}></i>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Sidebar User Info & Logout */}
                <div className="p-4 border-t border-slate-800 bg-[#070F1E]">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#0F1D33] border border-slate-800">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs shadow">
                                {staffUser?.name ? staffUser.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">
                                    {staffUser?.name || 'Staff Member'}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">
                                    {staffUser?.designation || staffUser?.email || 'Officer'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                {/* Topbar Header */}
                <header className="bg-white/90 backdrop-blur border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileSidebar(true)}
                            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                        >
                            <i className="fa-solid fa-bars text-lg"></i>
                        </button>
                        <div>
                            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                                {title}
                            </h1>
                            <p className="text-[11px] text-slate-500 hidden sm:block">
                                Decentralized Staff Workspace & Student Pipeline
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Referral Quick Copy Button for Header */}
                        {staffUser?.referral_link && (
                            <button
                                onClick={copyReferralLink}
                                type="button"
                                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs rounded-xl border border-purple-200 transition shadow-xs"
                            >
                                <i className={`fa-solid ${copied ? 'fa-check text-emerald-600' : 'fa-share-nodes'}`}></i>
                                <span>{copied ? 'Copied to Clipboard!' : 'Share Referral Link'}</span>
                            </button>
                        )}

                        {/* Staff User Header Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdown(!userDropdown)}
                                className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100 transition"
                            >
                                <div className="w-9 h-9 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 font-bold flex items-center justify-center text-sm shadow-xs">
                                    <i className="fa-solid fa-user-tie"></i>
                                </div>
                                <div className="text-left hidden md:block">
                                    <p className="text-xs font-bold text-slate-900 leading-tight">
                                        {staffUser?.name || 'Staff User'}
                                    </p>
                                    <p className="text-[10px] font-medium text-slate-400">{staffUser?.referral_code || 'Staff'}</p>
                                </div>
                                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
                            </button>

                            {userDropdown && (
                                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-fadeIn">
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="font-bold text-slate-800">{staffUser?.name}</p>
                                        <p className="text-[10px] text-slate-400 truncate">{staffUser?.email}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-bold transition"
                                    >
                                        <i className="fa-solid fa-right-from-bracket"></i>
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Mobile Drawer */}
                {mobileSidebar && (
                    <div className="lg:hidden fixed inset-0 z-50 flex">
                        <div
                            onClick={() => setMobileSidebar(false)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
                        ></div>
                        <div className="relative w-72 bg-[#0B1528] text-slate-300 p-5 flex flex-col h-full space-y-6 shadow-2xl z-10 border-r border-slate-800">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-base">
                                        <i className="fa-solid fa-briefcase"></i>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-extrabold text-white">BDNSI STAFF</h2>
                                        <p className="text-[10px] text-purple-400">Partner Portal</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMobileSidebar(false)}
                                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                                >
                                    <i className="fa-solid fa-xmark text-lg"></i>
                                </button>
                            </div>

                            <div className="space-y-1 flex-1 overflow-y-auto pr-1">
                                {navItems.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.label}
                                            href={getUrl(item.href)}
                                            onClick={() => setMobileSidebar(false)}
                                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                                                active
                                                    ? 'bg-purple-600 text-white font-bold'
                                                    : 'text-slate-400 hover:bg-[#14223A] hover:text-white'
                                            }`}
                                        >
                                            <i className={`fa-solid ${item.icon} w-4 text-center text-sm`}></i>
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-rose-500/20"
                            >
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 shadow-xs animate-fadeIn">
                        <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-3 shadow-xs animate-fadeIn">
                        <i className="fa-solid fa-triangle-exclamation text-rose-600 text-base"></i>
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Main Viewport Content */}
                <main className="p-4 sm:p-8 flex-1 max-w-full overflow-x-hidden">
                    {children}
                </main>

                <footer className="bg-white border-t border-slate-200/80 p-4 text-center text-[11px] font-medium text-slate-500">
                    &copy; {new Date().getFullYear()} BDNSI Staff & Partner Workspace &bull; All Rights Reserved.
                </footer>
            </div>
        </div>
    );
}
