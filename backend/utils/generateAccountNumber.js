import sql from "./db.js";
import crypto from "crypto";

export const generateAccountNumber = async () => {
  let accountNumber;

  while (true) {
    accountNumber = crypto.randomInt(10000000000000, 99999999999999).toString();

    const existing = await sql`
      SELECT id FROM accounts WHERE account_number = ${accountNumber}
    `;

    if (existing.length === 0) {
      return accountNumber;
    }
  }
};
