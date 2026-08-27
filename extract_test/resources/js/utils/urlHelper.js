/**
 * Shared URL utility for BDNSI project.
 * 
 * Simple, clean URL resolver — no /BDNSI/ prefix needed.
 * Works with:
 *   - php artisan serve (localhost:8000)
 *   - Production (yourdomain.com)
 */

/**
 * Resolve a path to a proper URL.
 * 
 * @param {string} path - The path to resolve (e.g. '/admin/dashboard')
 * @param {string} [fallback='/'] - Fallback if path is empty
 * @returns {string} The clean URL path
 */
export function getUrl(path, fallback = '/') {
    if (!path) return fallback;

    // Absolute URLs — return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) return path;

    // Strip any host prefix
    let clean = path.replace(/^https?:\/\/[^\/]+/i, '');

    // Remove any old /BDNSI or /BDNSI/public prefix
    clean = clean.replace(/^\/?BDNSI(\/public)?\/?/i, '/');

    // Convert /public/ paths to /storage/ (for uploaded file URLs)
    clean = clean.replace(/^\/?public\//, '/storage/');

    // Ensure leading slash
    if (!clean.startsWith('/')) clean = '/' + clean;

    // Remove double slashes
    clean = clean.replace(/\/\/+/g, '/');

    return clean;
}
