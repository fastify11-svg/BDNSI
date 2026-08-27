import React, { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/inertia-react';
import { getUrl } from '../utils/urlHelper';

export default function StudentLayout({ children, title = 'Student Academic Portal' }) {
    const { auth, flash } = usePage().props;
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);

    const { post } = useForm();

    const handleLogout = (e) => {
        e.preventDefault();
        post(getUrl('/students/logout'));
    };

    const student = auth?.student;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const navItems = [
        { label: 'Academic Overview', href: '/students/dashboard', icon: 'fa-gauge-high' },
        { label: 'My Results & GPA', href: '/students/results', icon: 'fa-square-poll-vertical' },
        { label: 'Digital Document Center', href: '/students/documents', icon: 'fa-file-invoice' },
        { label: 'Public Verification', href: '/verify', icon: 'fa-certificate', external: false },
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/20">
                        <i className="fa-solid fa-graduation-cap"></i>
                    </div>
                    <div>
                        <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                            BDNSI STUDENT
                        </h1>
                        <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                            Academic & Result Portal
                        </p>
                    </div>
                </div>

                {/* Student Mini Profile Box in Sidebar */}
                {student && (
                    <div className="mx-4 mt-4 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center gap-3">
                        <img
                            src={student.picture ? getUrl(student.picture) : getUrl('/images/avatar.png')}
                            alt={student.name}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500/50 shrink-0"
                        />
                        <div className="min-w-0">
                            <p className="text-xs font-extrabold text-white truncate">{student.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Roll: {student.roll || 'N/A'}</p>
                        </div>
                    </div>
                )}

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1 mt-2">
                    <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                        STUDENT SERVICES
                    </p>
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.label}
                                href={getUrl(item.href)}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                    active
                                        ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/20 text-white font-bold border-l-4 border-emerald-500 bg-[#16233B]'
                                        : 'text-slate-400 hover:bg-[#14223A] hover:text-white'
                                }`}
                            >
                                <i className={`fa-solid ${item.icon} w-4 text-center text-sm ${active ? 'text-emerald-400' : 'text-slate-500'}`}></i>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-800 bg-[#070F1E]">
                    <button
                        onClick={handleLogout}
                        className="w-full py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Viewport */}
            <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
                {/* Topbar Header */}
                <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
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
                                Student Self-Service & Digital Academic Verification
                            </p>
                        </div>
                    </div>

                    {/* Student Status & User Menu */}
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200">
                            <i className="fa-solid fa-circle-check text-xs"></i>
                            <span>Verified Student</span>
                        </span>

                        <div className="relative">
                            <button
                                onClick={() => setUserDropdown(!userDropdown)}
                                className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-100 transition"
                            >
                                <img
                                    src={student?.picture ? getUrl(student.picture) : getUrl('/images/avatar.png')}
                                    alt="Avatar"
                                    className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                                />
                                <div className="text-left hidden md:block">
                                    <p className="text-xs font-bold text-slate-900 leading-tight">
                                        {student?.name || 'Student'}
                                    </p>
                                    <p className="text-[10px] font-medium text-slate-400 font-mono">{student?.registration || 'ID'}</p>
                                </div>
                                <i className="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
                            </button>

                            {userDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs animate-fadeIn">
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="font-bold text-slate-800">{student?.name}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">Roll: {student?.roll}</p>
                                    </div>
                                    <Link
                                        href={getUrl('/students/documents')}
                                        className="px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium transition"
                                    >
                                        <i className="fa-solid fa-file-invoice text-slate-400"></i>
                                        <span>My Documents</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold transition border-t border-slate-100"
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
                                    <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-base">
                                        <i className="fa-solid fa-graduation-cap"></i>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-extrabold text-white">BDNSI STUDENT</h2>
                                        <p className="text-[10px] text-emerald-400">Academic Portal</p>
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
                                                    ? 'bg-emerald-600 text-white font-bold'
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

                {/* Body Content */}
                <main className="p-4 sm:p-8 flex-1 max-w-full overflow-x-hidden">
                    {children}
                </main>

                <footer className="bg-white border-t border-slate-200 p-4 text-center text-[11px] font-medium text-slate-500">
                    &copy; {new Date().getFullYear()} BDNSI Student Academic Portal &bull; All Rights Reserved.
                </footer>
            </div>
        </div>
    );
}
