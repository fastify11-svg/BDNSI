import React from 'react';
import { Head, useForm } from '@inertiajs/inertia-react';
import AdminLayout from '@/Layouts/AdminLayout';

const GatewayForm = ({ gateway }) => {
    const { data, setData, put, processing, errors } = useForm({
        provider_name: gateway.provider_name || '',
        base_url: gateway.base_url || '',
        api_key: gateway.api_key || '',
        secret_key: gateway.secret_key || '',
        sender_id: gateway.sender_id || '',
        is_active: gateway.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.sms-gateway.update', gateway.id), {
            preserveScroll: true
        });
    };

    return (
        <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">{gateway.provider_name} Configuration</h3>
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
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Base URL (API Endpoint)</label>
                    <input 
                        type="url" 
                        value={data.base_url} 
                        onChange={(e) => setData('base_url', e.target.value)}
                        placeholder="http://apismpp.revesms.com/sendtext"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                    />
                    {errors.base_url && <p className="mt-1 text-sm text-red-600">{errors.base_url}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">API Key</label>
                    <input 
                        type="text" 
                        value={data.api_key} 
                        onChange={(e) => setData('api_key', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                    />
                    {errors.api_key && <p className="mt-1 text-sm text-red-600">{errors.api_key}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Secret Key (Optional)</label>
                    <input 
                        type="password" 
                        value={data.secret_key} 
                        onChange={(e) => setData('secret_key', e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                    />
                    {errors.secret_key && <p className="mt-1 text-sm text-red-600">{errors.secret_key}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Sender ID (Masking)</label>
                    <input 
                        type="text" 
                        value={data.sender_id} 
                        onChange={(e) => setData('sender_id', e.target.value)}
                        placeholder="YTTC"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                    />
                    {errors.sender_id && <p className="mt-1 text-sm text-red-600">{errors.sender_id}</p>}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">
                    <i className="fa-solid fa-circle-info mr-2"></i>
                    Only one SMS gateway can be active at a time.
                </p>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                >
                    {processing ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>
        </form>
    );
};

export default function Index({ gateways }) {
    return (
        <AdminLayout title="SMS Gateways Settings">
            <Head title="SMS Gateways Settings" />

            <div className="max-w-7xl mx-auto py-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">SMS Configuration</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your SMS gateway credentials here. All outbound notifications will use the active provider.
                    </p>
                </div>

                {gateways && gateways.length > 0 ? (
                    gateways.map(gateway => (
                        <GatewayForm key={gateway.id} gateway={gateway} />
                    ))
                ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                        <p className="text-gray-500">No SMS gateways found. Please run the database seeder.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
