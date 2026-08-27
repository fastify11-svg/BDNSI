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
        post(getUrl('/students/login'));
    };

    return (
        <div className="min-h-screen bg-[#070F1E] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500 selection:text-white">
            <Head title="Student Academic Portal Login" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-black mx-auto shadow-xl shadow-emerald-600/30">
                    <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <h2 className="mt-5 text-2xl sm:text-3xl font-black text-white tracking-tight">
                    BDNSI STUDENT PORTAL
                </h2>
                <p className="mt-2 text-xs text-slate-400 font-medium">
                    Access your academic results, marksheet, admit card, and student ID
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-[#0F1D33] py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Multi-Identifier Login Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Roll Number / Reg No / Phone / Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <i className="fa-solid fa-id-card-clip text-sm"></i>
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                    placeholder="Enter your Roll, Reg No, or Mobile"
                                    className="w-full pl-10 pr-4 py-3 bg-[#081224] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                                />
                            </div>
                            {errors.login && (
                                <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.login}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                                    Password
                                </label>
                                <Link
                                    href={getUrl('/students/forgot-password')}
                                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <i className="fa-solid fa-lock text-sm"></i>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-4 py-3 bg-[#081224] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
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
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {processing ? (
                                    <span>Signing In...</span>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                        <span>Sign In to Student Dashboard</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="pt-4 border-t border-slate-800 text-center space-y-2">
                        <p className="text-[11px] text-slate-400">
                            Want to verify a public certificate?{' '}
                            <Link href={getUrl('/verify')} className="text-emerald-400 font-semibold hover:underline">
                                Click here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
