import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/inertia-react';

export default function FinancialIndex({ payments, stats, filters, auth }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        amount: '',
        purpose: 'certificate_sale',
        status: 'paid',
        payment_method: 'Cash',
        transaction_id: '',
        student_id: '',
        center_id: ''
    });

    const [showModal, setShowModal] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        router.get('/admin/financial', {
            ...filters,
            [name]: value
        }, { preserveState: true });
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post('/admin/financial', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const updateStatus = (paymentId, newStatus) => {
        router.put(`/admin/financial/${paymentId}`, {
            status: newStatus
        }, { preserveScroll: true });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Financial Tracking" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Financial Tracking</h2>
                    <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow">
                        + Log Manual Payment
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                        <p className="text-sm text-gray-500 font-semibold uppercase">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-800">৳ {stats.total_revenue}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500 font-semibold uppercase">Registration Fees</p>
                        <p className="text-2xl font-bold text-gray-800">৳ {stats.registration_revenue}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                        <p className="text-sm text-gray-500 font-semibold uppercase">Certificate Sales</p>
                        <p className="text-2xl font-bold text-gray-800">৳ {stats.certificate_revenue}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
                        <p className="text-sm text-gray-500 font-semibold uppercase">Pending Payments</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.pending_payments}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
                    <select name="purpose" value={filters.purpose || ''} onChange={handleFilterChange} className="border-gray-300 rounded-md shadow-sm">
                        <option value="">All Purposes</option>
                        <option value="registration_fee">Registration Fee</option>
                        <option value="certificate_sale">Certificate Sale</option>
                    </select>
                    <select name="status" value={filters.status || ''} onChange={handleFilterChange} className="border-gray-300 rounded-md shadow-sm">
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                {/* Payments Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method & TrxID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.data.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(payment.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.student ? `Student: ${payment.student.name}` : ''}
                                        {payment.center ? `Center: ${payment.center.name}` : ''}
                                        {!payment.student && !payment.center && 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{payment.purpose.replace('_', ' ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">৳ {payment.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.payment_method || 'N/A'}<br/>
                                        <span className="text-xs text-gray-400">{payment.transaction_id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                            {payment.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {payment.status === 'pending' && (
                                            <button onClick={() => updateStatus(payment.id, 'paid')} className="text-green-600 hover:text-green-900 mr-3">Mark Paid</button>
                                        )}
                                        {payment.status !== 'failed' && (
                                            <button onClick={() => updateStatus(payment.id, 'failed')} className="text-red-600 hover:text-red-900">Mark Failed</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {payments.data.length === 0 && (
                                <tr><td colSpan="7" className="px-6 py-4 text-center text-gray-500">No payments found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for manual payment log */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Log Manual Payment</h3>
                            <form onSubmit={submitPayment}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Amount (৳)</label>
                                    <input type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Purpose</label>
                                    <select value={data.purpose} onChange={e => setData('purpose', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="registration_fee">Registration Fee</option>
                                        <option value="certificate_sale">Certificate Sale</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                    <input type="text" value={data.payment_method} onChange={e => setData('payment_method', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Student ID (Optional)</label>
                                    <input type="number" value={data.student_id} onChange={e => setData('student_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div className="flex justify-end mt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="mr-2 px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Payment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
