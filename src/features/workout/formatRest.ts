/** "90s", "2m", "2m 30s". Kept out of the component files so fast refresh works. */
export const formatRest = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return rest ? `${minutes}m ${rest}s` : `${minutes}m`;
};
