const { app, BrowserWindow } = require('electron');
const path = require('path');
const sudo = require('sudo-prompt');
const { startMonitor } = require('./monitor');

// Título que será exibido na caixa de diálogo do Windows
const sudoOptions = {
  name: 'wifiMon Monitor de Rede'
};
// Verifica se precisa relançar o app com permissões elevadas
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
        console.log('🛡️ App será reiniciado como administrador...');
        app.quit();
      }
    });

    return true; // Cancela execução normal
  }

  return false; // Continua execução normal
}

// Se for necessário reiniciar como admin, sai daqui
if (relaunchAsAdmin()) {
  return;
}

// Função principal do Electron
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('renderer.html');

  // Inicia monitoramento de rede
  startMonitor((msg) => {
    win.webContents.send('log-message', msg);
  });
}

// Quando app estiver pronto, cria a janela
app.whenReady().then(createWindow);

// Fecha app se todas janelas forem fechadas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
