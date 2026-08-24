import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/inertia-react';
import FrontendLayout from '../../Layouts/FrontendLayout';
import { getUrl } from '../../utils/urlHelper';

export default function Create({ divisions = [], districts = {}, upazilas = {} }) {
    const [logoPreview, setLogoPreview] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [sigPreview, setSigPreview] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Strictly 9 required fields ONLY as per specification
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        owner_name: '',
        center_location: '',
        address: '',
        mobile: '',
        email: '',
        center_logo: null,
        director_photo: null,
        director_signature: null,
        division: '',
        district: '',
        upazilla: '',
    });

    const handleFileChange = (e, field, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage('');

        post(getUrl('/center-request'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setLogoPreview(null);
                setPhotoPreview(null);
                setSigPreview(null);
                setSuccessMessage('Your center authorization request application has been submitted successfully! We will review and contact you shortly.');
            }
        });
    };

    const districtsArray = Object.entries(districts).map(([id, dist]) => ({ id, ...dist }));
    const upazilasArray = Object.entries(upazilas).map(([id, upz]) => ({ id, ...upz }));

    const filteredDistricts = districtsArray.filter(d => String(d.division_id) === String(data.division));
    const filteredUpazilas = upazilasArray.filter(u => String(u.district_id) === String(data.district));

    return (
        <FrontendLayout>
            {/* Hero Header Banner */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white py-12 sm:py-14 px-4 rounded-2xl shadow-sm mb-6 text-center">
                <div className="max-w-4xl mx-auto space-y-3">
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-white/10 text-amber-300 border border-white/10 shadow-inner">
                        FRANCHISE & AFFILIATION
                    </span>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-sm">
                        Center Authorization Request
                    </h1>
                    <p className="text-xs sm:text-sm text-purple-200 font-medium max-w-2xl mx-auto">
                        Apply to establish an official BDNSI skill development training center in your locality.
                    </p>
                </div>
            </div>

            {/* Application Form Container */}
            <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
                {successMessage && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-3 shadow-xs">
                        <i className="fa-solid fa-circle-check text-lg text-emerald-600"></i>
                        <span>{successMessage}</span>
                    </div>
                )}

                <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
                    <form onSubmit={handleSubmit} className="space-y-8 text-xs">
                        
                        {/* Section 1: Institute & Director Details */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-extrabold text-[#7024A8] uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                                <i className="fa-solid fa-building-columns"></i>
                                <span>1. Institute & Director Details</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Field 1: Proposed Center Name */}
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Proposed Center Name *</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        placeholder="e.g. BDNSI Technical Training Center"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition text-xs font-medium"
                                    />
                                    {(errors.name || errors.center_name) && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.name || errors.center_name}</p>}
                                </div>

                                {/* Field 2: Director / Proprietor Name */}
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Director / Proprietor Name *</label>
                                    <input
                                        type="text"
                                        value={data.owner_name}
                                        onChange={(e) => setData('owner_name', e.target.value)}
                                        required
                                        placeholder="Full Name"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition text-xs font-medium"
                                    />
                                    {(errors.owner_name || errors.director_name) && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.owner_name || errors.director_name}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Location & Address */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-extrabold text-[#7024A8] uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                                <i className="fa-solid fa-location-dot"></i>
                                <span>2. Location & Address</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {/* Division */}
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Division *</label>
                                    <select
                                        value={data.division}
                                        onChange={(e) => {
                                            setData((prev) => ({
                                                ...prev,
                                                division: e.target.value,
                                                district: '',
                                                upazilla: ''
                                            }));
                                        }}
                                        required
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition text-xs font-medium"
                                    >
                                        <option value="">Select Division</option>
                                        {divisions.map((div) => (
                                            <option key={div.id} value={div.id}>{div.name}</option>
                                        ))}
                                    </select>
                                    {errors.division && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.division}</p>}
                                </div>

                                {/* District */}
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">District *</label>
                                    <select
                                        value={data.district}
                                        onChange={(e) => {
                                            setData((prev) => ({
                                                ...prev,
                                                district: e.target.value,
                                                upazilla: ''
                                            }));
                                        }}
                                        required
                                        disabled={!data.division}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition text-xs font-medium disabled:opacity-50"
                                    >
                                        <option value="">Select District</option>
                                        {filteredDistricts.map((dist) => (
                                            <option key={dist.id} value={dist.id}>{dist.name}</option>
                                        ))}
                                    </select>
                                    {errors.district && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.district}</p>}
                                </div>

                                {/* Upazila */}
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Upazila / Thana *</label>
                                    <select
                                        value={data.upazilla}
                                        onChange={(e) => setData('upazilla', e.target.value)}
                                        required
                                        disabled={!data.district}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition text-xs font-medium disabled:opacity-50"
                                    >
                                        <option value="">Select Upazila</option>
                                        {filteredUpazilas.map((upz) => (
                                            <option key={upz.id} value={upz.id}>{upz.name}</option>
                                        ))}
                                    </select>
                                    {errors.upazilla && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.upazilla}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-5">
                                {/* Field 3: Center Location (Area / Landmark) */}
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Center Location (Area / Landmark) *</label>
                                    <input
                                        type="text"
                                        value={data.center_location}
                                        onChange={(e) => setData('center_location', e.target.value)}
                                        required
                                        placeholder="e.g. 2nd Floor, City Center, Main Road, Sadar"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition text-xs font-medium"
                                    />
                                    {errors.center_location && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.center_location}</p>}
                                </div>

                                {/* Field 4: Full Postal Address */}
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Full Postal Address *</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        required
                                        rows={3}
                                        placeholder="House/Road No, Village/Ward, Post Office, Upazila, District"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition resize-none text-xs font-medium"
                                    ></textarea>
                                    {errors.address && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Contact Details */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-extrabold text-[#7024A8] uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                                <i className="fa-solid fa-address-book"></i>
                                <span>3. Contact Details</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {/* Field 5: Mobile / Phone Number */}
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Mobile / Phone Number *</label>
                                    <input
                                        type="text"
                                        value={data.mobile}
                                        onChange={(e) => setData('mobile', e.target.value)}
                                        required
                                        placeholder="01711000000"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition text-xs font-mono font-medium"
                                    />
                                    {(errors.mobile || errors.phone) && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.mobile || errors.phone}</p>}
                                </div>

                                {/* Field 6: Email Address */}
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        placeholder="center@example.com"
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-[#7024A8] outline-none transition text-xs font-medium"
                                    />
                                    {errors.email && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 4: File Uploads */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-extrabold text-[#7024A8] uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                                <i className="fa-solid fa-cloud-arrow-up"></i>
                                <span>4. Branding & Photo Uploads</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {/* Field 7: Center Logo */}
                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">Center Logo *</label>
                                    <div className="border-2 border-dashed border-purple-200 rounded-2xl p-5 text-center bg-purple-50/30 hover:bg-purple-50 transition-colors cursor-pointer relative flex flex-col items-center justify-center min-h-[140px]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={(e) => handleFileChange(e, 'center_logo', setLogoPreview)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo Preview" className="h-20 mx-auto object-contain rounded" />
                                        ) : (
                                            <div className="space-y-1.5 text-slate-500">
                                                <i className="fa-solid fa-image text-2xl text-[#7024A8]"></i>
                                                <p className="font-bold text-[11px] text-slate-800">Upload Center Logo</p>
                                                <p className="text-[10px] text-slate-400 font-medium">JPG, PNG, WEBP (Max 2MB)</p>
                                            </div>
                                        )}
                                    </div>
                                    {(errors.center_logo || errors.logo) && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.center_logo || errors.logo}</p>}
                                </div>

                                {/* Field 8: Director / Proprietor Photo */}
                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">Director / Proprietor Photo *</label>
                                    <div className="border-2 border-dashed border-purple-200 rounded-2xl p-5 text-center bg-purple-50/30 hover:bg-purple-50 transition-colors cursor-pointer relative flex flex-col items-center justify-center min-h-[140px]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={(e) => handleFileChange(e, 'director_photo', setPhotoPreview)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Photo Preview" className="h-20 w-20 mx-auto object-cover rounded-full border-2 border-[#7024A8] shadow-sm" />
                                        ) : (
                                            <div className="space-y-1.5 text-slate-500">
                                                <i className="fa-solid fa-user-gear text-2xl text-[#7024A8]"></i>
                                                <p className="font-bold text-[11px] text-slate-800">Upload Director Photo</p>
                                                <p className="text-[10px] text-slate-400 font-medium">JPG, PNG, WEBP (Max 2MB)</p>
                                            </div>
                                        )}
                                    </div>
                                    {(errors.director_photo || errors.photo) && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.director_photo || errors.photo}</p>}
                                </div>

                                {/* Field 9: Director Signature (Optional) */}
                                <div className="space-y-2">
                                    <label className="block font-bold text-slate-700">Director Signature (Optional)</label>
                                    <div className="border-2 border-dashed border-purple-200 rounded-2xl p-5 text-center bg-purple-50/30 hover:bg-purple-50 transition-colors cursor-pointer relative flex flex-col items-center justify-center min-h-[140px]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'director_signature', setSigPreview)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        {sigPreview ? (
                                            <img src={sigPreview} alt="Signature Preview" className="h-16 mx-auto object-contain" />
                                        ) : (
                                            <div className="space-y-1.5 text-slate-500">
                                                <i className="fa-solid fa-signature text-2xl text-[#7024A8]"></i>
                                                <p className="font-bold text-[11px] text-slate-800">Upload Signature</p>
                                                <p className="text-[10px] text-slate-400 font-medium">PNG Format Only</p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-medium text-amber-700 mt-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                                        Optional. PNG format without background.
                                    </p>
                                    {(errors.director_signature || errors.signature) && <p className="text-rose-600 mt-1 font-semibold text-[11px]">{errors.director_signature || errors.signature}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 flex items-center justify-end border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-8 py-3.5 bg-[#7024A8] hover:bg-[#581C87] text-white font-extrabold rounded-xl text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-98"
                            >
                                {processing ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                        <span>Submitting Request...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-paper-plane"></i>
                                        <span>Submit Center Request Application</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </FrontendLayout>
    );
}
