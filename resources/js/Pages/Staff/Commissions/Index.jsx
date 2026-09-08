import React from 'react';
import AuthenticatedLayout from '@/Layouts/StaffLayout'; // Assuming StaffLayout exists, fallback to standard layout otherwise
import { Head } from '@inertiajs/inertia-react';
import Pagination from '@/Components/Pagination';

export default function Index({ auth, commissions, totals }) {
    // If no specific staff layout exists, just use standard wrapping div
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="My Commissions" />
            
            {/* Minimal Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        My Commissions (Phase L)
                    </h2>
                    <div className="text-gray-600">
                        {auth.staff?.name}
                    </div>
                </div>
            </header>

            <main className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                            <h4 className="text-gray-500 text-sm font-semibold uppercase">Pending/Earned</h4>
                            <p className="text-2xl font-bold text-gray-900">৳ {totals.earned || 0}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <h4 className="text-gray-500 text-sm font-semibold uppercase">Approved</h4>
                            <p className="text-2xl font-bold text-gray-900">৳ {totals.approved || 0}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                            <h4 className="text-gray-500 text-sm font-semibold uppercase">Total Paid</h4>
                            <p className="text-2xl font-bold text-gray-900">৳ {totals.paid || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Commission History</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {commissions.data.length === 0 ? (
                                        <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No commissions earned yet.</td></tr>
                                    ) : (
                                        commissions.data.map((comm) => (
                                            <tr key={comm.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(comm.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{comm.order?.order_number}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 py-1 rounded text-xs text-white ${comm.status === 'Earned' ? 'bg-yellow-500' : comm.status === 'Approved' ? 'bg-blue-500' : comm.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                        {comm.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">৳ {comm.amount}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4">
                            <Pagination links={commissions.links} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
