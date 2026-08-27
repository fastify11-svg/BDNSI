import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';
import SmartScanner from '../../../Components/SmartScanner';

export default function Create({
    centers = [],
    sessions = [],
    subjects = [],
    districts = [],
    upazilas = [],
    registration = '',
    roll = '',
    genders = [],
    religions = [],
    courseTypes = [],
    teams = []
}) {
    const { errors } = usePage().props;

    const [form, setForm] = useState({
        center_id: centers[0]?.id || '',
        name: '',
        roll: roll || '',
        registration: registration || '',
        passport: '',
        nid_or_birth: '',
        exam_date: '',
        result_publised: '',
        fathers_name: '',
        mothers_name: '',
        date_of_birth: '',
        gender: genders[0]?.value ?? 0,
        religion: religions[0]?.value ?? 0,
        district: '',
        present_address: '',
        permanent_address: '',
        phone: '',
        session_id: sessions[0]?.id || '',
        subject_id: subjects[0]?.id || '',
        team_id: '',
        course_type: 0,
        course_duration: 'Six Month',
        qualification: 'Ssc',
        status: 2, // Default Approved
        picture: null,
        paid_amount: 0,
        due_amount: 0,
        payment_status: 1, // 1 = Paid, 0 = Unpaid
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [availableUpazilas, setAvailableUpazilas] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const handleDataExtracted = (data, rawText = '', file = null) => {
        if (file && !form.picture) {
            setTimeout(() => setImagePreview(URL.createObjectURL(file)), 0);
        }
        setForm(prev => {
            const updates = {
                name: data.name || prev.name,
                phone: data.phone || prev.phone,
                passport: data.passport || prev.passport,
                nid_or_birth: data.nid_or_birth || prev.nid_or_birth,
                registration: data.registration || prev.registration,
                date_of_birth: data.date_of_birth || prev.date_of_birth,
                gender: data.gender || prev.gender,
                fathers_name: data.fathers_name || prev.fathers_name,
                mothers_name: data.mothers_name || prev.mothers_name,
            };
            if (file && !prev.picture) {
                updates.picture = file;
            }

            let currentAvailableUpazilas = availableUpazilas;
            let matchedDist = null;

            if (data.district) {
                matchedDist = districts.find(d => d.name.toLowerCase().includes(data.district.toLowerCase()));
            } else if (rawText) {
                // Fallback: scan raw OCR text against all database districts
                matchedDist = districts.find(d => d.name.length > 3 && rawText.toLowerCase().includes(d.name.toLowerCase()));
            }

            if (matchedDist) {
                updates.district = matchedDist.id;
                updates.present_address = matchedDist.name;
                currentAvailableUpazilas = upazilas.filter(u => String(u.district_id) === String(matchedDist.id));
            }

            let matchedUpazila = null;
            if (data.upazila) {
                matchedUpazila = upazilas.find(u => u.name.toLowerCase().includes(data.upazila.toLowerCase()));
            } else if (rawText) {
                // Fallback: scan raw OCR text against upazilas (preferring upazilas in the matched district)
                if (matchedDist) {
                    matchedUpazila = currentAvailableUpazilas.find(u => u.name.length > 3 && rawText.toLowerCase().includes(u.name.toLowerCase()));
                }
                if (!matchedUpazila) {
                    matchedUpazila = upazilas.find(u => u.name.length > 3 && rawText.toLowerCase().includes(u.name.toLowerCase()));
                }
            }

            if (matchedUpazila) {
                updates.permanent_address = matchedUpazila.name;
                if (!updates.district && matchedUpazila.district_id) {
                    const parentDist = districts.find(d => String(d.id) === String(matchedUpazila.district_id));
                    if (parentDist) {
                        updates.district = parentDist.id;
                        updates.present_address = parentDist.name;
                        currentAvailableUpazilas = upazilas.filter(u => String(u.district_id) === String(parentDist.id));
                    }
                }
            }

            setTimeout(() => setAvailableUpazilas(currentAvailableUpazilas), 0);
            return { ...prev, ...updates };
        });
    };

    const handleDistrictChange = (e) => {
        const distId = e.target.value;
        const selectedDist = districts.find(d => String(d.id) === String(distId));
        const distName = selectedDist ? selectedDist.name : '';

        const filteredUpazilas = upazilas.filter(u => String(u.district_id) === String(distId));

        setForm(prev => ({
            ...prev,
            district: distId,
            present_address: distName,
            permanent_address: ''
        }));
        setAvailableUpazilas(filteredUpazilas);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, picture: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSessionChange = (e) => {
        const sessionId = e.target.value;
        const selectedSession = sessions.find(s => String(s.id) === String(sessionId));
        
        setForm(prev => ({
            ...prev,
            session_id: sessionId,
            course_type: selectedSession?.course_type ?? prev.course_type,
            course_duration: selectedSession?.course_duration_string ?? prev.course_duration,
            exam_date: selectedSession?.exam_date ?? prev.exam_date,
            result_publised: selectedSession?.result_published_date ?? prev.result_publised,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        let payload;
        if (form.picture instanceof File) {
            payload = new FormData();
            Object.keys(form).forEach(key => {
                if (form[key] !== null && form[key] !== undefined) {
                    payload.append(key, form[key]);
                }
            });
        } else {
            payload = form;
        }

        Inertia.post(getUrl('/admin/student'), payload, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AdminLayout title="Add New Student">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-xs border border-slate-200">
                    <div>
                        <Link
                            href={getUrl('/admin/student')}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#7024A8] mb-1 transition-colors"
                        >
                            <i className="fa-solid fa-arrow-left"></i>
                            <span>Back to Student Directory</span>
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New Student Registration</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Fill out student credentials, course selection, and registration details.</p>
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-6 items-start">
                    {/* Left: Smart Scanner */}
                    <div className="w-full xl:w-[400px] shrink-0">
                        <SmartScanner onDataExtracted={handleDataExtracted} />
                    </div>

                    {/* Right: Form Container */}
                    <div className="w-full xl:w-[calc(100%-400px-1.5rem)]">
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
                                    name="center_id"
                                    value={form.center_id}
                                    onChange={e => setForm(prev => ({ ...prev, center_id: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="">Select Center</option>
                                    {centers.map(c => (
                                        <option key={c.id} value={c.id}>[{c.code}] {c.name}</option>
                                    ))}
                                </select>
                                {errors.center_id && <p className="text-rose-500 text-[11px] mt-1">{errors.center_id}</p>}
                            </div>

                            {/* Session */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Academic Session <span className="text-rose-500">*</span></label>
                                <select name="session_id" value={form.session_id}
                                    onChange={handleSessionChange}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="">Select Session</option>
                                    {sessions.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {errors.session_id && <p className="text-rose-500 text-[11px] mt-1">{errors.session_id}</p>}
                            </div>

                            {/* Subject / Course */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Course Name <span className="text-rose-500">*</span></label>
                                <select name="subject_id" value={form.subject_id}
                                    onChange={e => setForm(prev => ({ ...prev, subject_id: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="">Select Course</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {errors.subject_id && <p className="text-rose-500 text-[11px] mt-1">{errors.subject_id}</p>}
                            </div>

                            {/* Team Member (Referred By) */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Referred By (Team Member)</label>
                                <select name="team_id" value={form.team_id}
                                    onChange={e => setForm(prev => ({ ...prev, team_id: e.target.value }))}
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
                                <select name="course_type" value={form.course_type}
                                    onChange={e => setForm(prev => ({ ...prev, course_type: e.target.value }))}
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
                                <select name="course_duration" value={form.course_duration}
                                    onChange={e => setForm(prev => ({ ...prev, course_duration: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="Two Months">Two Months</option>
                                    <option value="Three Months">Three Months</option>
                                    <option value="Six Months">Six Months</option>
                                    <option value="One Year">One Year</option>
                                    <option value="Two Years">Two Years</option>
                                    <option value="Three Years">Three Years</option>
                                    <option value="Four Years">Four Years</option>
                                </select>
                            </div>

                            {/* Qualification */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Qualification <span className="text-rose-500">*</span></label>
                                <select name="qualification" value={form.qualification}
                                    onChange={e => setForm(prev => ({ ...prev, qualification: e.target.value }))}
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

                            {/* Exam Date */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Exam Date</label>
                                <input name="exam_date"
                                    type="date"
                                    value={form.exam_date}
                                    onChange={e => setForm(prev => ({ ...prev, exam_date: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    placeholder="Auto-generated if empty"
                                />
                            </div>

                            {/* Result Published */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Result Published</label>
                                <input name="result_publised"
                                    type="date"
                                    value={form.result_publised}
                                    onChange={e => setForm(prev => ({ ...prev, result_publised: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    placeholder="Auto-generated if empty"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Personal Information */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-[#7024A8]">
                            <i className="fa-solid fa-user-gear text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">2. Personal Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                            {/* Student Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Student Full Name <span className="text-rose-500">*</span></label>
                                <input name="name" type="text" value={form.name}
                                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter full name"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                />
                                {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
                            </div>

                            {/* Roll Number */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Roll Number</label>
                                <input name="roll"
                                    type="text"
                                    value={form.roll}
                                    onChange={e => setForm(prev => ({ ...prev, roll: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    placeholder="Auto-generated if empty"
                                />
                            </div>

                            {/* Registration Number */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Registration Number</label>
                                <input name="registration"
                                    type="text"
                                    value={form.registration}
                                    onChange={e => setForm(prev => ({ ...prev, registration: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    placeholder="Auto-generated if empty"
                                />
                            </div>

                            {/* Passport */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Passport</label>
                                <input name="passport"
                                    type="text"
                                    value={form.passport}
                                    onChange={e => setForm(prev => ({ ...prev, passport: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    placeholder="Passport No"
                                />
                            </div>

                            {/* NID / Birth No */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">NID / Birth NO</label>
                                <input name="nid_or_birth" type="text" value={form.nid_or_birth}
                                    onChange={e => setForm(prev => ({ ...prev, nid_or_birth: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    placeholder="NID or Birth Reg No"
                                />
                            </div>

                            {/* Father's Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Father's Name <span className="text-rose-500">*</span></label>
                                <input name="fathers_name" type="text" value={form.fathers_name}
                                    onChange={e => setForm(prev => ({ ...prev, fathers_name: e.target.value }))}
                                    placeholder="Father's name"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                />
                            </div>

                            {/* Mother's Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Mother's Name <span className="text-rose-500">*</span></label>
                                <input name="mothers_name" type="text" value={form.mothers_name}
                                    onChange={e => setForm(prev => ({ ...prev, mothers_name: e.target.value }))}
                                    placeholder="Mother's name"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                />
                            </div>

                            {/* Mobile Phone */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Mobile Number (11 Digits) <span className="text-rose-500">*</span></label>
                                <input name="phone"
                                    type="text"
                                    value={form.phone}
                                    onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="01700000000"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                />
                                {errors.phone && <p className="text-rose-500 text-[11px] mt-1">{errors.phone}</p>}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Date of Birth</label>
                                <input name="date_of_birth" type="date" value={form.date_of_birth}
                                    onChange={e => setForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Gender <span className="text-rose-500">*</span></label>
                                <select name="gender" value={form.gender}
                                    onChange={e => setForm(prev => ({ ...prev, gender: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="0">Male</option>
                                    <option value="1">Female</option>
                                    <option value="2">Other</option>
                                </select>
                            </div>

                            {/* Religion */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Religion <span className="text-rose-500">*</span></label>
                                <select name="religion" value={form.religion}
                                    onChange={e => setForm(prev => ({ ...prev, religion: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="0">Islam</option>
                                    <option value="1">Hinduism</option>
                                    <option value="2">Buddhism</option>
                                    <option value="3">Christianity</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Location / Address */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-[#7024A8]">
                            <i className="fa-solid fa-location-dot text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">3. District & Upazila Address</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                            {/* District */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">District <span className="text-rose-500">*</span></label>
                                <select name="district" value={form.district}
                                    onChange={handleDistrictChange}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="">Select District</option>
                                    {districts.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Thana/Police Station */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Thana/Police Station <span className="text-rose-500">*</span></label>
                                <select name="permanent_address" value={form.permanent_address}
                                    onChange={e => setForm(prev => ({ ...prev, permanent_address: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                    required
                                >
                                    <option value="">Select Upazila</option>
                                    {availableUpazilas.map(u => (
                                        <option key={u.id} value={u.name}>{u.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Photo & Status */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-[#7024A8]">
                            <i className="fa-solid fa-camera text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">4. Student Photo & Account Status</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs font-medium items-start">
                            {/* Account Status */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Approval Status <span className="text-rose-500">*</span></label>
                                <select name="status" value={form.status}
                                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                >
                                    <option value="2">Approved</option>
                                    <option value="1">Pending</option>
                                    <option value="0">Rejected</option>
                                </select>
                            </div>

                            {/* Payment Status */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Payment Status <span className="text-rose-500">*</span></label>
                                <select name="payment_status" value={form.payment_status}
                                    onChange={e => setForm(prev => ({ ...prev, payment_status: e.target.value }))}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition"
                                >
                                    <option value="1">Paid</option>
                                    <option value="0">Unpaid</option>
                                </select>
                            </div>

                            {/* Photo Upload */}
                            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 w-full">
                                    <label className="block text-slate-700 font-bold mb-1">Student Picture <span className="text-rose-500">*</span></label>
                                    <input
                                        id="student_picture_input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-purple-50 file:text-[#7024A8] hover:file:bg-purple-100 transition"
                                    />
                                    {errors.picture && <p className="text-rose-500 text-[11px] mt-1">{errors.picture}</p>}
                                </div>
                                {/* Image Preview */}
                                <div className="flex-shrink-0 mt-4 md:mt-0">
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
                                    <span>Saving Student...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Save & Register Student</span>
                                </>
                            )}
                        </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
