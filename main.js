const { app, BrowserWindow, Tray, Menu, screen, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

let tray = null;
let currentDhikrIndex = 0;
let adhkarData = null;
let popupWindow = null;
let settingsWindow = null;
let intervalTimer = null;
let lastDownloadUrl = null;

// Use resource path for data to ensure it works when packaged
function getResourcePath(relativePath) {
  // Try resourcesPath (for extraResources) first, then fallback to __dirname
  const prodPath = path.join(process.resourcesPath, relativePath);
  if (fs.existsSync(prodPath)) return prodPath;
  return path.join(__dirname, relativePath);
}

// Load adhkar data
function loadAdhkarData() {
  try {
    const dataPath = getResourcePath('adhkar.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    adhkarData = JSON.parse(rawData);
    console.log('Adhkar data loaded successfully from: ' + dataPath);
  } catch (error) {
    console.error('Error loading adhkar data:', error);
    // Ensure we have some data to prevent crashes
    adhkarData = { 
      settings: { interval_seconds: 600, popup_display_seconds: 8, font_size: 19 },
      adhkar: ["اللَّهُ أَكْبَرُ"]
    };
  }
}

// Create popup window
function createPopupWindow() {
  if (popupWindow) {
    popupWindow.close();
  }

  const { x, y, width, height } = screen.getPrimaryDisplay().workArea;
  const settings = adhkarData.settings;
  const pos = settings.popup_position || 'bottom-right';
  
  let initialX = x + width - 570;
  let initialY = y + height - 170;

  if (pos.startsWith('top')) initialY = y + 20;
  if (pos.includes('left')) initialX = x + 20;
  if (pos.includes('middle')) initialX = x + (width - 550) / 2;

  popupWindow = new BrowserWindow({
    width: 550,
    height: 200,
    x: Math.round(initialX),
    y: Math.round(initialY),
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  popupWindow.loadFile('popup.html');
  popupWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  
  // Don't show in taskbar
  popupWindow.setSkipTaskbar(true);

  popupWindow.on('closed', () => {
    popupWindow = null;
  });
}

// Create settings window
function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 450,
    height: 550,
    title: 'Adhkar Settings',
    frame: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  settingsWindow.loadFile('settings.html');
  
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

// Show next dhikr
function showNextDhikr() {
  if (!adhkarData || !adhkarData.adhkar || adhkarData.adhkar.length === 0) {
    console.error('No adhkar data available');
    return;
  }

  createPopupWindow();

  const currentWindow = popupWindow;
  
  if (!currentWindow) {
    console.error('Failed to create popup window');
    return;
  }

  // Listen for resize request from renderer
  ipcMain.once('resize-window', (event, calculatedWidth) => {
    if (currentWindow && !currentWindow.isDestroyed()) {
      const { x, y, width, height } = screen.getPrimaryDisplay().workArea;
      const newWidth = Math.min(Math.max(calculatedWidth, 200), 550);
      const settings = adhkarData.settings;
      const pos = settings.popup_position || 'bottom-right';
      
      let xPosition = x + width - newWidth - 20; // Default Right
      let yPosition = y + height - 170; // Default Bottom
      
      if (pos.includes('left')) xPosition = x + 20;
      if (pos.includes('middle')) xPosition = x + (width - newWidth) / 2;
      
      if (pos.startsWith('top')) yPosition = y + 20;
      
      currentWindow.setBounds({
        width: newWidth,
        height: 200,
        x: Math.round(xPosition),
        y: Math.round(yPosition)
      });
    }
  });

  currentWindow.webContents.on('did-finish-load', () => {
    // Check if window still exists
    if (!currentWindow || currentWindow.isDestroyed()) {
      return;
    }
    
    const dhikr = adhkarData.adhkar[currentDhikrIndex];
    const settings = adhkarData.settings;
    
    currentWindow.webContents.send('show-dhikr', {
      dhikr: dhikr,
      displaySeconds: settings.popup_display_seconds,
      fontSize: settings.font_size,
      backgroundColor: settings.background_color,
      borderColor: settings.border_color
    });

    // Move to next dhikr
    currentDhikrIndex = (currentDhikrIndex + 1) % adhkarData.adhkar.length;

    // Auto-close after display duration
    setTimeout(() => {
      if (currentWindow && !currentWindow.isDestroyed()) {
        currentWindow.close();
      }
    }, (settings.popup_display_seconds + 1) * 1000); // +1 for fade-out animation
  });
}

// Schedule dhikr popups
function scheduleDhikrPopups() {
  if (intervalTimer) {
    clearInterval(intervalTimer);
  }

  if (!adhkarData) {
    console.error('Cannot schedule popups: adhkar data not loaded');
    return;
  }

  const intervalMs = adhkarData.settings.interval_seconds * 1000;
  
  // Show first dhikr after 10 seconds
  setTimeout(() => {
    showNextDhikr();
  }, 10000);

  // Then show subsequent dhikr at configured intervals
  intervalTimer = setInterval(() => {
    showNextDhikr();
  }, intervalMs);
}

// Create system tray
function createTray() {
  try {
    const iconPath = getResourcePath(path.join('build', 'icon.png'));
    console.log('Tray icon path:', iconPath);
    
    tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Adhkar Reminder (Running)',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Show Dhikr Now',
        click: () => {
          showNextDhikr();
        }
      },
      {
        label: 'Settings',
        click: () => {
          createSettingsWindow();
        }
      },
      {
        label: 'Check for Updates',
        click: () => {
          checkForUpdates(true);
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Exit',
        click: () => {
          app.quit();
        }
      }
    ]);
    
    tray.setToolTip('Adhkar Reminder');
    tray.setContextMenu(contextMenu);

    // Open download URL when update notification is clicked
    tray.on('balloon-click', () => {
      if (lastDownloadUrl) {
        shell.openExternal(lastDownloadUrl);
      }
    });
  } catch (error) {
    console.error('Failed to create tray:', error);
  }
}

// Enable auto-start on system boot
function enableAutoStart() {
  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true
  });
}

