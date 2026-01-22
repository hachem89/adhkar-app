# Adhkar Reminder App ✨

A beautiful, lightweight, and cross-platform desktop application designed to keep your heart connected to the remembrance of Allah (dhikr). The app runs quietly in the background and displays periodic Arabic dhikr reminders as elegant popups in the corner of your screen.

---

## 🌟 Features

- 📖 **Authentic Dhikr**: Displays traditional Arabic dhikr with full tashkeel (vowels).
- 🎨 **Elegant Design**: Soft ivory background with a maroon border, featuring smooth fade-in and fade-out animations.
- 📐 **Dynamic Sizing**: Popups automatically adjust their width to fit the length of the dhikr text perfectly.
- ⚙️ **Fully Customizable**: Control how often reminders appear, how long they stay, and even add your own custom dhikr.
- 🚀 **Auto-Start**: Can be configured to launch automatically when you turn on your computer.
- 💻 **Cross-Platform**: Native installers available for **Windows**, with support for **macOS** and **Linux**.
- 🔔 **Updates**: Built-in notification system to let you know when a new version is available.

---

## 📥 Installation (Windows)

1.  **Download**: Go to the [Releases Page](https://github.com/hachem89/adhkar-app/releases/latest) and download the **`Adhkar-Reminder-Setup.exe`**.
2.  **Install**: Run the installer. It will guide you through a quick setup.
3.  **Run**: Once installed, the app will start automatically. You can find its icon in your **System Tray** (bottom right, near the clock).

> [!IMPORTANT]
> **Windows Security Warning (SmartScreen)**
> When you run the installer, Windows might show a warning that says "Windows protected your PC" or "Unknown Publisher." 
> 
> **Why?** This is a personal, open-source project created for the community. Removing this warning requires a **Digital Signature Certificate**, which costs approximately **$500 per year**. As this is a free, non-profit tool, I cannot afford this expense.
> 
> **How to proceed:** Click **"More info"** and then click the **"Run anyway"** button. The app is 100% safe and the source code is fully transparent here on GitHub.

---

## 🛠️ Running Locally (For Developers)

If you want to run the app from source or contribute to development:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

### Setup & Run
```bash
# 1. Clone the repository
git clone https://github.com/hachem89/adhkar-app.git
cd adhkar-app

# 2. Install dependencies
npm install

# 3. Run the app
npm start
```

### Building your own installer
```bash
# To build for Windows
npm run build:win
```
The installer will be generated in the `dist/` folder.

---

## 📖 Usage & Settings

### System Tray
The app lives in your system tray. Right-click the icon to:
- **Show Dhikr Now**: Trigger a reminder immediately.
- **Settings**: Open the customization window to change positions, colors, and timings.
- **Check for Updates**: See if a new version is available.
- **Exit**: Completely close the app.

### Customizing Settings (New! 🛠️)
You no longer need to edit files manually! Right-click the tray icon and select **Settings** to:
- 📍 **Choose Position**: Select from 6 different screen locations (Top-Left, Bottom-Middle, etc.).
- 🎨 **Change Colors**: Pick your own background and border colors using a color picker.
- 🕒 **Adjust Timings**: Set how often reminders appear and how long they stay.
- 📏 **Scale Text**: Change the font size to your preference.

> [!TIP]
> Changes are applied **instantly** the moment you click "Save Settings"!

### Advanced: Adding Custom Dhikr
If you want to add your own remembrances, you can still edit the `adhkar.json` file:
- **Windows**: `C:\Users\YourUser\AppData\Local\Programs\adhkar-app\resources\adhkar.json`
- **Mac/Linux**: Found in the `resources` folder of the installation path.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Ways to contribute:**
- Adding more authentic dhikr to the default list.
- Improving the UI/UX.
- Bug fixes and performance optimizations.
- Translating the app or adding multiple language support.

---

## 📜 License

Distributed under the MIT License. This project is free to use, modify, and distribute for personal and non-commercial benefit.

## 🤲 Credits

Contains traditional Islamic dhikr for spiritual benefit. May Allah accept this humble effort and make it a source of continuous charity (Sadaqah Jariyah).

---

**Developed with ❤️ for the Ummah**
