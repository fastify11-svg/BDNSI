import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ prices, centers }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        center_id: '',
        product_type: 'Registration', // default
        base_price: '',
        discount: 0,
        effective_from: '',
        status: true,
    });

    const submit = (e) => {
        e.preventDefault();
        Inertia.post(route('admin.prices.store'), data, {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Manage Prices" />
            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Add New Price Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Configure Pricing</h2>
                        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Center (Leave blank for Default System Price)</label>
                                <select 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.center_id}
                                    onChange={e => setData('center_id', e.target.value)}
                                >
                                    <option value="">-- System Default --</option>
                                    {centers.map(c => (
                                        <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                                    ))}
                                </select>
                                {errors.center_id && <div className="text-red-500 text-sm mt-1">{errors.center_id}</div>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Type</label>
                                <select 
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.product_type}
                                    onChange={e => setData('product_type', e.target.value)}
                                >
                                    <option value="Registration">Registration</option>
                                    <option value="Certificate">Certificate</option>
                                    <option value="ID Card">ID Card</option>
                                </select>
                                {errors.product_type && <div className="text-red-500 text-sm mt-1">{errors.product_type}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Base Price (BDT)</label>
                                <input 
                                    type="number" step="0.01" min="0" required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.base_price}
                                    onChange={e => setData('base_price', e.target.value)}
                                />
                                {errors.base_price && <div className="text-red-500 text-sm mt-1">{errors.base_price}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discount Amount (BDT)</label>
                                <input 
                                    type="number" step="0.01" min="0"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.discount}
                                    onChange={e => setData('discount', e.target.value)}
                                />
                                {errors.discount && <div className="text-red-500 text-sm mt-1">{errors.discount}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Effective From</label>
                                <input 
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.effective_from}
                                    onChange={e => setData('effective_from', e.target.value)}
                                />
                                {errors.effective_from && <div className="text-red-500 text-sm mt-1">{errors.effective_from}</div>}
                            </div>

                            <div className="flex items-end">
                                <button type="submit" disabled={processing} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                                    Save Price
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Prices Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Active Pricing Matrix</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective From</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {prices.length === 0 ? (
                                        <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-500">No custom prices configured.</td></tr>
                                    ) : (
                                        prices.map((price) => (
                                            <tr key={price.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {price.center_id ? (
                                                        <span className="text-indigo-600 font-medium">Center: {price.center?.code}</span>
                                                    ) : (
                                                        <span className="text-gray-800 font-bold">SYSTEM DEFAULT</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{price.product_type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">৳{parseFloat(price.base_price).toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-red-500">-৳{parseFloat(price.discount).toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap font-bold text-green-600">
                                                    ৳{(parseFloat(price.base_price) - parseFloat(price.discount)).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{price.effective_from || 'Always'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {price.status ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Inactive</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
