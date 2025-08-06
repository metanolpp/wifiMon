const si = require('systeminformation');

let lastStatus = null;

function checkNetwork(callback) {
  si.networkInterfaces().then(interfaces => {
    const wifi = interfaces.find(i => i.type === 'wireless');

    if (!wifi) {
      callback("❌ Nenhum adaptador Wi-Fi detectado.");
      return;
    }

    const status = wifi.operstate === 'up'
      ? `✅ Conectado - ${wifi.iface} (${wifi.ip4})`
      : `⚠️ Desconectado - ${wifi.iface}`;

    if (status !== lastStatus) {
      lastStatus = status;
      callback(status);
    }
  }).catch(error => {
    callback(`❌ Erro no monitoramento: ${error.message}`);
  });
}

function startMonitor(callback) {
  setInterval(() => checkNetwork(callback), 5000);
}

module.exports = { startMonitor };
