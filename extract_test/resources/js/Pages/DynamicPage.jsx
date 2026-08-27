import React from 'react';
import FrontendLayout from '../Layouts/FrontendLayout';
import { Head } from '@inertiajs/inertia-react';
export default function DynamicPage({ title, content }) {
    return (
        <FrontendLayout>
            <Head title={title} />
            <div className="py-12 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
                            <div 
                                className="prose max-w-none text-gray-700 leading-relaxed" 
                                dangerouslySetInnerHTML={{ __html: content || `<p class="text-center text-gray-500">Content not available yet.</p>` }} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
