function randomCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function buatLink() {
  const input = document.getElementById("url").value;
  if (!input) return;

  const code = randomCode();
  const link = `${window.location.origin}/redirect/${code}`;

  const jsonEntry = `"${code}": "${input}"`;

  document.getElementById("hasil").innerHTML = `
    Link kamu:<br><code>${link}</code><br><br>
    Tambahkan ini ke <b>data.json</b>:<br><code>${jsonEntry}</code>
  `;
}
