import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/inertia-react';
import CenterLayout from '../../../Layouts/CenterLayout';
import { getUrl } from '../../../utils/urlHelper';
import SmartScanner from '../../../Components/SmartScanner';

export default function Create({ sessions = [], subjects = [], districts = [], upazilas = {} }) {
    const { app_url } = usePage().props;

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        fathers_name: '',
        mothers_name: '',
        date_of_birth: '',
        gender: '1',
        religion: '1',
        district_id: '',
        upazila_id: '',
        present_address: 'Dhaka',
        permanent_address: 'Dhaka',
        passport: '',
        phone: '',
        session_id: sessions[0]?.id || '',
        subject_id: subjects[0]?.id || '',
        course_type: '1',
        course_duration: '6 Months',
        picture: null,
        payment_method: 'pay_now',
    });

    const handleDataExtracted = (data, rawText = '', file = null) => {
        setData(prev => {
            const updates = {
                ...prev,
                name: data.name || prev.name,
                phone: data.phone || prev.phone,
                passport: data.passport || prev.passport,
                nid_or_birth: data.nid_or_birth || prev.nid_or_birth,
                date_of_birth: data.date_of_birth || prev.date_of_birth,
            };
            if (file && !prev.picture) {
                updates.picture = file;
            }
            return updates;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(getUrl('/student'), {
            onSuccess: () => reset()
        });
    };

    return (
        <CenterLayout title="Add Registration">
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Top Header Title & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        Add Registration
                    </h1>
                    <Link
                        href={getUrl('/student')}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs shadow-sm border border-slate-200 transition"
                    >
                        Student List
                    </Link>
                </div>

                </div>

                <div className="flex flex-col xl:flex-row gap-6 items-start">
                    {/* Left: Smart Scanner */}
                    <div className="w-full xl:w-[350px] shrink-0">
                        <SmartScanner onDataExtracted={handleDataExtracted} />
                    </div>

                    {/* Right: Form Body Card */}
                    <div className="w-full xl:w-[calc(100%-350px-1.5rem)] bg-[#F8F6F1] rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                            {/* Row 1 */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="Full Student Name"
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                />
                                {errors.name && <p className="text-rose-600 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Father's Name *</label>
                                <input
                                    type="text"
                                    value={data.fathers_name}
                                    onChange={(e) => setData('fathers_name', e.target.value)}
                                    required
                                    placeholder="Father's Full Name"
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                />
                                {errors.fathers_name && <p className="text-rose-600 mt-1">{errors.fathers_name}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Mother's Name *</label>
                                <input
                                    type="text"
                                    value={data.mothers_name}
                                    onChange={(e) => setData('mothers_name', e.target.value)}
                                    required
                                    placeholder="Mother's Full Name"
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                />
                                {errors.mothers_name && <p className="text-rose-600 mt-1">{errors.mothers_name}</p>}
                            </div>

                            {/* Row 2 */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Date of Birth *</label>
                                <input
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                />
                                {errors.date_of_birth && <p className="text-rose-600 mt-1">{errors.date_of_birth}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Gender *</label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                >
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                    <option value="3">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Religion *</label>
                                <select
                                    value={data.religion}
                                    onChange={(e) => setData('religion', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                >
                                    <option value="1">Muslim</option>
                                    <option value="2">Hindu</option>
                                    <option value="3">Christian</option>
                                    <option value="4">Buddhist</option>
                                    <option value="5">Others</option>
                                </select>
                            </div>

                            {/* Row 3 */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">District *</label>
                                <select
                                    value={data.district_id}
                                    onChange={(e) => setData('district_id', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                >
                                    <option value="">Select district</option>
                                    {Array.isArray(districts) && districts.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Upazila *</label>
                                <input
                                    type="text"
                                    value={data.upazila_id}
                                    onChange={(e) => setData('upazila_id', e.target.value)}
                                    placeholder="Enter upazila name"
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Passport</label>
                                <input
                                    type="text"
                                    value={data.passport}
                                    onChange={(e) => setData('passport', e.target.value)}
                                    placeholder="Passport Number (Optional)"
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                />
                            </div>

                            {/* Row 4 */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Mobile No *</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                    placeholder="017XXXXXXXX"
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                />
                                {errors.phone && <p className="text-rose-600 mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Session *</label>
                                <select
                                    value={data.session_id}
                                    onChange={(e) => setData('session_id', e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                >
                                    <option value="">Select session</option>
                                    {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Course Name *</label>
                                <select
                                    value={data.subject_id}
                                    onChange={(e) => setData('subject_id', e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                >
                                    <option value="">Select course</option>
                                    {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                </select>
                            </div>

                            {/* Row 5 */}
                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Course Type *</label>
                                <select
                                    value={data.course_type}
                                    onChange={(e) => setData('course_type', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                >
                                    <option value="1">Certificate Course</option>
                                    <option value="2">Diploma Course</option>
                                    <option value="3">Short Course</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Course Duration *</label>
                                <select
                                    value={data.course_duration}
                                    onChange={(e) => setData('course_duration', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                >
                                    <option value="3 Months">3 Months</option>
                                    <option value="6 Months">6 Months</option>
                                    <option value="1 Year">1 Year</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1.5">Picture *</label>
                                <input
                                    type="file"
                                    onChange={(e) => setData('picture', e.target.files[0])}
                                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                />
                            </div>

                            <div className="md:col-span-3 border-t border-slate-200/80 pt-6 mt-4">
                                <h3 className="text-sm font-black text-slate-900 mb-4">Payment & Billing</h3>
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                    <div className="flex-1 w-full">
                                        <label className="block font-bold text-slate-700 mb-1.5">Payment Method *</label>
                                        <select
                                            value={data.payment_method}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                                        >
                                            <option value="pay_now">Pay Now via SSLCommerz / bKash</option>
                                            {usePage().props.auth?.user?.center?.credit_enabled && (
                                                <option value="credit">Pay later (Use Center Credit)</option>
                                            )}
                                        </select>
                                    </div>
                                    
                                    {usePage().props.auth?.user?.center?.credit_enabled && (
                                        <div className="text-right flex-shrink-0 bg-white px-4 py-2 rounded-lg border border-slate-200 w-full md:w-auto">
                                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Available Credit</p>
                                            <p className="text-lg font-black text-[#0F5233]">
                                                ৳{parseFloat(
                                                    Math.max(0, (usePage().props.auth?.user?.center?.credit_limit || 0) - (usePage().props.auth?.user?.center?.current_due || 0))
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {errors.payment_method && <p className="text-rose-600 mt-1">{errors.payment_method}</p>}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200/80">
                            <Link
                                href={getUrl('/student')}
                                className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition shadow-sm"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 bg-[#0F5233] hover:bg-[#0b3d26] text-white font-extrabold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </CenterLayout>
    );
}
