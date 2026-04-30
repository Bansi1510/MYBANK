import bcrypt from "bcryptjs";
import { formatNumber, getSocket } from "./whatsapp.js";

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashOTP(otp) {
  return bcrypt.hashSync(otp, 10);
}

export const sendWhatsappOTP = async (mobile, otp) => {
  try {
    const sock = getSocket(); // ✅ correct

    const finalNumber = formatNumber(mobile);
    const msg = `Your verification OTP is: *${otp}*`;

    await sock.sendMessage(finalNumber, { text: msg });

    console.log(`OTP sent to ${finalNumber}`);
    return true;

  } catch (err) {
    console.log("WhatsApp OTP Error:", err.message);
    return false;
  }
};