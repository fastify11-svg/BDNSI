import React from 'react';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { getUrl } from '../../../utils/urlHelper';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(getUrl('/staff/login'));
    };

    return (
        <div className="min-h-screen bg-[#070F1E] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-purple-500 selection:text-white">
            <Head title="Staff & Partner Portal Login" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-black mx-auto shadow-xl shadow-purple-600/30">
                    <i className="fa-solid fa-briefcase"></i>
                </div>
                <h2 className="mt-5 text-2xl sm:text-3xl font-black text-white tracking-tight">
                    BDNSI STAFF PORTAL
                </h2>
                <p className="mt-2 text-xs text-slate-400 font-medium">
                    Decentralized Team Operations & Student Enrollment Hub
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-[#0F1D33] py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Login Identifier (Email or Phone) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Official Email or Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <i className="fa-solid fa-user text-sm"></i>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    placeholder="e.g. officer@bdnsi.gov.bd or 017XXXXXXXX"
                                    className="w-full pl-10 pr-4 py-3 bg-[#081224] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition"
                                />
                            </div>
                            {errors.login && (
                                <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.login}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <i className="fa-solid fa-lock text-sm"></i>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your staff password"
                                    className="w-full pl-10 pr-4 py-3 bg-[#081224] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {processing ? (
                                    <span>Authenticating...</span>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                        <span>Sign In to Staff Workspace</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="pt-4 border-t border-slate-800 text-center flex flex-col gap-2">
                        <Link
                            href={getUrl('/staff/forgot-password')}
                            className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition"
                        >
                            Forgot your password?
                        </Link>
                        <p className="text-[11px] text-slate-400">
                            Need credentials?{' '}
                            <span className="text-slate-300 font-semibold">Contact Head Office Admin</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
