const log = document.getElementById('log');

window.api.onLog((msg) => {
  const now = new Date().toLocaleString();
  log.textContent += `[${now}] ${msg}\n`;
  log.scrollTop = log.scrollHeight;
});
