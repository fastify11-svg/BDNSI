import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Index({ prices, centers }) {
    return (
        <AdminLayout>
            <Head title="Manage Prices" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Center Pricing & Products</h2>
                        <p>Phase C: Pricing engine is currently active on the backend.</p>
                        {/* Table would go here */}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
