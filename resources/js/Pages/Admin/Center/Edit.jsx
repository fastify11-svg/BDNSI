import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Edit({ center, divisions = [], districts = [], upazilas = [], teams = [] }) {
    const { errors } = usePage().props;

    const [form, setForm] = useState({
        code: center.code || '',
        name: center.name || '',
        owner_name: center.owner_name || '',
        fathers_name: center.fathers_name || '',
        mothers_name: center.mothers_name || '',
        religion: center.religion?.value ?? center.religion ?? 0,
        gender: center.gender?.value ?? center.gender ?? 0,
        nationality: center.nationality || 'Bangladeshi',
        division: center.division || 1,
        district: center.district || 1,
        upazilla: center.upazilla || 1,
        post_office: center.post_office || '',
        address: center.address || '',
        mobile: center.mobile || center.phone || '',
        email: center.email || '',
        status: center.status?.value ?? center.status ?? 1,
        team_id: center.team_id || '',
        password: '',
        password_confirmation: '',
        credit_enabled: center.credit_enabled ?? false,
        credit_limit: center.credit_limit || 0,
        allow_result_without_payment: center.allow_result_without_payment ?? false,
        allow_registration_without_payment: center.allow_registration_without_payment ?? false,
        allow_certificate_without_payment: center.allow_certificate_without_payment ?? false,
        auto_restriction: center.auto_restriction ?? true,
    });

    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.keys(form).forEach(key => {
            if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
                formData.append(key, form[key]);
            }
        });

        Inertia.post(getUrl(`/admin/center/${center.id}`), formData, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AdminLayout title={`Edit Center - ${center.name}`}>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                    <div>
                        <Link
                            href={getUrl('/admin/center')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-1 transition-colors"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            <span>Back to Center Directory</span>
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Edit Center Details #{center.code || center.id}</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Update center parameters, login credentials, and contact details.</p>
                    </div>

                    <Link
                        href={getUrl(`/admin/center/${center.id}`)}
                        className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-extrabold px-4 py-2 rounded-xl text-xs border border-indigo-200 transition flex items-center gap-2"
                    >
                        <i className="fa-solid fa-eye"></i>
                        <span>View Full Profile</span>
                    </Link>
                </div>

                {/* Form Container */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden divide-y divide-slate-100">

                    {/* Section 1: Basic Info */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <i className="fa-solid fa-building-columns text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">1. Center & Director Credentials</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                            {/* Code */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Center Code <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.code}
                                    onChange={e => setForm({ ...form, code: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                                {errors.code && <p className="text-rose-500 text-[11px] mt-1">{errors.code}</p>}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Institute / Center Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                                {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
                            </div>

                            {/* Owner */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Director / Owner Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.owner_name}
                                    onChange={e => setForm({ ...form, owner_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                            </div>

                            {/* Father's Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Father's Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.fathers_name}
                                    onChange={e => setForm({ ...form, fathers_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                            </div>

                            {/* Mother's Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Mother's Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.mothers_name}
                                    onChange={e => setForm({ ...form, mothers_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                            </div>

                            {/* Mobile */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Mobile Phone <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.mobile}
                                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Center Status <span className="text-rose-500">*</span></label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition font-bold"
                                    required
                                >
                                    <option value="1">Approved</option>
                                    <option value="0">Pending</option>
                                    <option value="2">Suspended</option>
                                </select>
                            </div>

                            {/* Team Member */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Managed By (Team Member)</label>
                                <select
                                    value={form.team_id}
                                    onChange={e => setForm({ ...form, team_id: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                >
                                    <option value="">-- None --</option>
                                    {teams.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Address <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Reset Portal Password */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <i className="fa-solid fa-key text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">2. Portal Login Password Reset (Optional)</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">New Portal Password</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    placeholder="Leave empty to keep current password"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={form.password_confirmation}
                                    onChange={e => setForm({ ...form, password_confirmation: e.target.value })}
                                    placeholder="Confirm new password"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Financial & Credit Setup */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <i className="fa-solid fa-money-bill-transfer text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">3. Financial & Credit Setup (Phase C)</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                            <div className="flex items-center gap-3 mt-4 border p-3 rounded-lg bg-slate-50">
                                <input
                                    type="checkbox"
                                    id="credit_enabled"
                                    checked={form.credit_enabled}
                                    onChange={e => setForm({ ...form, credit_enabled: e.target.checked })}
                                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <label htmlFor="credit_enabled" className="text-slate-700 font-bold cursor-pointer">Enable Credit System</label>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Credit Limit (BDT)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.credit_limit}
                                    onChange={e => setForm({ ...form, credit_limit: e.target.value })}
                                    disabled={!form.credit_enabled}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition disabled:opacity-50"
                                />
                            </div>

                            <div className="flex items-center gap-3 mt-4 border p-3 rounded-lg bg-slate-50">
                                <input
                                    type="checkbox"
                                    id="allow_result"
                                    checked={form.allow_result_without_payment}
                                    onChange={e => setForm({ ...form, allow_result_without_payment: e.target.checked })}
                                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <label htmlFor="allow_result" className="text-slate-700 font-bold cursor-pointer">Allow Result Publish Without Payment</label>
                            </div>

                            <div className="flex items-center gap-3 mt-4 border p-3 rounded-lg bg-slate-50">
                                <input
                                    type="checkbox"
                                    id="allow_registration"
                                    checked={form.allow_registration_without_payment}
                                    onChange={e => setForm({ ...form, allow_registration_without_payment: e.target.checked })}
                                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <label htmlFor="allow_registration" className="text-slate-700 font-bold cursor-pointer">Allow Student Registration Without Payment</label>
                            </div>

                            <div className="flex items-center gap-3 mt-4 border p-3 rounded-lg bg-slate-50">
                                <input
                                    type="checkbox"
                                    id="allow_certificate"
                                    checked={form.allow_certificate_without_payment}
                                    onChange={e => setForm({ ...form, allow_certificate_without_payment: e.target.checked })}
                                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <label htmlFor="allow_certificate" className="text-slate-700 font-bold cursor-pointer">Allow Certificate Download Without Payment</label>
                            </div>

                            <div className="flex items-center gap-3 mt-4 border p-3 rounded-lg bg-slate-50">
                                <input
                                    type="checkbox"
                                    id="auto_restriction"
                                    checked={form.auto_restriction}
                                    onChange={e => setForm({ ...form, auto_restriction: e.target.checked })}
                                    className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                />
                                <label htmlFor="auto_restriction" className="text-slate-700 font-bold cursor-pointer">Auto Restrict Services if Overdue</label>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-6 bg-slate-50 flex items-center justify-between">
                        <Link
                            href={getUrl('/admin/center')}
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    <span>Updating Center...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    <span>Update Center Details</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
