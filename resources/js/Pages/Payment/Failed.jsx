import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import { XCircle } from 'lucide-react';

export default function Failed({ error_message }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Payment Failed" />

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10 text-center border-t-4 border-red-500">
                    <XCircle className="mx-auto h-16 w-16 text-red-500" />
                    
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Payment Failed
                    </h2>
                    
                    <p className="mt-4 text-sm text-gray-600">
                        Unfortunately, we could not process your payment at this time.
                    </p>

                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md text-sm text-left border border-red-100">
                        <strong>Reason:</strong> {error_message}
                    </div>

                    <div className="mt-8 flex gap-4 justify-center flex-col sm:flex-row">
                        <Link 
                            href={route('payment.checkout')}
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            Try Again
                        </Link>
                        <Link 
                            href={route('dashboard')}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
