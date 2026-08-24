import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Show({ order }) {
    return (
        <AdminLayout>
            <Head title={`Order #${order.order_number}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Order Details: {order.order_number}</h2>
                        <p>Phase C: Order details view.</p>
                        {/* Details would go here */}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
