import React from 'react';
import { Head, useForm, Link } from '@inertiajs/inertia-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { getUrl } from '@/utils/urlHelper';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(getUrl('/admin/sub-admin'));
    };

    return (
        <AdminLayout title="Create Sub Admin">
            <Head title="Create Sub Admin" />

            <div className="max-w-3xl mx-auto mt-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Add New Sub Admin</h2>
                            <p className="text-xs text-slate-500 mt-1">Create a new system administrator account.</p>
                        </div>
                        <Link
                            href={getUrl('/admin/sub-admin')}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-sm flex items-center gap-2"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            Back to List
                        </Link>
                    </div>

                    <form onSubmit={submit} className="space-y-5" autoComplete="off">
                        {/* Fake inputs to prevent autofill on Chrome */}
                        <input type="text" style={{display: 'none'}} />
                        <input type="password" style={{display: 'none'}} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Full Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-regular fa-user text-slate-400"></i>
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                                        placeholder="E.g. John Doe"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                {errors.name && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Email Address <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-regular fa-envelope text-slate-400"></i>
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                                        placeholder="E.g. admin@example.com"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Password <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-lock text-slate-400"></i>
                                    </div>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                                        placeholder="Strong password"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Confirm Password <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i className="fa-solid fa-lock text-slate-400"></i>
                                    </div>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-sm"
                                        placeholder="Re-type password"
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 ${
                                    processing ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-check"></i>
                                        Create Sub Admin
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
