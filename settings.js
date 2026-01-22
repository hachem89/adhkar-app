// DOM Elements
const form = document.getElementById('settings-form');
const intervalInput = document.getElementById('interval');
const durationInput = document.getElementById('duration');
const fontSizeInput = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const bgColorInput = document.getElementById('bgColor');
const borderColorInput = document.getElementById('borderColor');
const positionInput = document.getElementById('position');
const cancelBtn = document.getElementById('cancelBtn');

// Initialize settings
document.addEventListener('DOMContentLoaded', async () => {
    // Request current settings from main process
    const settings = await window.electronAPI.getSettings();
    
    // Fill the form
    intervalInput.value = Math.round(settings.interval_seconds / 60);
    durationInput.value = settings.popup_display_seconds;
    fontSizeInput.value = settings.font_size;
    fontSizeValue.textContent = `${settings.font_size}px`;
    bgColorInput.value = settings.background_color || '#FFFFF0';
    borderColorInput.value = settings.border_color || '#800000';
    positionInput.value = settings.popup_position || 'bottom-right';
});

// Update font size display
fontSizeInput.addEventListener('input', (e) => {
    fontSizeValue.textContent = `${e.target.value}px`;
});

// Cancel button
cancelBtn.addEventListener('click', () => {
    window.close();
});

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newSettings = {
        interval_seconds: parseInt(intervalInput.value) * 60,
        popup_display_seconds: parseInt(durationInput.value),
        font_size: parseInt(fontSizeInput.value),
        background_color: bgColorInput.value,
        border_color: borderColorInput.value,
        popup_position: positionInput.value
    };
    
    window.electronAPI.saveSettings(newSettings);
    window.close();
});
