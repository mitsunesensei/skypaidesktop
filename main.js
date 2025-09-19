const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Create the browser window with transparency
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 400,
    transparent: true,
    frame: false,
    resizable: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      zoomFactor: 1.0
    },
    icon: path.join(__dirname, 'icon.ico'),
    show: false // Don't show until ready
  });

  // Load the HTML file
  mainWindow.loadFile('skyparty2.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    // Ensure proper window size
    mainWindow.setSize(800, 600);
    mainWindow.center();
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // IPC Handlers for window controls
  ipcMain.handle('minimize-window', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle('maximize-window', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle('close-window', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.handle('set-transparent', (event, transparent) => {
    if (mainWindow) {
      // Transparency is already set in BrowserWindow constructor
      console.log('Transparency already configured in window creation');
    }
  });

  ipcMain.handle('open-console', () => {
    if (mainWindow) {
      mainWindow.webContents.openDevTools();
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
