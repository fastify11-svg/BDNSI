import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Edit({
    student,
    centers = [],
    sessions = [],
    subjects = [],
    districts = [],
    upazilas = [],
    genders = [],
    religions = [],
    courseTypes = [],
    statuses = {},
    teams = []
}) {
    const { errors } = usePage().props;

    const [form, setForm] = useState({
        center_id: student.center_id || '',
        name: student.name || '',
        roll: student.roll || '',
        registration: student.registration || '',
        passport: student.passport || '',
        fathers_name: student.fathers_name || '',
        mothers_name: student.mothers_name || '',
        date_of_birth: student.date_of_birth || '',
        gender: student.gender?.value ?? student.gender ?? 0,
        religion: student.religion?.value ?? student.religion ?? 0,
        district: '',
        present_address: student.present_address || '',
        permanent_address: student.permanent_address || '',
        phone: student.phone || '',
        session_id: student.session_id || '',
        subject_id: student.subject_id || '',
        course_type: student.course_type?.value ?? student.course_type ?? 0,
        course_duration: student.course_duration || 'Six Month',
        qualification: student.qualification || 'Ssc',
        status: student.status?.value ?? student.status ?? 2,
        exam_date: student.exam_date || '',
        result_publised: student.result_publised || '',
        paid_amount: student.paid_amount || 0,
        due_amount: student.due_amount || 0,
        payment_status: student.payment_status ?? 1,
        team_id: student.team_id || '',
        picture: null,
    });

    const [imagePreview, setImagePreview] = useState(
        student.picture || student.photo ? getUrl(student.picture || student.photo) : null
    );
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, picture: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        Object.keys(form).forEach(key => {
            if (form[key] !== null && form[key] !== undefined) {
                formData.append(key, form[key]);
            }
        });

        Inertia.post(getUrl(`/admin/student/${student.id}`), formData, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AdminLayout title="Edit Student Profile">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                    <div>
                        <Link
                            href={getUrl('/admin/student')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#7024A8] mb-1 transition-colors"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            <span>Back to Student Directory</span>
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Edit Student Profile #{student.id}</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Update student registration parameters, academic course info, and payment records.</p>
                    </div>

                    <a
                        href={getUrl(`/admin/student/${student.id}`)}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-purple-50 text-[#7024A8] hover:bg-purple-100 font-extrabold px-4 py-2 rounded-xl text-xs border border-purple-200 transition flex items-center gap-2"
                    >
                        <i className="fa-solid fa-eye"></i>
                        <span>View Full Profile</span>
                    </a>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden divide-y divide-slate-100">

                    {/* Section 1: Institute & Course Selection */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-[#7024A8]">
                            <i className="fa-solid fa-graduation-cap text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">1. Institute & Course Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                            {/* Center */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Institute / Center <span className="text-rose-500">*</span></label>
                                <select
                                    value={form.center_id}
                                    onChange={e => setForm({ ...form, center_id: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    {centers.map(c => (
                                        <option key={c.id} value={c.id}>[{c.code}] {c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Session */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Academic Session <span className="text-rose-500">*</span></label>
                                <select
                                    value={form.session_id}
                                    onChange={e => setForm({ ...form, session_id: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    {sessions.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject / Course */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Course Name <span className="text-rose-500">*</span></label>
                                <select
                                    value={form.subject_id}
                                    onChange={e => setForm({ ...form, subject_id: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Team Member (Referred By) */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Referred By (Team Member)</label>
                                <select
                                    value={form.team_id}
                                    onChange={e => setForm({ ...form, team_id: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                >
                                    <option value="">-- None --</option>
                                    {teams.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Course Type */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Course Type <span className="text-rose-500">*</span></label>
                                <select
                                    value={form.course_type}
                                    onChange={e => setForm({ ...form, course_type: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="0">Regular</option>
                                    <option value="1">Short Course</option>
                                    <option value="2">Diploma</option>
                                </select>
                            </div>

                            {/* Course Duration */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Course Duration <span className="text-rose-500">*</span></label>
                                <select
                                    value={form.course_duration}
                                    onChange={e => setForm({ ...form, course_duration: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="Two Month">Two Month</option>
                                    <option value="Three Month">Three Month</option>
                                    <option value="Six Month">Six Month</option>
                                    <option value="One Years">One Years</option>
                                    <option value="Two Years">Two Years</option>
                                    <option value="Three Years">Three Years</option>
                                    <option value="Four Years">Four Years</option>
                                </select>
                            </div>

                            {/* Qualification */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Qualification <span className="text-rose-500">*</span></label>
                                <select
                                    value={form.qualification}
                                    onChange={e => setForm({ ...form, qualification: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="Psc">Psc</option>
                                    <option value="Jsc">Jsc</option>
                                    <option value="Ssc">Ssc</option>
                                    <option value="Hsc">Hsc</option>
                                    <option value="Hon's">Hon's</option>
                                    <option value="Master's">Master's</option>
                                    <option value="Diploma Engineering">Diploma Engineering</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Personal Info */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-[#7024A8]">
                            <i className="fa-solid fa-user-gear text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">2. Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                            {/* Student Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Student Full Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                />
                            </div>

                            {/* Roll Number */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Roll Number</label>
                                <input
                                    type="text"
                                    value={form.roll}
                                    onChange={e => setForm({ ...form, roll: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                />
                            </div>

                            {/* Registration Number */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Registration Number</label>
                                <input
                                    type="text"
                                    value={form.registration}
                                    onChange={e => setForm({ ...form, registration: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                />
                            </div>

                            {/* Father's Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Father's Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.fathers_name}
                                    onChange={e => setForm({ ...form, fathers_name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
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
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                />
                            </div>

                            {/* Mobile Phone */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Mobile Number</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                />
                            </div>

                            {/* Exam Date */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Exam Date (Custom Override)</label>
                                <input
                                    type="date"
                                    value={form.exam_date}
                                    onChange={e => setForm({ ...form, exam_date: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                />
                            </div>

                            {/* Result Published Date */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Result Published Date (Custom Override)</label>
                                <input
                                    type="date"
                                    value={form.result_publised}
                                    onChange={e => setForm({ ...form, result_publised: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Student Status <span className="text-rose-500">*</span></label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="2">Approved</option>
                                    <option value="0">Pending</option>
                                    <option value="1">Requested</option>
                                    <option value="3">Hide</option>
                                </select>
                            </div>

                            {/* Payment Status */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Payment Status <span className="text-rose-500">*</span></label>
                                <select
                                    value={form.payment_status}
                                    onChange={e => setForm({ ...form, payment_status: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                >
                                    <option value="1">Paid</option>
                                    <option value="0">Unpaid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Photo Upload */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-[#7024A8]">
                            <i className="fa-solid fa-camera text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">3. Profile Picture Update</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-medium items-center">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-slate-700 font-bold mb-1">Change Picture (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-purple-50 file:text-[#7024A8] hover:file:bg-purple-100 transition"
                                />
                            </div>

                            <div className="flex justify-center md:justify-end">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-[#7024A8] shadow-xs" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-6 bg-slate-50 flex items-center justify-between">
                        <Link
                            href={getUrl('/admin/student')}
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 transition"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-[#7024A8] hover:bg-purple-800 text-white font-extrabold rounded-xl text-xs shadow-md transition flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    <span>Updating Student...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    <span>Update Student Profile</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
