const { app, BrowserWindow } = require('electron');
const path = require('path');
const { startMonitor } = require('./monitor');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('renderer.html');

  // Inicia monitoramento da rede
  startMonitor((msg) => {
    win.webContents.send('log-message', msg);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
