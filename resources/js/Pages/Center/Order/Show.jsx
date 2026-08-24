import React from 'react';
import CenterLayout from "@/Layouts/CenterLayout";
import { Head, Link } from '@inertiajs/inertia-react';
import moment from 'moment';

export default function Show({ order }) {
    return (
        <CenterLayout title={`Order #${order.order_number}`}>
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <div>
                        <Link href={route('center.orders.index')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
                            &larr; Back to Order History
                        </Link>
                        <h2 className="text-2xl font-black text-slate-900">
                            Invoice #{order.order_number}
                        </h2>
                    </div>
                    {order.payment_status !== 'Paid' && (
                        <button className="bg-[#D4A359] text-slate-900 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md hover:bg-[#c5954c] transition">
                            Pay Now via SSLCommerz
                        </button>
                    )}
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-slate-200 p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-slate-100 pb-8">
                        <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">BILLED TO</p>
                            <h3 className="text-lg font-black text-slate-900">{order.center?.name}</h3>
                            <p className="text-sm font-medium text-slate-500">Center Code: #{order.center?.code}</p>
                            <p className="text-sm text-slate-500 mt-1">{order.center?.address}</p>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">INVOICE DETAILS</p>
                            <p className="text-sm text-slate-600"><span className="font-bold">Invoice Date:</span> {moment(order.created_at).format('DD MMM YYYY')}</p>
                            <p className="text-sm text-slate-600"><span className="font-bold">Order Status:</span> <span className={`ml-1 font-bold ${order.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>{order.status}</span></p>
                            <p className="text-sm text-slate-600"><span className="font-bold">Payment Status:</span> <span className={`ml-1 font-bold ${order.payment_status === 'Paid' ? 'text-emerald-600' : 'text-rose-600'}`}>{order.payment_status}</span></p>
                        </div>
                    </div>

                    <div className="pt-8">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-wider">Description</th>
                                        <th className="px-4 py-3 text-center text-xs font-black text-slate-500 uppercase tracking-wider">Qty</th>
                                        <th className="px-4 py-3 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-4 py-3 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Discount</th>
                                        <th className="px-4 py-3 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {order.items && order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-4">
                                                <div className="font-bold text-slate-900">{item.product_type}</div>
                                                <div className="text-xs font-medium text-slate-400">Ref: {item.reference_id}</div>
                                            </td>
                                            <td className="px-4 py-4 text-center font-medium text-slate-700">{item.quantity}</td>
                                            <td className="px-4 py-4 text-right font-medium text-slate-700">৳{parseFloat(item.unit_price).toFixed(2)}</td>
                                            <td className="px-4 py-4 text-right font-medium text-rose-500">-৳{parseFloat(item.discount).toFixed(2)}</td>
                                            <td className="px-4 py-4 text-right font-black text-slate-900">৳{parseFloat(item.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8 mt-8 border-t border-slate-100">
                        <div className="w-full sm:w-1/2 lg:w-1/3 space-y-3">
                            <div className="flex justify-between text-sm font-bold text-slate-600">
                                <span>Subtotal:</span>
                                <span>৳{parseFloat(order.total_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-3">
                                <span>Total Payable:</span>
                                <span>৳{parseFloat(order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CenterLayout>
    );
}
