const { exec } = require('child_process');

let lastStatus = null;

function checkNetwork(callback) {
  exec('netsh wlan show interfaces', (error, stdout, stderr) => {
    if (error || stderr) {
      callback(`❌ Erro ao consultar adaptador: ${error || stderr}`);
      return;
    }

    const isConnected = stdout.includes("State             : connected");
    const isDisconnected = stdout.includes("State             : disconnected");

    let message;

    if (isConnected) {
      message = "✅ Adaptador conectado.";
    } else if (isDisconnected) {
      message = "⚠️ Adaptador desconectado.";
    } else {
      message = "❓ Nenhum adaptador detectado ou desativado.";
    }

    if (message !== lastStatus) {
      lastStatus = message;
      callback(message);
    }
  });
}

function startMonitor(callback) {
  // Roda a cada 5 segundos
  setInterval(() => checkNetwork(callback), 5000);
}

module.exports = { startMonitor };
