import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import CenterLayout from '../../Layouts/CenterLayout';
import { getUrl } from '../../utils/urlHelper';

export default function Dashboard({ cards = {}, financials = null }) {
    const { auth, app_url } = usePage().props;
    const [activeTab, setActiveTab] = useState('Basic');

    const user = auth?.user || {};
    const center = user?.center || {};

    const totalStudents = cards['Total Student'] ?? cards['total_students'] ?? 0;
    const totalApproved = cards['Total Approved'] ?? cards['total_approved'] ?? 0;
    const totalPending = cards['Total Pending'] ?? cards['total_pending'] ?? 0;

    return (
        <CenterLayout title="Center Dashboard">
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Hero Grid Banner Section */}
                <div className="bg-[#0A182A] text-white border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                    {/* Background Subtle Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                        {/* Hero Left Content */}
                        <div className="space-y-4 max-w-2xl">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4A359]">
                                YOUNG TECHNICAL TRAINING CENTRE
                            </p>
                             <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                {center.name || 'Skill Development Training Center'}
                            </h1>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                                Manage registrations, submissions, and results for your institute from one calm workspace.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Link
                                    href={getUrl('/student/create')}
                                    className="bg-[#D4A359] hover:bg-[#c5954c] text-slate-950 font-extrabold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
                                >
                                    <span>New registration</span>
                                    <i className="fa-solid fa-arrow-right text-[#0A182A]"></i>
                                </Link>
                                <Link
                                    href={getUrl('/student')}
                                    className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 transition"
                                >
                                    <span>View students</span>
                                </Link>
                            </div>
                        </div>

                        {/* Session Context Box (Right) */}
                        <div className="w-full lg:w-80 bg-[#061220]/90 backdrop-blur border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-800/80 pb-2">
                                SESSION CONTEXT
                            </p>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Director / Owner</span>
                                    <span className="font-bold text-white truncate max-w-[160px]">{center.owner_name || user.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Center Name</span>
                                    <span className="font-semibold text-slate-200 truncate max-w-[160px]">{center.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Center Code</span>
                                    <span className="font-mono font-bold text-[#D4A359]">#{center.code}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enrollment Pulse / Student Overview Cards Section */}
                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                            ENROLLMENT PULSE
                        </p>
                        <h2 className="text-xl font-black text-slate-900">
                            Student overview
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Student */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex justify-between items-center relative overflow-hidden group hover:shadow-md transition">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Student</p>
                                <p className="text-4xl font-black text-slate-900">{totalStudents}</p>
                                <p className="text-[11px] text-slate-500 font-medium">Registered at your center</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 text-xl shadow-sm">
                                <i className="fa-solid fa-id-card"></i>
                            </div>
                        </div>

                        {/* Total Approved */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex justify-between items-center relative overflow-hidden group hover:shadow-md transition">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Approved</p>
                                <p className="text-4xl font-black text-emerald-600">{totalApproved}</p>
                                <p className="text-[11px] text-slate-500 font-medium">Cleared for certificates</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 text-xl shadow-sm">
                                <i className="fa-solid fa-user-check"></i>
                            </div>
                        </div>

                        {/* Total Pending */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex justify-between items-center relative overflow-hidden group hover:shadow-md transition">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Pending</p>
                                <p className="text-4xl font-black text-amber-600">{totalPending}</p>
                                <p className="text-[11px] text-slate-500 font-medium">Awaiting review</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 text-xl shadow-sm">
                                <i className="fa-solid fa-clock"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Ledger Widget */}
                {financials && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                B2B FINANCIAL LEDGER
                            </p>
                            <h2 className="text-xl font-black text-slate-900">
                                Financial overview
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Current Due */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex justify-between items-center relative overflow-hidden group hover:shadow-md transition">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Due</p>
                                    <p className="text-4xl font-black text-rose-600">৳{parseFloat(financials.current_due || 0).toFixed(2)}</p>
                                    <p className="text-[11px] text-slate-500 font-medium">Unpaid balance</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 text-xl shadow-sm">
                                    <i className="fa-solid fa-money-bill-wave"></i>
                                </div>
                            </div>

                            {/* Credit Limit */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex justify-between items-center relative overflow-hidden group hover:shadow-md transition">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Credit Limit</p>
                                    <p className="text-4xl font-black text-slate-900">
                                        {financials.credit_enabled ? `৳${parseFloat(financials.credit_limit || 0).toFixed(2)}` : 'N/A'}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        {financials.credit_enabled ? 'Maximum allowed due' : 'Credit system disabled'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 text-xl shadow-sm">
                                    <i className="fa-solid fa-scale-balanced"></i>
                                </div>
                            </div>

                            {/* Available Credit */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex justify-between items-center relative overflow-hidden group hover:shadow-md transition">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Available Credit</p>
                                    <p className="text-4xl font-black text-emerald-600">
                                        {financials.credit_enabled ? `৳${parseFloat(financials.available_credit || 0).toFixed(2)}` : 'N/A'}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-medium">Remaining ordering capacity</p>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 text-xl shadow-sm">
                                    <i className="fa-solid fa-chart-pie"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Center Information Section */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                INSTITUTE PROFILE
                            </p>
                            <h2 className="text-xl font-black text-slate-900">
                                Center information
                            </h2>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                            {['Basic', 'Location', 'Operations'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-lg transition ${
                                        activeTab === tab
                                            ? 'bg-[#0A182A] text-white shadow-sm'
                                            : 'hover:text-slate-900'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-xs">
                        {activeTab === 'Basic' && (
                            <>
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CENTER CODE</p>
                                    <p className="font-mono font-bold text-indigo-700 text-sm">#{center.code}</p>
                                </div>
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CENTER NAME</p>
                                    <p className="font-bold text-slate-900 text-sm">{center.name}</p>
                                </div>
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">DIRECTOR / PROPRIETOR</p>
                                    <p className="font-bold text-slate-800">{center.owner_name || user.name}</p>
                                </div>
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">MOBILE NUMBER</p>
                                    <p className="font-mono font-bold text-slate-800">{center.mobile || user.phone || 'N/A'}</p>
                                </div>
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">EMAIL ADDRESS</p>
                                    <p className="font-bold text-slate-800">{center.email || user.email || 'N/A'}</p>
                                </div>
                            </>
                        )}

                        {activeTab === 'Location' && (
                            <>
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CENTER LOCATION (LANDMARK)</p>
                                    <p className="font-bold text-slate-900 text-sm">{center.center_location || 'N/A'}</p>
                                </div>
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">POSTAL ADDRESS</p>
                                    <p className="font-bold text-slate-800">{center.address || 'N/A'}</p>
                                </div>
                            </>
                        )}

                        {activeTab === 'Operations' && (
                            <>
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CENTER STATUS</p>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[11px]">
                                        Approved & Active
                                    </span>
                                </div>
                                <div className="border-b border-slate-100 pb-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ACADEMIC PERMISSION</p>
                                    <p className="font-bold text-slate-800">Govt. Technical Certification Authorized</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </CenterLayout>
    );
}
