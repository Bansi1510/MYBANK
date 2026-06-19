import makeWASocket, {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";

let sock;

export async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: true, // IMPORTANT
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📱 Scan QR:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ WhatsApp Connected");
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      console.log("❌ Connection closed:", statusCode);

      // IMPORTANT SAFE RECONNECT
      if (statusCode !== DisconnectReason.loggedOut) {
        console.log("♻️ Restarting WhatsApp...");
        setTimeout(() => start(), 5000);
      }
    }
  });
}



export function getSocket() {
  if (!sock) throw new Error("WhatsApp not connected yet");
  return sock;
}


export function formatNumber(num) {
  return num.replace(/\D/g, "") + "@s.whatsapp.net";
}