import makeWASocket, {
  fetchLatestBaileysVersion,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";

let sock;

export async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    auth: state,
    version,
    printQRInTerminal: false,

  });

  sock.ev.on("connection.update", (update) => {
    console.log("UPDATE:", update);

    if (update.qr) {
      console.log("📱 Scan QR:");
      qrcode.generate(update.qr, {
        small: true,
        margin: 1
      });
    }

    if (update.connection === "open") {
      console.log("✅ WhatsApp Connected");
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

export function getSocket() {
  if (!sock) throw new Error("WhatsApp not connected yet");
  return sock;
}


export function formatNumber(num) {
  return num.replace(/\D/g, "") + "@s.whatsapp.net";
}