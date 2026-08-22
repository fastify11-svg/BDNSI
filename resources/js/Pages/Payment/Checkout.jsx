import React from 'react';
import { Head, useForm } from '@inertiajs/inertia-react';
import { CreditCard, Wallet } from 'lucide-react';

export default function Checkout({ amount, purpose, gateways }) {
    const { data, setData, post, processing } = useForm({
        gateway: gateways?.length > 0 ? gateways[0].slug : '',
        amount: amount,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('payment.process'));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Checkout" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Secure Checkout
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Complete your payment for <span className="font-medium text-indigo-600">{purpose}</span>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={submit}>
                        <div>
                            <div className="flex justify-between items-center py-4 border-b">
                                <span className="text-gray-500 font-medium">Amount to Pay</span>
                                <span className="text-2xl font-bold text-gray-900">৳ {amount}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
                            {gateways?.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {gateways.map((gw) => (
                                        <div 
                                            key={gw.id}
                                            className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center transition-all ${data.gateway === gw.slug ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-300'}`}
                                            onClick={() => setData('gateway', gw.slug)}
                                        >
                                            {gw.slug === 'sslcommerz' ? <CreditCard className="w-8 h-8 mb-2" /> : <Wallet className="w-8 h-8 mb-2" />}
                                            <span className="font-medium text-sm text-center">{gw.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md text-sm">
                                    No payment methods are currently active. Please contact administration.
                                </div>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing || !gateways || gateways.length === 0}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                            >
                                {processing ? 'Processing...' : `Pay ৳ ${amount}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
