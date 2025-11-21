import makeWASocket, {
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import P from "pino";

let sock;

export function formatNumber(num) {
  num = num.replace(/\D/g, "");
  return num + "@s.whatsapp.net";
}




export async function initWhatsapp() {
  const { state, saveCreds } = await useMultiFileAuthState("whatsapp-session");

  sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, P().child({ level: "fatal" })),
    },
    logger: P({ level: "fatal" }),
    printQRInTerminal: false,
  });

  global.client = sock;

  sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
    if (qr) {
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("WhatsApp Connected 🎉");
    }

    if (connection === "close") {
      const wasLoggedOut =
        lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut;

      if (wasLoggedOut) {
        console.log("WhatsApp logged out — remove session and re-authenticate");
        return;
      }

      console.log("WhatsApp Disconnected ❌ Reconnecting…");

      try {
        if (sock && typeof sock.end === "function") sock.end();
      } catch (err) { }

      setTimeout(() => initWhatsapp(), 3000);
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

export function getSocket() {
  if (!sock) throw new Error("WhatsApp socket not initialized");
  return sock;
}
