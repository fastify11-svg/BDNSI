import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/inertia-react';
import { getUrl } from '../utils/urlHelper';

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
    const { auth, flash, app_url } = usePage().props;
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);

    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post(getUrl('/admin/logout'));
    };

    const adminUser = auth?.admin || auth?.user;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const navSections = [
        {
            title: 'CORE MANAGEMENT',
            items: [
                { label: 'Dashboard', href: '/admin/dashboard', icon: 'fa-gauge' },
                { label: 'Center', href: '/admin/center', icon: 'fa-building-columns' },
                { label: 'Student', href: '/admin/student', icon: 'fa-user-graduate' },
                { label: 'Registration Review', href: '/admin/registration-review', icon: 'fa-user-check' },
                { label: 'Course', href: '/admin/subject', icon: 'fa-book-open' },
                { label: 'Session', href: '/admin/session', icon: 'fa-calendar-days' },
                { label: 'Result', href: '/admin/result', icon: 'fa-square-poll-vertical' },
            ]
        },
        {
            title: 'ACADEMICS & EXAMS',
            items: [
                { label: 'Exam', href: '/admin/exam', icon: 'fa-file-lines' },
                { label: 'Question', href: '/admin/question', icon: 'fa-circle-question' },
                { label: 'Notice', href: '/admin/notice', icon: 'fa-bullhorn' },
                { label: 'License', href: '/admin/license', icon: 'fa-id-card' },
                { label: 'Issue Diplomas', href: '/admin/diplomas', icon: 'fa-award' },
                { label: 'Document Builder', href: '/admin/document-templates', icon: 'fa-file-invoice' },
                { label: 'Grading Rules', href: '/admin/grade-scales', icon: 'fa-percent' },
            ]
        },
        {
            title: 'TEAM OPERATIONS',
            items: [
                { label: 'Staff Directory', href: '/admin/team', icon: 'fa-users-gear' },
                { label: 'Team Performance', href: '/admin/team-performance', icon: 'fa-chart-line' },
            ]
        },
        {
            title: 'FINANCE & SETTINGS',
            items: [
                { label: 'Financial Tracking', href: '/admin/financial', icon: 'fa-money-bill-wave' },
                { label: 'Payment Gateways', href: '/admin/payment-gateway', icon: 'fa-credit-card' },
                { label: 'SMS Gateways', href: '/admin/sms-gateway', icon: 'fa-envelope-open-text' },
                { label: 'User List', href: '/admin/user', icon: 'fa-users' },
                { label: 'Sub Admin', href: '/admin/sub-admin', icon: 'fa-user-shield' },
                { label: 'Contact Us', href: '/admin/contactUs', icon: 'fa-headset' },
                { label: '🎛️ Site Control', href: '/admin/configDictionary/create', icon: 'fa-sliders' },
                { label: 'Footer Links', href: '/admin/footer-link', icon: 'fa-link' },
                { label: 'Footer Logos', href: '/admin/footer-logo', icon: 'fa-images' },
                { label: 'API Settings', href: '/admin/api-settings', icon: 'fa-key' },
                { label: 'Database Backup', href: '/admin/backup', icon: 'fa-database' },
            ]
        }
    ];

    const isActive = (path) => {
        const fullPath = getUrl(path);
        return currentPath === fullPath || currentPath.endsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
            {/* Desktop Sidebar (Fixed) */}
            <aside className="hidden lg:flex flex-col w-64 bg-[#0B1528] text-slate-300 border-r border-slate-800 shadow-2xl fixed inset-y-0 z-40">
                {/* Brand Header */}
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/30">
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                            BDNSI ADMIN
                        </h1>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">
                            Control Center Portal
                        </p>
                    </div>
                </div>

                {/* Navigation Items (Scrollbar Hidden) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {navSections.map((section, idx) => (
                        <div key={idx} className="space-y-1">
                            <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {section.title}
                            </p>
                            <nav className="space-y-0.5 pt-1">
                                {section.items.map((item) => {
                                    const active = isActive(item.href);
                                    const iconPrefix = item.isBrand ? 'fa-brands' : 'fa-solid';
                                    return (
                                        <Link
                                            key={item.label}
                                            href={getUrl(item.href)}
                                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                                active
                                                    ? 'bg-indigo-600/15 text-indigo-400 font-bold border-l-4 border-indigo-500 bg-[#14223A]'
                                                    : 'text-slate-400 hover:bg-[#14223A] hover:text-white'
                                            }`}
                                        >
                                            <i className={`${iconPrefix} ${item.icon} w-4 text-center text-sm ${active ? 'text-indigo-400' : 'text-slate-500'}`}></i>
                                            <div className="flex items-center justify-between flex-1">
                                                <span>{item.label}</span>
                                                {item.label === 'Contact Us' && auth?.admin?.unread_inquiries_count > 0 && (
                                                    <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                                                        {auth.admin.unread_inquiries_count}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Sidebar User Info & Logout */}
                <div className="p-4 border-t border-slate-800 bg-[#070F1E]">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#0F1D33] border border-slate-800">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow">
                                {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-white truncate">
                                    {adminUser?.name || 'Super Admin'}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">
                                    {adminUser?.email || 'admin@bdnsi.gov.bd'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                {/* Topbar Header */}
                <header className="bg-white/90 backdrop-blur border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileSidebar(true)}
                            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                        >
                            <i className="fa-solid fa-bars text-lg"></i>
                        </button>

                        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                            {title}
                        </h1>
                    </div>

                    {/* Admin User Header Profile Dropdown */}
                    <div className="relative">
                        <button
                            data-testid="user-menu"
                            onClick={() => setUserDropdown(!userDropdown)}
                            className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100/80 transition"
                        >
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-sm shadow-xs">
                                <i className="fa-solid fa-user-shield"></i>
                            </div>
                            <div className="text-left hidden md:block">
                                <p className="text-xs font-bold text-slate-900 leading-tight">
                                    {adminUser?.name || 'Administrator'}
                                </p>
                                <p className="text-[10px] font-medium text-slate-400">{adminUser?.email || 'admin@gmail.com'}</p>
                            </div>
                            <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
                        </button>

                        {userDropdown && (
                            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-1.5 z-50 text-xs">
                                <Link
                                    href={getUrl('/admin/profile-update/create')}
                                    onClick={() => setUserDropdown(false)}
                                    className="px-4 py-2.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition"
                                >
                                    <i className="fa-solid fa-user-pen text-slate-400"></i>
                                    <span>Edit Profile</span>
                                </Link>
                                <Link
                                    href={getUrl('/admin/password-update/create')}
                                    onClick={() => setUserDropdown(false)}
                                    className="px-4 py-2.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition"
                                >
                                    <i className="fa-solid fa-key text-slate-400"></i>
                                    <span>Update Password</span>
                                </Link>
                                <div className="border-t border-slate-100 my-1"></div>
                                <button
                                    data-testid="logout-btn"
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-bold transition"
                                >
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                    <span>Log Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Mobile Drawer */}
                {mobileSidebar && (
                    <div className="lg:hidden fixed inset-0 z-50 flex">
                        {/* Backdrop */}
                        <div
                            onClick={() => setMobileSidebar(false)}
                            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                        ></div>

                        {/* Drawer */}
                        <div className="relative w-72 bg-[#0B1528] text-slate-300 p-5 flex flex-col h-full space-y-6 shadow-2xl z-10 border-r border-slate-800">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow">
                                        <i className="fa-solid fa-shield-halved"></i>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-extrabold text-white">BDNSI ADMIN</h2>
                                        <p className="text-[10px] text-slate-400">Control Center Portal</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setMobileSidebar(false)}
                                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
                                >
                                    <i className="fa-solid fa-xmark text-lg"></i>
                                </button>
                            </div>

                            <div className="space-y-6 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
                                {navSections.map((section, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            {section.title}
                                        </p>
                                        <nav className="space-y-0.5 pt-1">
                                            {section.items.map((item) => {
                                                const active = isActive(item.href);
                                                const iconPrefix = item.isBrand ? 'fa-brands' : 'fa-solid';
                                                return (
                                                    <Link
                                                        key={item.label}
                                                        href={getUrl(item.href)}
                                                        onClick={() => setMobileSidebar(false)}
                                                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                                                            active
                                                                ? 'bg-indigo-600/15 text-indigo-400 font-bold border-l-4 border-indigo-500 bg-[#14223A]'
                                                                : 'text-slate-400 hover:bg-[#14223A] hover:text-white'
                                                        }`}
                                                    >
                                                        <i className={`${iconPrefix} ${item.icon} w-4 text-center text-sm ${active ? 'text-indigo-400' : 'text-slate-500'}`}></i>
                                                        <div className="flex items-center justify-between flex-1">
                                                            <span>{item.label}</span>
                                                            {item.label === 'Contact Us' && auth?.admin?.unread_inquiries_count > 0 && (
                                                                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                                                                    {auth.admin.unread_inquiries_count}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </nav>
                                    </div>
                                ))}
                            </div>

                            <button
                                data-testid="mobile-logout-btn"
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
                    <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold flex items-center gap-3 shadow-xs">
                        <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-4 sm:mx-8 mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs font-semibold flex items-center gap-3 shadow-xs">
                        <i className="fa-solid fa-triangle-exclamation text-rose-600 text-base"></i>
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Body Content */}
                <main className="p-4 sm:p-8 flex-1 max-w-full overflow-x-hidden">
                    {children}
                </main>

                <footer className="bg-white border-t border-slate-200/80 p-4 text-center text-[11px] font-medium text-slate-500">
                    &copy; {new Date().getFullYear()} BDNSI Admin Portal &bull; All Rights Reserved.
                </footer>
            </div>
        </div>
    );
}
