import crypto from "crypto";

const iv = crypto.randomBytes(16);

const encryptionKey = process.env.ENCRYPTION_KEY;
if (!encryptionKey) throw new Error("ENCRYPTION_KEY not found in .env file");

export function encrypt(text: string) {
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey!),
    iv,
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(text: string) {
  let [ivData, encryptedData] = text.split(":");
  let iv = Buffer.from(ivData, "hex");
  let encryptedText = Buffer.from(encryptedData, "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey!),
    iv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
