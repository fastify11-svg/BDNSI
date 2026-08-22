import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function Success({ trx_id, amount }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Payment Successful" />

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                    
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Payment Successful!
                    </h2>
                    
                    <p className="mt-2 text-sm text-gray-600">
                        Thank you for your payment. Your transaction has been completed.
                    </p>

                    <div className="mt-6 bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-500 text-sm">Transaction ID</span>
                            <span className="font-mono font-medium text-sm">{trx_id}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-500 text-sm">Amount Paid</span>
                            <span className="font-bold">৳ {amount}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4 justify-center">
                        <Link 
                            href={route('dashboard')}
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
