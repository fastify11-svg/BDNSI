/**
 * Checks if a site module toggle is enabled.
 * Handles undefined, null, true, 1, or '1' as "enabled".
 */
export const isEnabled = (val) =>
    val === undefined || val === null || val === true || val === 1 || val === '1';
