import React, { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ auth, date, teams }) {
    const [selectedDate, setSelectedDate] = useState(date);
    
    // Initialize form with existing targets or defaults
    const { data, setData, post, processing, errors } = useForm({
        date: selectedDate,
        targets: teams.map(team => ({
            team_id: team.id,
            student_target: team.target?.student_target || 0,
            b2b_certificate_target: team.target?.b2b_certificate_target || 0
        }))
    });

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        Inertia.get('/admin/team-performance', { date: newDate }, { preserveState: true });
    };

    const handleTargetChange = (index, field, value) => {
        const newTargets = [...data.targets];
        newTargets[index][field] = value;
        setData('targets', newTargets);
    };

    const submit = (e) => {
        e.preventDefault();
        post('/admin/team-performance/targets');
    };

    return (
        <AdminLayout
            title="Team Performance & Targets"
        >
            <Head title="Team Performance" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Date Selector */}
                    <div className="bg-white p-4 sm:p-8 shadow sm:rounded-lg">
                        <div className="flex items-center space-x-4">
                            <label className="block text-sm font-medium text-gray-700">Select Target Date:</label>
                            <input
                                type="date"
                                className="mt-1 block w-48 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>

                    {/* Set Targets Form */}
                    <div className="bg-white p-4 sm:p-8 shadow sm:rounded-lg">
                        <header className="mb-6">
                            <h2 className="text-lg font-medium text-gray-900">Assign Daily Targets</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Set the target for student registrations and B2B certificate sales for each team member on the selected date.
                            </p>
                        </header>
                        
                        <form onSubmit={submit} className="space-y-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Team Member</th>
                                            <th className="px-6 py-3">Student Target</th>
                                            <th className="px-6 py-3">B2B Certificate Target</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teams.map((team, index) => (
                                            <tr key={team.id} className="bg-white border-b">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {team.name}
                                                    <div className="text-xs text-gray-500">{team.designation}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full"
                                                        value={data.targets[index].student_target}
                                                        onChange={(e) => handleTargetChange(index, 'student_target', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm w-full"
                                                        value={data.targets[index].b2b_certificate_target}
                                                        onChange={(e) => handleTargetChange(index, 'b2b_certificate_target', e.target.value)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    Save Targets
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Performance Report */}
                    <div className="bg-white p-4 sm:p-8 shadow sm:rounded-lg">
                        <header className="mb-6">
                            <h2 className="text-lg font-medium text-gray-900">Performance Report for {selectedDate}</h2>
                        </header>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {teams.map((team) => {
                                const studentTarget = team.target?.student_target || 0;
                                const b2bTarget = team.target?.b2b_certificate_target || 0;
                                
                                const studentPercent = studentTarget > 0 ? Math.min(100, Math.round((team.achieved.students / studentTarget) * 100)) : (team.achieved.students > 0 ? 100 : 0);
                                const b2bPercent = b2bTarget > 0 ? Math.min(100, Math.round((team.achieved.b2b_certificates / b2bTarget) * 100)) : (team.achieved.b2b_certificates > 0 ? 100 : 0);

                                return (
                                    <div key={team.id} className="border rounded-lg p-6 bg-gray-50">
                                        <h3 className="font-bold text-gray-800 text-lg">{team.name}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{team.designation}</p>

                                        {/* Student Progress */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">Students ({team.achieved.students} / {studentTarget})</span>
                                                <span className="text-indigo-600 font-bold">{studentPercent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${studentPercent}%` }}></div>
                                            </div>
                                        </div>

                                        {/* B2B Certificate Progress */}
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">B2B Certificates ({team.achieved.b2b_certificates} / {b2bTarget})</span>
                                                <span className="text-green-600 font-bold">{b2bPercent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${b2bPercent}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}
