# How to Build Windows Installer

## Quick Start

### Option 1: Enable Developer Mode (Recommended)
1. Open Windows Settings
2. Go to **Update & Security** → **For developers**
3. Enable **Developer Mode**
4. Restart your computer
5. Run: `npm run build:win`

### Option 2: Run as Administrator
1. Right-click **PowerShell** and select **Run as administrator**
2. Navigate to the project:
   ```powershell
   cd C:\Users\user\Desktop\adhkarAppV2
   ```
3. Run the build command:
   ```powershell
   npm run build:win
   ```

## What Gets Created

After successful build, you'll find in the `dist` folder:
- `Adhkar Reminder Setup 1.0.0.exe` - The installer for distribution
- `win-unpacked/` - Unpacked application files

## Build for All Platforms

```bash
# Build for all platforms
npm run build

# Build for specific platforms
npm run build:win      # Windows (.exe)
npm run build:mac      # macOS (.dmg) - requires macOS
npm run build:linux    # Linux (.AppImage, .deb)
```

## Distributing to Users

1. Build the installer (follow steps above)
2. Upload `Adhkar Reminder Setup 1.0.0.exe` to:
   - Google Drive / OneDrive / Dropbox
   - GitHub Releases (recommended)
   - Your own website
3. Share the download link
4. Users double-click the installer to install

That's it! Users don't need Node.js or any technical setup.
