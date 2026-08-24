import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import { getUrl } from '../../utils/urlHelper';

export default function Maintenance({ portal_name, message }) {
    return (
        <div className="min-h-screen bg-[#070F1E] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 font-sans selection:bg-purple-500 selection:text-white">
            <Head title="Student Portal Maintenance" />

            <div className="max-w-md w-full text-center space-y-8 bg-[#0F1D33] p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-800 animate-fadeIn">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                        <i className="fa-solid fa-screwdriver-wrench text-3xl text-purple-400 animate-bounce"></i>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-amber-500/30">
                        <i className="fa-solid fa-lock text-xs"></i>
                        Portal Temporarily Closed
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        {portal_name || 'BDNSI'} Student Portal
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed">
                        {message || 'The Student Portal is temporarily offline for scheduled system upgrades and database reconciliation.'}
                    </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
                    <Link
                        href={getUrl('/')}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-house"></i>
                        <span>Return to Main Website</span>
                    </Link>
                    <Link
                        href={getUrl('/verify')}
                        className="text-xs text-purple-400 hover:text-purple-300 font-bold transition"
                    >
                        Public Certificate Verification &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
