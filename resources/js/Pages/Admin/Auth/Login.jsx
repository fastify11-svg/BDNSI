import React from 'react';
import { useForm, usePage } from '@inertiajs/inertia-react';

export default function AdminLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 font-sans text-slate-100">
            <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-[#7024A8] rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <i className="fa-solid fa-shield-halved text-2xl text-white"></i>
                    </div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-white">Admin Authentication</h1>
                    <p className="text-xs text-slate-400">Authorized personnel access only</p>
                </div>

                {status && (
                    <div className="bg-emerald-900/50 border border-emerald-700 text-emerald-300 p-3 rounded-xl text-xs text-center font-medium">
                        {status}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition"
                        />
                        {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition"
                        />
                        {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-purple-500"
                            />
                            <span>Remember Me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-[#7024A8] hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-lg transition disabled:opacity-50"
                    >
                        Sign In to Admin Portal
                    </button>
                </form>
            </div>
        </div>
    );
}
