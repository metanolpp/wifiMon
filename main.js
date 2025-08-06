const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sudo = require('sudo-prompt');
const { exec } = require('child_process');
const { startMonitor } = require('./monitor');

const sudoOptions = {
  name: 'wifiMon'
};

function relaunchAsAdmin() {
  const isWindows = process.platform === 'win32';
  const isElevated = process.argv.includes('--elevated');

  if (isWindows && !isElevated) {
    const execPath = `"${process.execPath}"`;
    const entryPoint = `"${__filename}"`;

    const command = `${execPath} ${entryPoint} --elevated`;

    sudo.exec(command, sudoOptions, (error) => {
      if (error) {
        console.error('❌ Falha ao solicitar permissões elevadas:', error);
        app.quit();
      } else {
        app.quit();
      }
    });

    return true;
  }

  return false;
}

if (relaunchAsAdmin()) return;

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('renderer.html');

  startMonitor(
    (msg) => win.webContents.send('log-message', msg),
    (data) => win.webContents.send('adapter-data', data)
  );

  ipcMain.on('restart-adapter', () => {
    const cmd = `
      netsh interface set interface name="Wi-Fi" admin=disable && 
      timeout /t 3 >nul && 
      netsh interface set interface name="Wi-Fi" admin=enable
    `.trim();

    sudo.exec(cmd, sudoOptions, (error, stdout, stderr) => {
      win.webContents.send('log-message', error ? `❌ Falha ao reiniciar adaptador: ${error.message}` : '🔄 Adaptador reiniciado com sucesso.');
    });
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
