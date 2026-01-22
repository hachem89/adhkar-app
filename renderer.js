// Listen for dhikr display events from main process
window.electronAPI.onShowDhikr((data) => {
  const dhikrText = document.getElementById('dhikr-text');
  const popupContainer = document.getElementById('popup-container');
  
  // Set the dhikr text
  dhikrText.textContent = data.dhikr;
  
  // Set font size from settings
  dhikrText.style.fontSize = `${data.fontSize}px`;
  
  // Calculate required width
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = `600 ${data.fontSize}px 'Amiri', 'Traditional Arabic', 'Arabic Typesetting', serif`;
  const textWidth = context.measureText(data.dhikr).width;
  
  // Calculate popup width: text width + padding (60px) + some margin
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 550;
  let calculatedWidth = Math.ceil(textWidth) + 80; // 80px for padding and margins
  
  // Clamp between min and max
  calculatedWidth = Math.min(Math.max(calculatedWidth, MIN_WIDTH), MAX_WIDTH);
  
  // Send resize request to main process
  window.electronAPI.sendResize(calculatedWidth);
  
  // Start fade-out animation before closing
  setTimeout(() => {
    popupContainer.classList.add('fade-out');
  }, (data.displaySeconds - 0.5) * 1000); // Start fade-out 0.5s before closing
});
