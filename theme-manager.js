/**
 * Theme Manager for SPION
 * Handles Light/Dark mode switching and persistence
 */

(function () {
    const THEME_KEY = 'spion-theme';

    // Function to apply theme
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);

        // Update toggle button text if it exists
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    }

    // Initialize theme
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);

    // Add event listener when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                applyTheme(newTheme);
            });

            // Set initial button text
            const currentTheme = document.documentElement.getAttribute('data-theme');
            toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    });
})();
