import React from 'react';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import { getUrl } from '../../../utils/urlHelper';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(getUrl('/staff/forgot-password'));
    };

    return (
        <div className="min-h-screen bg-[#070F1E] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-purple-500 selection:text-white">
            <Head title="Forgot Staff Password" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black mx-auto shadow-xl shadow-purple-600/30">
                    <i className="fa-solid fa-user-tie"></i>
                </div>
                <h2 className="mt-5 text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Reset Staff Password
                </h2>
                <p className="mt-2 text-xs text-slate-400 font-medium">
                    Enter your registered email address to receive a secure password recovery link.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-[#0F1D33] py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                    {status && (
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2.5">
                            <i className="fa-solid fa-circle-check text-emerald-400 text-sm"></i>
                            <span>{status}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Registered Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <i className="fa-solid fa-envelope text-sm"></i>
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="staff@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-[#081224] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {processing ? (
                                    <span>Sending Recovery Link...</span>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-paper-plane"></i>
                                        <span>Email Password Reset Link</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="pt-4 border-t border-slate-800 text-center">
                        <Link
                            href={getUrl('/staff/login')}
                            className="text-xs text-slate-400 hover:text-white font-bold transition flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            <span>Back to Staff Login</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
