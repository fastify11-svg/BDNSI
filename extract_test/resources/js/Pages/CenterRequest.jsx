import React from 'react';
import { useForm } from '@inertiajs/inertia-react';
import FrontendLayout from '../Layouts/FrontendLayout';

export default function CenterRequest() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        owner_name: '',
        email: '',
        phone: '',
        address: '',
        photo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/center-request');
    };

    return (
        <FrontendLayout>
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-12 px-4">
                <div className="max-w-4xl mx-auto text-center space-y-2">
                    <h1 className="text-3xl font-extrabold">Institute Branch Registration Application</h1>
                    <p className="text-purple-200 text-sm">Apply for official center affiliation and partnership with BDNSI.</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-md border border-gray-100 space-y-8">
                    <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                        Center Information Form
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Institute / Center Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Center Director / Owner Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.owner_name}
                                    onChange={(e) => setData('owner_name', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                                {errors.owner_name && <p className="text-xs text-rose-600 mt-1">{errors.owner_name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                                {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                                Complete Address *
                            </label>
                            <textarea
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm"
                            ></textarea>
                            {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address}</p>}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-[#7024A8] hover:bg-purple-800 text-white font-bold rounded-xl shadow-md transition text-sm disabled:opacity-50"
                            >
                                Submit Center Application
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </FrontendLayout>
    );
}