// Check for updates
async function checkForUpdates(manual = false) {
  try {
    const iconPath = getResourcePath(path.join('build', 'icon.png'));
    
    if (manual) {
      tray.displayBalloon({
        title: 'Update Check',
        content: 'Checking for updates...',
        icon: iconPath
      });
    }

    const updateCheckUrl = 'https://hachem89.github.io/adhkar-app/version.json';
    const response = await axios.get(updateCheckUrl, { timeout: 5000 });
    const latestVersion = response.data.version;
    const currentVersion = app.getVersion();
    
    const isNewer = latestVersion.split('.').map(Number).join('') > currentVersion.split('.').map(Number).join('');

    if (isNewer) {
      lastDownloadUrl = response.data.downloadUrl || 'https://github.com/hachem89/adhkar-app/releases';
      
      tray.displayBalloon({
        title: 'Update Available',
        content: `Version ${latestVersion} is available. Click to download.`,
        icon: iconPath
      });
      
      console.log(`Update available: ${latestVersion}. Download at: ${downloadUrl}`);
    } else if (manual) {
      const { dialog } = require('electron');
      dialog.showMessageBox({
        type: 'info',
        title: 'No Updates',
        message: 'You are running the latest version.',
        buttons: ['OK']
      });
    }
  } catch (error) {
    console.error('Error checking for updates:', error.message);
    if (manual) {
      const { dialog } = require('electron');
      dialog.showMessageBox({
        type: 'error',
        title: 'Update Check Failed',
        message: 'Could not check for updates. Please check your internet connection and try again.',
        buttons: ['OK']
      });
    }
  }
}

// Listen for settings requests
ipcMain.handle('get-settings', () => {
  return adhkarData.settings;
});

// Save settings handler
ipcMain.on('save-settings', (event, newSettings) => {
  adhkarData.settings = {
    ...adhkarData.settings,
    ...newSettings
  };
  
  // Save to file
  const dataPath = getResourcePath('adhkar.json');
  fs.writeFileSync(dataPath, JSON.stringify(adhkarData, null, 2));
  
  // Restart schedule with new interval
  scheduleDhikrPopups();
  console.log('Settings updated and schedule restarted');
});

// App initialization
app.whenReady().then(() => {
  loadAdhkarData();
  createTray();
  enableAutoStart();
  scheduleDhikrPopups();
  
  // Check for updates on startup (silent)
  setTimeout(() => {
    checkForUpdates(false);
  }, 30000); // Check after 30 seconds
  
  // Check for updates daily
  setInterval(() => {
    checkForUpdates(false);
  }, 24 * 60 * 60 * 1000); // Every 24 hours
});

// Prevent app from quitting when all windows are closed
app.on('window-all-closed', (e) => {
  e.preventDefault();
});

// Quit when app is requested to quit
app.on('quit', () => {
  if (intervalTimer) {
    clearInterval(intervalTimer);
  }
});

// macOS specific: re-create tray if needed
app.on('activate', () => {
  if (!tray) {
    createTray();
  }
});
