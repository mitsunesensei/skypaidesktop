const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Game launching functionality
  launchGame: (gamePath, userData) => {
    return ipcRenderer.invoke('launch-game', { gamePath, userData });
  },
  
  // File system access
  selectGameFolder: () => {
    return ipcRenderer.invoke('select-game-folder');
  },
  
  // App info
  getAppVersion: () => {
    return ipcRenderer.invoke('get-app-version');
  },
  
  // Window controls
  minimizeWindow: () => {
    ipcRenderer.send('minimize-window');
  },
  
  maximizeWindow: () => {
    ipcRenderer.send('maximize-window');
  },
  
  closeWindow: () => {
    ipcRenderer.send('close-window');
  }
});
