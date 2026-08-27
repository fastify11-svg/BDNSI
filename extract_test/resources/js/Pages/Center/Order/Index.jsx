import React from 'react';
import CenterLayout from '@/Layouts/CenterLayout';
import { Head, Link } from '@inertiajs/inertia-react';
import moment from 'moment';

export default function Index({ orders }) {
    return (
        <CenterLayout title="Financial Orders">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                    <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                            B2B FINANCIAL LEDGER
                        </p>
                        <h2 className="text-xl font-black text-slate-900">
                            Order History
                        </h2>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Order No</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Total Amount</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {orders.data && orders.data.length === 0 ? (
                                    <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-400 font-medium">No orders found.</td></tr>
                                ) : (
                                    orders.data && orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                                                #{order.order_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-black text-slate-800">
                                                ৳{parseFloat(order.total_amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${order.payment_status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : (order.payment_status === 'Partial' ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800')}`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">
                                                {moment(order.created_at).format('DD MMM YYYY')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                                <Link href={route('center.orders.show', order.id)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                                    <span>Details</span>
                                                    <i className="fa-solid fa-arrow-right"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CenterLayout>
    );
}
