// DeOldify Browser - Slider Component

export function setupSlider() {
    const container = document.getElementById('resultContainer');
    const canvas = document.getElementById('outputCanvas');
    const handle = document.getElementById('sliderHandle');

    let isDragging = false;

    function updateSlider(clientX) {
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;

        // Clamp
        percentage = Math.max(0, Math.min(100, percentage));

        handle.style.left = `${percentage}%`;

        // Top layer is Canvas (Colorized), Bottom is Img (Original)
        // We want to verify this assumption.
        // Yes, z-index of canvas defaults to auto, but it is absolute on top of img.
        // To show Original (Bottom) on the RIGHT, we clip the Canvas (Top) from the right.
        // clip-path: inset(top right bottom left);
        // inset(0 60% 0 0) means we cut 60% from the right.
        // If slider is at 40%, we want to show 40% of canvas. So cut 60% (100-40) from right.

        canvas.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    }

    // Mouse Events
    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault(); // Prevent selection
    });

    window.addEventListener('mouseup', () => isDragging = false);

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });

    // Touch Events
    handle.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    window.addEventListener('touchend', () => isDragging = false);

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        updateSlider(e.touches[0].clientX);
    });

    // Initialize center
    // Wait for visibility? CSS handles default usually, but we set it in JS too.
}
