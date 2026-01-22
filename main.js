const { app, BrowserWindow, Tray, Menu, screen, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

let tray = null;
let currentDhikrIndex = 0;
let adhkarData = null;
let popupWindow = null;
let intervalTimer = null;

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
  
  popupWindow = new BrowserWindow({
    width: 550,  // Large enough for max content (500px + padding)
    height: 200,
    x: x + width - 570,
    y: y + height - 220,
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
      const newWidth = Math.min(Math.max(calculatedWidth, 200), 550); // Between 200-550px
      const xPosition = x + width - newWidth - 20; // 20px margin from right edge
      const yPosition = y + height - 220; // Safety margin from bottom
      
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
      fontSize: settings.font_size
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
    // Replace this URL with your actual version check endpoint
    const updateCheckUrl = 'https://hachem89.github.io/adhkar-app/version.json';
    
    const response = await axios.get(updateCheckUrl, { timeout: 5000 });
    const latestVersion = response.data.version;
    const currentVersion = app.getVersion();
    
    if (latestVersion !== currentVersion) {
      const downloadUrl = response.data.downloadUrl || 'https://github.com/yourusername/adhkar-app/releases';
      
      tray.displayBalloon({
        title: 'Update Available',
        content: `Version ${latestVersion} is available. Click to download.`,
        icon: path.join(__dirname, 'build', 'icon.png')
      });
      
      // You could open the download URL here if desired
      console.log(`Update available: ${latestVersion}. Download at: ${downloadUrl}`);
    } else if (manual) {
      tray.displayBalloon({
        title: 'No Updates',
        content: 'You are running the latest version.',
        icon: path.join(__dirname, 'build', 'icon.png')
      });
    }
  } catch (error) {
    console.error('Error checking for updates:', error.message);
    if (manual) {
      tray.displayBalloon({
        title: 'Update Check Failed',
        content: 'Could not check for updates. Please try again later.',
        icon: path.join(__dirname, 'build', 'icon.png')
      });
    }
  }
}

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
