# 🎮 SkyParty Desktop Edition

Welcome to **SkyParty Desktop Edition** - the complete desktop version of SkyParty with custom popups, transparent window, and native desktop experience!

## ✨ Features

- 🪟 **Transparent, draggable window** - True desktop app experience
- 🎨 **Custom Windows XP style popups** - No more browser alerts!
- 🔐 **Firebase Authentication** - Secure login and registration
- 🎮 **Game Integration** - Launch games directly from the app
- 💰 **Wallet System** - Manage credits and purchases
- 👤 **Profile Management** - Customize your character and settings
- 🖥️ **Developer Console** - Built-in debugging tools

## 🚀 Quick Start

### Option 1: Super Easy (Recommended)

1. **Double-click `run-skyparty.bat`**
   - This script will automatically:
     - Check if Node.js and npm are installed
     - Install Electron if needed
     - Start the SkyParty application
2. The SkyParty window will open as a transparent, draggable desktop application

### Option 2: Manual Setup

1. **Install Node.js**: Download and install from [https://nodejs.org/](https://nodejs.org/)
2. **Install Electron**: Double-click `install-electron.bat` or run:
   ```bash
   npm install electron
   ```
3. **Start the Application**: Double-click `run-skyparty.bat` or run:
   ```bash
   npm start
   ```

## 📁 File Structure

```
skypartycontiuation/
├── skyparty2.html          # Main application (working version with custom popups)
├── package.json            # Node.js project configuration
├── main.js                 # Electron main process
├── firebase-config.js      # Firebase authentication config
├── install-electron.bat    # Electron installer script
├── run-skyparty.bat        # Application launcher
└── README.md              # This file
```

## 🎯 What's Different

This desktop edition includes:
- ✅ **Working custom popups** - All alerts, confirms, and prompts are custom Windows XP style
- ✅ **Transparent window** - True desktop app feel
- ✅ **Draggable interface** - Move the window anywhere
- ✅ **Native window controls** - Minimize, maximize, close buttons
- ✅ **Clean codebase** - No conflicts or broken functions

## 🔧 Troubleshooting

### Common Issues

- **"Node.js is not installed"**: Install Node.js from [https://nodejs.org/](https://nodejs.org/)
- **Window not transparent**: Ensure you're running the Electron version, not opening the HTML in a browser
- **Popups not showing**: Check the console (F12 or use the console button in your profile)
- **Login issues**: Check your internet connection and Firebase configuration

### Getting Help

1. **Check the console**: Click the 🖥️ button in your profile to open developer tools
2. **Check for errors**: Look for red error messages in the console
3. **Restart the app**: Close and run `run-skyparty.bat` again

## 🎉 Enjoy Your Desktop Experience!

SkyParty Desktop Edition gives you the full native desktop experience with:
- Beautiful custom popups
- Smooth window dragging
- Professional desktop integration
- All the features you love from the web version

**Happy gaming!** 🎮✨
