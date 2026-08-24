import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/inertia-react';
import StaffLayout from '../../../Layouts/StaffLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Create({ subjects, sessions, centers, divisions, districts, upazilas }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        fathers_name: '',
        mothers_name: '',
        date_of_birth: '',
        gender: 'Male',
        religion: 'Islam',
        phone: '',
        email: '',
        passport: '',
        present_address: '',
        permanent_address: '',
        session_id: sessions && sessions.length > 0 ? String(sessions[0].id) : '',
        subject_id: subjects && subjects.length > 0 ? String(subjects[0].id) : '',
        center_id: centers && centers.length > 0 ? String(centers[0].id) : '',
        picture: null,
    });

    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [previewImage, setPreviewImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('picture', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(getUrl('/staff/students'));
    };

    return (
        <StaffLayout title="New Student Admission">
            <Head title="Enroll Student" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900">Student Admission Form</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Enroll a new student under your staff account. Courses and sessions are strictly scoped to your customized catalog.
                        </p>
                    </div>
                    <Link
                        href={getUrl('/staff/students')}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                        &larr; Back to Student List
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
                    {/* Academic Scope Info Box */}
                    <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center text-lg shrink-0">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h4 className="font-extrabold text-purple-900">Decentralized Staff Scope Active</h4>
                            <p className="text-[11px] text-purple-700">
                                This admission will be tagged with your staff ID and populated with your customized fees & duration.
                            </p>
                        </div>
                    </div>

                    {/* Section 1: Academic Enrollment */}
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
                            1. Course & Session Selection
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">
                                    Select Course / Subject <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={data.subject_id}
                                    onChange={(e) => setData('subject_id', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:border-purple-500"
                                >
                                    {subjects && subjects.length > 0 ? (
                                        subjects.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name} (Fee: BDT {Number(sub.rate).toLocaleString()})
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No custom courses created yet</option>
                                    )}
                                </select>
                                {errors.subject_id && <p className="text-rose-500 mt-1 font-semibold">{errors.subject_id}</p>}
                            </div>

                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">
                                    Select Academic Session <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={data.session_id}
                                    onChange={(e) => setData('session_id', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 focus:border-purple-500"
                                >
                                    {sessions && sessions.length > 0 ? (
                                        sessions.map((sess) => (
                                            <option key={sess.id} value={sess.id}>
                                                {sess.name} ({sess.duration} Months)
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No active sessions created yet</option>
                                    )}
                                </select>
                                {errors.session_id && <p className="text-rose-500 mt-1 font-semibold">{errors.session_id}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Student Personal Information */}
                    <div className="space-y-4 pt-2">
                        <h3 className="font-black text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
                            2. Personal Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">
                                    Student Full Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Mohammad Rahim"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                />
                                {errors.name && <p className="text-rose-500 mt-1 font-semibold">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">
                                    Father's Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.fathers_name}
                                    onChange={(e) => setData('fathers_name', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">
                                    Mother's Name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.mothers_name}
                                    onChange={(e) => setData('mothers_name', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">Date of Birth</label>
                                <input
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">Gender</label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">Religion</label>
                                <select
                                    value={data.religion}
                                    onChange={(e) => setData('religion', e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                >
                                    <option value="Islam">Islam</option>
                                    <option value="Hinduism">Hinduism</option>
                                    <option value="Buddhism">Buddhism</option>
                                    <option value="Christianity">Christianity</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">
                                    Mobile Phone Number <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="01XXXXXXXXX"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 font-mono"
                                />
                                {errors.phone && <p className="text-rose-500 mt-1 font-semibold">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className="font-bold text-slate-700 block mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="student@example.com"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500"
                                />
                            </div>
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="font-bold text-slate-700 block mb-1.5">Student Photo (Optional)</label>
                            <div className="flex items-center gap-4">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                        <i className="fa-solid fa-camera text-xl"></i>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                        <Link
                            href={getUrl('/staff/students')}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/30 transition disabled:opacity-50"
                        >
                            {processing ? 'Enrolling Student...' : 'Complete Student Enrollment'}
                        </button>
                    </div>
                </form>
            </div>
        </StaffLayout>
    );
}
