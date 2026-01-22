# Adhkar Reminder App

A cross-platform desktop application that displays periodic Islamic dhikr (remembrance) reminders on your screen. The app runs in the background and shows beautiful popups with Arabic dhikr at customizable intervals.

## Features

- ✨ **Automatic Dhikr Reminders**: Displays Arabic dhikr with tashkeel at configurable intervals
- 🖥️ **Cross-Platform**: Works on Windows, macOS, and Linux
- 🎨 **Beautiful UI**: Light ivory background with maroon border and smooth fade animations
- ⚙️ **Customizable Settings**: Adjust display duration, intervals, and font size
- 🚀 **Auto-Start**: Runs automatically when your computer starts
- 🔔 **Update Notifications**: Get notified when new versions are available
- 💾 **System Tray**: Runs quietly in the background with easy access from the taskbar

## Installation

### Windows
1. Download `Adhkar-Reminder-Setup.exe` from the releases page
2. Run the installer
3. The app will start automatically and appear in your system tray

### macOS
1. Download `Adhkar-Reminder.dmg` from the releases page
2. Open the DMG file and drag the app to Applications
3. Launch the app from Applications
4. The app will appear in your menu bar

### Linux
1. Download `Adhkar-Reminder.AppImage` or `adhkar-reminder.deb` from the releases page
2. For AppImage: Make it executable and run it
   ```bash
   chmod +x Adhkar-Reminder.AppImage
   ./Adhkar-Reminder.AppImage
   ```
3. For DEB: Install using dpkg
   ```bash
   sudo dpkg -i adhkar-reminder.deb
   ```

## Usage

### Basic Operation
- The app runs in the background and displays dhikr popups automatically
- Popups appear in the bottom-right corner of your screen
- Each dhikr is displayed for 8 seconds by default (configurable)
- Right-click the system tray icon to access options

### System Tray Menu
- **Show Dhikr Now**: Display a dhikr immediately
- **Check for Updates**: Manually check for app updates
- **Exit**: Close the application

### Customizing Settings

Edit the `adhkar.json` file in the app directory to customize:

```json
{
  "settings": {
    "interval_seconds": 600,        // Time between popups (600 = 10 minutes)
    "popup_display_seconds": 8,     // How long popup stays visible
    "font_size": 19                 // Font size of dhikr text
  },
  "adhkar": [
    // Add or remove dhikr as desired
  ]
}
```

**Location of adhkar.json:**
- Windows: `C:\Users\YourUsername\AppData\Local\Programs\adhkar-app\resources\app\adhkar.json`
- macOS: `/Applications/Adhkar Reminder.app/Contents/Resources/app/adhkar.json`
- Linux: Where you unpacked the AppImage or installed the app

### Adding Custom Dhikr

Simply edit the `adhkar.json` file and add your dhikr to the array:

```json
"adhkar": [
  "اللَّهُ أَكْبَرُ",
  "Your custom dhikr here",
  // ... more dhikr
]
```

After editing, restart the app for changes to take effect.

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
```bash
# Clone or download the project
cd adhkarAppV2

# Install dependencies
npm install

# Run in development mode
npm start
```

### Building Installers

```bash
# Build for all platforms
npm run build

# Build for specific platform
npm run build:win      # Windows
npm run build:mac      # macOS
npm run build:linux    # Linux
```

Installers will be created in the `dist` folder.

## Update Distribution

To distribute updates to users:

1. Update the version in `package.json`
2. Build new installers using `npm run build`
3. Host the new installers on GitHub releases or your preferred platform
4. Update the `version.json` file with the new version number and download URL:
   ```json
   {
     "version": "1.1.0",
     "downloadUrl": "https://your-download-url.com/latest-release"
   }
   ```
5. Host `version.json` at a publicly accessible URL
6. Update the `updateCheckUrl` in `main.js` to point to your `version.json`

When users open the app, they'll automatically be notified of available updates.

## Disabling Auto-Start

If you don't want the app to start automatically:

**Windows:**
1. Open Task Manager (Ctrl + Shift + Esc)
2. Go to the "Startup" tab
3. Find "Adhkar Reminder" and disable it

**macOS:**
1. Go to System Preferences → Users & Groups
2. Click on your username
3. Go to "Login Items"
4. Select "Adhkar Reminder" and click the minus (-) button

**Linux:**
1. Check your desktop environment's startup applications settings
2. Remove or disable "Adhkar Reminder"

## Troubleshooting

### Popups not appearing
- Ensure the app is running (check system tray)
- Verify `adhkar.json` exists and is properly formatted
- Check that the interval hasn't been set too long

### Arabic text not displaying correctly
- The app includes support for Arabic fonts
- Make sure your system has Arabic font support installed

### App not starting automatically
- Check your system's startup applications settings
- Reinstall the app if necessary

## License

This project is free to use and distribute for personal and non-commercial purposes.

## Credits

Contains traditional Islamic dhikr (remembrances) for spiritual benefit and reminder.

---

**May Allah accept this work and make it beneficial for all users. Ameen.**
