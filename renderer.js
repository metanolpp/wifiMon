const log = document.getElementById('log');
const netinfo = document.getElementById('netinfo');

window.api.onLog((msg) => {
  const now = new Date().toLocaleString();
  log.textContent += `[${now}] ${msg}\n`;
  log.scrollTop = log.scrollHeight;
});

window.api.onData((data) => {
  netinfo.innerHTML = `
    <tr>
      <td>${data.iface}</td>
      <td>${data.estado}</td>
      <td>${data.ip}</td>
      <td>${data.gateway}</td>
      <td>${data.mac}</td>
      <td>${data.rx}</td>
      <td>${data.tx}</td>
      <td>${data.velocidade}</td>
    </tr>
  `;
});
