import React from 'react';
import { Head, useForm } from '@inertiajs/inertia-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save } from 'lucide-react';

function GatewayForm({ gateway }) {
    const { data, setData, put, processing, errors } = useForm({
        store_id: gateway.store_id || '',
        store_password: gateway.store_password || '',
        signature_key: gateway.signature_key || '',
        app_key: gateway.app_key || '',
        app_secret: gateway.app_secret || '',
        username: gateway.username || '',
        password: gateway.password || '',
        is_sandbox: gateway.is_sandbox,
        is_active: gateway.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.payment-gateway.update', gateway.id), {
            preserveScroll: true
        });
    };

    const isBkash = gateway.slug === 'bkash';

    return (
        <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">{gateway.name} Configuration</h3>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input 
                                type="checkbox" 
                                className="sr-only" 
                                checked={data.is_active} 
                                onChange={(e) => setData('is_active', e.target.checked)} 
                            />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${data.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.is_active ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-700">
                            {data.is_active ? 'Active' : 'Disabled'}
                        </div>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isBkash && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Store / Client ID</label>
                            <input 
                                type="text" 
                                value={data.store_id} 
                                onChange={(e) => setData('store_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                            {errors.store_id && <p className="mt-1 text-sm text-red-600">{errors.store_id}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Store Password / Secret Key</label>
                            <input 
                                type="password" 
                                value={data.store_password} 
                                onChange={(e) => setData('store_password', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                            {errors.store_password && <p className="mt-1 text-sm text-red-600">{errors.store_password}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Signature / Webhook Key</label>
                            <input 
                                type="text" 
                                value={data.signature_key} 
                                onChange={(e) => setData('signature_key', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                            {errors.signature_key && <p className="mt-1 text-sm text-red-600">{errors.signature_key}</p>}
                        </div>
                    </>
                )}

                {isBkash && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">App Key</label>
                            <input 
                                type="text" 
                                value={data.app_key} 
                                onChange={(e) => setData('app_key', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                            {errors.app_key && <p className="mt-1 text-sm text-red-600">{errors.app_key}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">App Secret</label>
                            <input 
                                type="password" 
                                value={data.app_secret} 
                                onChange={(e) => setData('app_secret', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                            {errors.app_secret && <p className="mt-1 text-sm text-red-600">{errors.app_secret}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input 
                                type="text" 
                                value={data.username} 
                                onChange={(e) => setData('username', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                value={data.password} 
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>
                    </>
                )}
            </div>

            <div className="mt-6 flex items-center justify-between bg-gray-50 p-4 rounded-md">
                <label className="flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                        checked={data.is_sandbox} 
                        onChange={(e) => setData('is_sandbox', e.target.checked)} 
                    />
                    <span className="ml-2 text-sm text-gray-700 font-medium">Sandbox (Test) Mode</span>
                </label>
                
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {processing ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </form>
    );
}

export default function Index({ gateways }) {
    return (
        <AdminLayout>
            <Head title="Payment Gateways" />

            <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between mb-8">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Payment Gateway Settings
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Configure your API keys and manage active payment methods for the public checkout.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {gateways.map((gateway) => (
                        <GatewayForm key={gateway.id} gateway={gateway} />
                    ))}
                    {gateways.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <p className="text-gray-500">No payment gateways found in the database. Please run the seeder.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
