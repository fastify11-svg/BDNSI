import React from 'react';
import { InertiaLink as Link } from '@inertiajs/inertia-react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center mt-4 gap-1">
            {links.map((link, index) => (
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-1 rounded text-sm border transition-colors ${
                            link.active
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="px-3 py-1 rounded text-sm border border-gray-200 text-gray-400 bg-white"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
