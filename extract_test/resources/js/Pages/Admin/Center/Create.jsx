import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Create({ divisions = [], districts = [], upazilas = [], teams = [] }) {
    const { errors } = usePage().props;

    const [form, setForm] = useState({
        name: '',
        owner_name: '',
        fathers_name: '',
        mothers_name: '',
        religion: 0,
        gender: 0,
        division: divisions[0]?.id || 1,
        district: '',
        upazilla: '',
        post_office: '',
        address: '',
        center_location: '',
        mobile: '',
        phone: '',
        email: '',
        team_id: '',
        center_logo: null,
        director_photo: null,
        director_signature: null,
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [filteredUpazilas, setFilteredUpazilas] = useState([]);

    const handleDivisionChange = (e) => {
        const divId = e.target.value;
        setForm(prev => ({ ...prev, division: divId, district: '', upazilla: '' }));

        const dists = Object.entries(districts)
            .filter(([id, d]) => String(d.division_id) === String(divId))
            .map(([id, d]) => ({ id, name: d.name }));

        setFilteredDistricts(dists);
        setFilteredUpazilas([]);
    };

    const handleDistrictChange = (e) => {
        const distId = e.target.value;
        setForm(prev => ({ ...prev, district: distId, upazilla: '' }));

        const upzs = Object.entries(upazilas)
            .filter(([id, u]) => String(u.district_id) === String(distId))
            .map(([id, u]) => ({ id, name: u.name }));

        setFilteredUpazilas(upzs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        Object.keys(form).forEach(key => {
            if (form[key] !== null && form[key] !== undefined) {
                formData.append(key, form[key]);
            }
        });

        Inertia.post(getUrl('/admin/center'), formData, {
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AdminLayout title="Add New Center">
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
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Add New Training Center / Branch</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Register a new affiliated technical training institute with portal credentials.</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden divide-y divide-slate-100">

                    {/* Section 1: Center & Owner Credentials */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <i className="fa-solid fa-building-columns text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">1. Institute & Ownership Credentials</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                            {/* Institute Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Institute / Center Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Full Institute Name"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                                {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
                            </div>

                            {/* Owner Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Director / Owner Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.owner_name}
                                    onChange={e => setForm({ ...form, owner_name: e.target.value })}
                                    placeholder="Director or Owner Name"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                                {errors.owner_name && <p className="text-rose-500 text-[11px] mt-1">{errors.owner_name}</p>}
                            </div>

                            {/* Father's Name */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Father's Name</label>
                                <input
                                    type="text"
                                    value={form.fathers_name}
                                    onChange={e => setForm({ ...form, fathers_name: e.target.value })}
                                    placeholder="Father's name"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                />
                            </div>

                            {/* Mobile Phone */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Mobile Phone (11 Digits) <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.mobile}
                                    onChange={e => setForm({ ...form, mobile: e.target.value, phone: e.target.value })}
                                    placeholder="01700000000"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                                {errors.mobile && <p className="text-rose-500 text-[11px] mt-1">{errors.mobile}</p>}
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Email Address <span className="text-rose-500">*</span></label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    placeholder="center@gmail.com"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                                {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Gender</label>
                                <select
                                    value={form.gender}
                                    onChange={e => setForm({ ...form, gender: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                >
                                    <option value="0">Male</option>
                                    <option value="1">Female</option>
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
                        </div>
                    </div>

                    {/* Section 2: Location & Address */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <i className="fa-solid fa-location-dot text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">2. Geographic Address</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                            {/* Division */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Division</label>
                                <select
                                    value={form.division}
                                    onChange={handleDivisionChange}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                >
                                    <option value="">Select Division</option>
                                    {divisions.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* District */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">District</label>
                                <select
                                    value={form.district}
                                    onChange={handleDistrictChange}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                >
                                    <option value="">Select District</option>
                                    {filteredDistricts.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Upazila */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Upazila</label>
                                <select
                                    value={form.upazilla}
                                    onChange={e => setForm({ ...form, upazilla: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                >
                                    <option value="">Select Upazila</option>
                                    {filteredUpazilas.map(u => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Center Location / Address */}
                            <div className="col-span-1 md:col-span-3">
                                <label className="block text-slate-700 font-bold mb-1">Detailed Center Address <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value, center_location: e.target.value })}
                                    placeholder="House, Road, Area, Market/Building Name"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: File Uploads */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-600">
                            <i className="fa-solid fa-[#0B1528] fa-file-arrow-up text-lg"></i>
                            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">3. Media & Document Uploads</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                            {/* Center Logo */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Center Logo <span className="text-rose-500">*</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setForm({ ...form, center_logo: file });
                                            setLogoPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
                                    required
                                />
                                {logoPreview && <img src={logoPreview} alt="Logo" className="mt-2 h-16 w-16 object-contain rounded-xl border p-1" />}
                            </div>

                            {/* Director Photo */}
                            <div>
                                <label className="block text-slate-700 font-bold mb-1">Director Photo <span className="text-rose-500">*</span></label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setForm({ ...form, director_photo: file });
                                            setPhotoPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
                                    required
                                />
                                {photoPreview && <img src={photoPreview} alt="Photo" className="mt-2 h-16 w-16 object-cover rounded-xl border p-1" />}
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
                                    <span>Registering Center...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-check"></i>
                                    <span>Save & Register Center</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
