import React from 'react';
import { useForm, usePage } from '@inertiajs/inertia-react';
import CenterLayout from '../../../Layouts/CenterLayout';
import { getUrl } from '../../../utils/urlHelper';

export default function Update() {
    const { app_url } = usePage().props;

    const { data, setData, post, processing, reset, errors } = useForm({
        old_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(getUrl('/password-update'), {
            onSuccess: () => reset()
        });
    };

    return (
        <CenterLayout title="Update Password">
            <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Update Password</h1>
                    <p className="text-xs text-slate-500">Change your center portal account login password.</p>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                                Current Password *
                            </label>
                            <input
                                type="password"
                                value={data.old_password}
                                onChange={(e) => setData('old_password', e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                            />
                            {errors.old_password && <p className="text-rose-600 mt-1">{errors.old_password}</p>}
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                                New Password *
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                            />
                            {errors.password && <p className="text-rose-600 mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 uppercase tracking-wide mb-1">
                                Confirm New Password *
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2.5 bg-[#0A182A] hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-md transition text-xs disabled:opacity-50"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </CenterLayout>
    );
}
