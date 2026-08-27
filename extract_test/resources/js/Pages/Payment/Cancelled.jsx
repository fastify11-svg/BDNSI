import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';
import { AlertTriangle } from 'lucide-react';

export default function Cancelled({ message }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head title="Payment Cancelled" />

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10 text-center border-t-4 border-yellow-400">
                    <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
                    
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Payment Cancelled
                    </h2>
                    
                    <p className="mt-4 text-sm text-gray-600">
                        {message}
                    </p>

                    <div className="mt-8 flex justify-center">
                        <Link 
                            href={route('dashboard')}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
