import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import FrontendLayout from '../../Layouts/FrontendLayout';
import { getUrl } from '../../utils/urlHelper';

export default function ComingSoon({ module, message }) {
    return (
        <FrontendLayout>
            <Head title="Coming Soon" />
            <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center shadow-inner">
                            <i className="fa-solid fa-person-digging text-4xl text-indigo-500 animate-bounce"></i>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                            Coming Soon
                        </h2>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {message || 'This feature is currently being updated and will be available soon. Thank you for your patience.'}
                        </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <Link 
                            href={getUrl('/')} 
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B1528] text-white font-extrabold rounded-xl hover:bg-slate-800 transition shadow-md"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
