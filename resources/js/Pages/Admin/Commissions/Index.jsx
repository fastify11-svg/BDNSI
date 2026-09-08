import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import Pagination from '@/Components/Pagination';

import { Inertia } from '@inertiajs/inertia';

export default function Index({ auth, commissions, agentSummaries, overallTotals }) {
    const [actionModal, setActionModal] = useState({ show: false, action: '', id: null, reason: '' });

    const handleAction = (e) => {
        e.preventDefault();
        const url = actionModal.action === 'approve' 
            ? `/admin/commissions/${actionModal.id}/approve`
            : actionModal.action === 'pay'
            ? `/admin/commissions/${actionModal.id}/pay`
            : `/admin/commissions/${actionModal.id}/reverse`;

        Inertia.post(url, { reason: actionModal.reason }, {
            onSuccess: () => setActionModal({ show: false, action: '', id: null, reason: '' })
        });
    };

    return (
        <AdminLayout user={auth.admin} title="Commissions (Phase L)">
            <Head title="Commissions" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Overall Platform Totals Banner */}
                    {overallTotals && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                                <p className="text-xs font-semibold uppercase text-yellow-600 mb-1">Total Earned (Pending)</p>
                                <p className="text-2xl font-bold text-yellow-700">৳ {overallTotals.earned}</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                <p className="text-xs font-semibold uppercase text-blue-600 mb-1">Total Approved (Payable)</p>
                                <p className="text-2xl font-bold text-blue-700">৳ {overallTotals.approved}</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                                <p className="text-xs font-semibold uppercase text-green-600 mb-1">Total Paid</p>
                                <p className="text-2xl font-bold text-green-700">৳ {overallTotals.paid}</p>
                            </div>
                        </div>
                    )}

                    {/* Agent Summaries Panel */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4">Agent Financial Summaries</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agentSummaries && agentSummaries.map((agent) => (
                                <div key={agent.team_id || 'unassigned'} className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-500">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-gray-800 font-bold text-lg">{agent.team_name}</h4>
                                        {agent.commission_rate && agent.commission_rate !== 'N/A' && (
                                            <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded">
                                                Rate: {agent.commission_rate}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Revenue Generated:</span>
                                            <span className="font-semibold text-gray-700">৳ {agent.total_revenue}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Earned (Pending):</span>
                                            <span className="font-semibold text-yellow-600">৳ {agent.earned}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Approved (Payable):</span>
                                            <span className="font-semibold text-blue-600">৳ {agent.approved}</span>
                                        </div>
                                        <div className="flex justify-between border-t mt-1 pt-1">
                                            <span className="text-gray-500">Total Remaining:</span>
                                            <span className="font-semibold text-red-600">৳ {agent.remaining}</span>
                                        </div>
                                        <div className="flex justify-between bg-green-50 p-1 mt-2 rounded">
                                            <span className="text-green-800 font-semibold">Total Paid:</span>
                                            <span className="font-bold text-green-700">৳ {agent.paid}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {agentSummaries && agentSummaries.length === 0 && (
                                <div className="col-span-full text-center py-4 bg-white rounded shadow text-gray-500">
                                    No commissions recorded yet.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Commission Transactions</h3>
                            <Link href="/admin/commission-policies" className="px-4 py-2 bg-blue-600 text-white rounded">
                                Manage Rules
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent (Team)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {commissions.data.map((comm) => (
                                        <tr key={comm.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comm.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{comm.team?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{comm.order?.order_number}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳{comm.calculated_revenue}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {comm.policy ? (comm.policy.type === 'percentage' ? comm.policy.value + '%' : '৳' + comm.policy.value + ' (fixed)') : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">৳{comm.amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded text-xs text-white ${comm.status === 'Earned' ? 'bg-yellow-500' : comm.status === 'Approved' ? 'bg-blue-500' : comm.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                    {comm.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                                {comm.status === 'Earned' && (
                                                    <button onClick={() => setActionModal({ show: true, action: 'approve', id: comm.id, reason: '' })} className="text-blue-600 hover:text-blue-900">Approve</button>
                                                )}
                                                {comm.status === 'Approved' && (
                                                    <button onClick={() => setActionModal({ show: true, action: 'pay', id: comm.id, reason: '' })} className="text-green-600 hover:text-green-900">Pay</button>
                                                )}
                                                {(comm.status === 'Earned' || comm.status === 'Approved' || comm.status === 'Paid') && (
                                                    <button onClick={() => setActionModal({ show: true, action: 'reverse', id: comm.id, reason: '' })} className="text-red-600 hover:text-red-900">Reverse</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={commissions.links} />
                    </div>
                </div>
            </div>

            {actionModal.show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-4 capitalize">{actionModal.action} Commission</h3>
                        <form onSubmit={handleAction}>
                            {actionModal.action === 'reverse' && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Reason for reversal</label>
                                    <input type="text" required value={actionModal.reason} onChange={e => setActionModal({...actionModal, reason: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                            )}
                            <p className="mb-4 text-sm text-gray-600">Are you sure you want to {actionModal.action} this commission record?</p>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setActionModal({ show: false, action: '', id: null, reason: '' })} className="px-4 py-2 bg-gray-200 text-gray-800 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded capitalize">Confirm {actionModal.action}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
