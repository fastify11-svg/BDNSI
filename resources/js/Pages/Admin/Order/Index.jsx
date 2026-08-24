import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Index({ orders }) {
    return (
        <AdminLayout>
            <Head title="Orders & Billing" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Orders & B2B Billing</h2>
                        <p>Phase C: Order engine is currently active on the backend.</p>
                        {/* Table would go here */}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
