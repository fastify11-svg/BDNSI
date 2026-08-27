import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/inertia-react';

export default function GradeScaleIndex({ scales, auth }) {
    const courseTypes = {
        0: 'Regular Course',
        1: 'Short Course',
        2: 'Diploma Course'
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Dynamic Grading Rules" />
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Dynamic Grading Rules</h2>
                    <p className="text-gray-600 mt-1">Configure grading scales and limits for each course type.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {scales.map(scale => (
                        <GradeScaleCard key={scale.id} scale={scale} courseName={courseTypes[scale.course_type]} />
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

function GradeScaleCard({ scale, courseName }) {
    const { data, setData, put, processing } = useForm({
        max_marks: scale.max_marks || 100,
        rules: scale.rules || []
    });

    const addRule = () => {
        setData('rules', [...data.rules, { min_percent: 0, max_percent: 100, grade_name: '' }]);
    };

    const removeRule = (index) => {
        const newRules = [...data.rules];
        newRules.splice(index, 1);
        setData('rules', newRules);
    };

    const updateRule = (index, field, value) => {
        const newRules = [...data.rules];
        newRules[index][field] = value;
        setData('rules', newRules);
    };

    const saveChanges = (e) => {
        e.preventDefault();
        put(`/admin/grade-scales/${scale.id}`, {
            preserveScroll: true
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">{courseName}</h3>
            </div>
            
            <form onSubmit={saveChanges} className="p-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Total Marks</label>
                    <input 
                        type="number" 
                        value={data.max_marks} 
                        onChange={e => setData('max_marks', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                        required 
                    />
                    <p className="text-xs text-gray-500 mt-1">Limits total inputs (Written + Viva + Practical)</p>
                </div>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Grade Rules (By %)</label>
                        <button type="button" onClick={addRule} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded">
                            + Add Rule
                        </button>
                    </div>

                    {data.rules.length === 0 && (
                        <p className="text-sm text-gray-500 italic text-center py-2 bg-gray-50 rounded border border-dashed">
                            No dynamic rules set. Default hardcoded fallback will be used.
                        </p>
                    )}

                    <div className="space-y-2">
                        {data.rules.map((rule, index) => (
                            <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded border">
                                <div className="w-1/3">
                                    <span className="text-[10px] text-gray-500 block">Min %</span>
                                    <input 
                                        type="number" 
                                        value={rule.min_percent} 
                                        onChange={e => updateRule(index, 'min_percent', e.target.value)}
                                        className="w-full text-sm rounded border-gray-300 py-1" 
                                        required 
                                    />
                                </div>
                                <span className="text-gray-400">-</span>
                                <div className="w-1/3">
                                    <span className="text-[10px] text-gray-500 block">Max %</span>
                                    <input 
                                        type="number" 
                                        value={rule.max_percent} 
                                        onChange={e => updateRule(index, 'max_percent', e.target.value)}
                                        className="w-full text-sm rounded border-gray-300 py-1" 
                                        required 
                                    />
                                </div>
                                <div className="w-1/3">
                                    <span className="text-[10px] text-gray-500 block">Grade</span>
                                    <input 
                                        type="text" 
                                        value={rule.grade_name} 
                                        onChange={e => updateRule(index, 'grade_name', e.target.value)}
                                        className="w-full text-sm rounded border-gray-300 py-1" 
                                        placeholder="e.g. A+"
                                        required 
                                    />
                                </div>
                                <button type="button" onClick={() => removeRule(index)} className="text-red-500 hover:text-red-700 font-bold ml-1 mt-4">
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t text-right">
                    <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm shadow">
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    );
}
