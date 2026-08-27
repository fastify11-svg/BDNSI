import React from 'react';
import { Head, useForm } from '@inertiajs/inertia-react';
import { getUrl } from '../../../utils/urlHelper';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(getUrl('/students/reset-password'));
    };

    return (
        <div className="min-h-screen bg-[#070F1E] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500 selection:text-white">
            <Head title="Set New Student Password" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-black mx-auto shadow-xl shadow-emerald-600/30">
                    <i className="fa-solid fa-lock-open"></i>
                </div>
                <h2 className="mt-5 text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Set New Password
                </h2>
                <p className="mt-2 text-xs text-slate-400 font-medium">
                    Choose a strong password to secure your student portal account.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-[#0F1D33] py-8 px-6 sm:px-10 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input type="hidden" name="token" value={data.token} />

                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full px-4 py-3 bg-[#081224] border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                            />
                            {errors.email && <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimum 8 characters"
                                className="w-full px-4 py-3 bg-[#081224] border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                            />
                            {errors.password && <p className="mt-1.5 text-xs text-rose-400 font-semibold">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Re-type your password"
                                className="w-full px-4 py-3 bg-[#081224] border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {processing ? 'Updating Password...' : 'Save New Password & Log In'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
