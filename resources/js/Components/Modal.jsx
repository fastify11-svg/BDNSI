import React, { useEffect, useRef } from 'react';

export default function Modal({ show = false, maxWidth = '2xl', closeable = true, onClose = () => {}, children }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [show]);

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
                onClick={closeable ? onClose : undefined}
            />

            {/* Modal Panel */}
            <div
                ref={dialogRef}
                className={`relative bg-white rounded-lg shadow-xl transform transition-all sm:w-full ${maxWidthClass} z-10`}
            >
                {children}
            </div>
        </div>
    );
}
