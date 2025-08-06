const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onLog: (callback) => ipcRenderer.on('log-message', (_, msg) => callback(msg)),
});
