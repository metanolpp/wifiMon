const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onLog: (callback) => ipcRenderer.on('log-message', (_, msg) => callback(msg)),
  onData: (callback) => ipcRenderer.on('adapter-data', (_, data) => callback(data)),
  restartAdapter: () => ipcRenderer.send('restart-adapter'),
});
