import './bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/inertia-react';

import { InertiaProgress } from '@inertiajs/progress';
import { Inertia } from '@inertiajs/inertia';

InertiaProgress.init({
    delay: 250,
    color: '#10B981',
    includeCSS: true,
    showSpinner: true,
});

Inertia.on('exception', (event) => {
    event.preventDefault();
    console.error('Inertia global exception handler caught an error:', event.detail.error);
    if (event.detail.error.message.includes('Network Error') || event.detail.error.message.includes('timeout')) {
        alert('Network connection lost or timed out. Please check your internet connection and try again.');
    } else {
        alert('An unexpected error occurred. Please refresh the page and try again.');
    }
});

createInertiaApp({
    title: title => title ? `${title} - BDNSI` : 'BDNSI',
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
