import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/inertia-react';
import moment from 'moment';

export default function Show({ order }) {
    return (
        <AdminLayout>
            <Head title={`Order #${order.order_number}`} />
            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Order Details</h2>
                        <Link href={route('admin.orders.index')} className="text-indigo-600 hover:text-indigo-900">
                            &larr; Back to Orders
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Order Info</h3>
                            <p><span className="text-gray-500">Order Number:</span> <span className="font-medium text-gray-900">#{order.order_number}</span></p>
                            <p><span className="text-gray-500">Date:</span> {moment(order.created_at).format('DD MMM YYYY, h:mm A')}</p>
                            <p><span className="text-gray-500">Status:</span> 
                                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {order.status}
                                </span>
                            </p>
                            <p><span className="text-gray-500">Payment:</span> 
                                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.payment_status === 'Paid' ? 'bg-green-100 text-green-800' : (order.payment_status === 'Partial' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800')}`}>
                                    {order.payment_status}
                                </span>
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Center Info</h3>
                            <p><span className="text-gray-500">Center Name:</span> {order.center?.name}</p>
                            <p><span className="text-gray-500">Center Code:</span> <span className="font-medium text-indigo-600">{order.center?.code}</span></p>
                            <p><span className="text-gray-500">Director:</span> {order.center?.director_name}</p>
                            <p><span className="text-gray-500">Current Due:</span> <span className="font-bold text-red-500">৳{order.center?.current_due}</span></p>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">Order Items</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Description</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items && order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{item.product_type}</div>
                                                <div className="text-xs text-gray-500">Ref: {item.reference_id}</div>
                                            </td>
                                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right">৳{parseFloat(item.unit_price).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right text-red-500">-৳{parseFloat(item.discount).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right font-medium">৳{parseFloat(item.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50 font-bold">
                                        <td colSpan="4" className="px-4 py-3 text-right text-gray-700">Grand Total</td>
                                        <td className="px-4 py-3 text-right text-green-600">৳{parseFloat(order.total_amount).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {order.transactions && order.transactions.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Linked Transactions</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trx ID</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gateway</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {order.transactions.map((trx) => (
                                            <tr key={trx.id}>
                                                <td className="px-4 py-2 font-mono text-xs">{trx.transaction_id}</td>
                                                <td className="px-4 py-2 text-sm">{trx.gateway}</td>
                                                <td className="px-4 py-2 text-right text-sm font-medium text-gray-900">৳{parseFloat(trx.amount).toFixed(2)}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${trx.status === 'VALID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {trx.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{moment(trx.created_at).format('DD MMM YYYY, h:mm A')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
