const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  onShowDhikr: (callback) => {
    ipcRenderer.on('show-dhikr', (event, data) => {
      callback(data);
    });
  },
  sendResize: (width) => {
    ipcRenderer.send('resize-window', width);
  },
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.send('save-settings', settings)
});
