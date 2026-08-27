import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../Layouts/AdminLayout';
import { getUrl } from '../../utils/urlHelper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6'];

export default function Dashboard({ cards = {}, adminList = [], analytics = {} }) {
    const { app_url } = usePage().props;
    const { monthlyRegistrations = [], statusBreakdown = [], topCenters = [] } = analytics;
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleCreateAdmin = (e) => {
        e.preventDefault();
        post(getUrl('/admin/userCreate'), {
            onSuccess: () => reset('name', 'email', 'password', 'password_confirmation')
        });
    };

    const cardKeys = Object.keys(cards);

    // Modern color themes for stats cards accent badges
    const cardThemes = [
        { iconBg: 'bg-indigo-50 border-indigo-100 text-indigo-600', icon: 'fa-building-columns' },
        { iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600', icon: 'fa-user-graduate' },
        { iconBg: 'bg-amber-50 border-amber-100 text-amber-600', icon: 'fa-book-open' },
        { iconBg: 'bg-blue-50 border-blue-100 text-blue-600', icon: 'fa-calendar-days' },
        { iconBg: 'bg-purple-50 border-purple-100 text-purple-600', icon: 'fa-square-poll-vertical' },
        { iconBg: 'bg-rose-50 border-rose-100 text-rose-600', icon: 'fa-file-lines' },
        { iconBg: 'bg-teal-50 border-teal-100 text-teal-600', icon: 'fa-circle-question' },
        { iconBg: 'bg-cyan-50 border-cyan-100 text-cyan-600', icon: 'fa-bullhorn' },
    ];

    return (
        <AdminLayout title="Overview Dashboard">
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Stats Cards Grid (Mobile First Stack) */}
                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">SYSTEM METRICS</p>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">System Statistics</h2>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">Real-time database records</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {cardKeys.length > 0 ? (
                            cardKeys.map((key, index) => {
                                const card = cards[key];
                                const theme = cardThemes[index % cardThemes.length];
                                return (
                                    <Link
                                        key={key}
                                        href={getUrl(card?.url)}
                                        className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all group flex items-center justify-between relative overflow-hidden"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                                {key}
                                            </p>
                                            <p className="text-3xl font-black text-slate-900 tracking-tight">
                                                {card?.value ?? 0}
                                            </p>
                                        </div>
                                        <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} border flex items-center justify-center text-lg shadow-xs group-hover:scale-105 transition-transform`}>
                                            <i className={`fa-solid ${theme.icon}`}></i>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="col-span-full p-8 bg-white rounded-2xl border border-slate-200 text-slate-400 text-center text-xs font-semibold">
                                Loading system metrics...
                            </div>
                        )}
                    </div>
                </div>

                {/* Advanced Analytics & Charts Section */}
                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 mt-8">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600">ANALYTICS</p>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">System Analytics</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Monthly Registrations Chart (Area) */}
                        <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200/80 xl:col-span-2">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-chart-line text-indigo-500"></i>
                                Monthly Registrations (Last 6 Months)
                            </h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyRegistrations} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="month_name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                                        <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                        <Area type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" name="Registrations" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Status Breakdown (Pie) */}
                        <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200/80">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-chart-pie text-emerald-500"></i>
                                Student Status Breakdown
                            </h3>
                            <div className="h-72 w-full flex flex-col justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {statusBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Centers (Bar) */}
                        <div className="bg-white p-5 rounded-3xl shadow-xs border border-slate-200/80 lg:col-span-2 xl:col-span-3">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-ranking-star text-amber-500"></i>
                                Top 5 Centers by Students
                            </h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topCenters} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={40}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="center_name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                                        <RechartsTooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                        <Bar dataKey="total_students" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Total Students" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Management Section (Side-by-side desktop, stacked mobile) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Admin List Table */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">SECURITY & ACCESS</p>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Admin Accounts</h3>
                                </div>
                                <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full border border-indigo-100">
                                    System Administrators
                                </span>
                            </div>

                            {/* Responsive Scrollable Table Container */}
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-xs text-slate-500 uppercase bg-[#F8FAFC] border-b border-slate-200/80 whitespace-nowrap">
                                        <tr>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Administrator Name</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700">Email Address</th>
                                            <th className="px-6 py-4 font-extrabold text-slate-700 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 whitespace-nowrap">
                                        {adminList && adminList.length > 0 ? (
                                            adminList.map((user) => (
                                                <tr key={user.id} className="hover:bg-slate-50/70 transition">
                                                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span>{user.name}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-semibold text-slate-600">{user.email}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link
                                                            href={getUrl(`/admin/adminList/${user.id}/edit`)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/80 rounded-xl text-xs font-bold transition shadow-2xs"
                                                        >
                                                            <i className="fa-solid fa-key text-amber-600"></i>
                                                            <span>Reset Password</span>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-xs font-semibold">
                                                    No secondary administrator accounts found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Create Admin Form */}
                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 space-y-6">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">ADD USER</p>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <i className="fa-solid fa-user-plus text-indigo-600 text-base"></i>
                                <span>Create New Admin</span>
                            </h3>
                        </div>

                        <form onSubmit={handleCreateAdmin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Admin Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Super Administrator"
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    placeholder="admin@bdnsi.gov.bd"
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                                {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-user-shield"></i>
                                <span>Create Admin Account</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
