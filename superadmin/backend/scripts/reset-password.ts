// Resets a superadmin user's password (for a forgotten owner password).
//   npm run reset-password -- ben@momentumaccounting.uk                → generates a strong password
//   npm run reset-password -- ben@momentumaccounting.uk "MyNewPass123" → sets the given password (12+ characters)
// Uses MONGODB_URI from .env, so it resets the user in whichever database that points to.
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { connectDB } from "@/lib/db";
import { AdminUser } from "@/lib/models";

process.loadEnvFile?.(".env");

async function main() {
  const email = process.argv[2]?.toLowerCase();
  if (!email) throw new Error("Usage: npm run reset-password -- <email>");
  const conn = await connectDB();
  const user = await AdminUser.findOne({ email });
  if (!user) throw new Error(`No superadmin user with email ${email} in database "${conn.connection.name}"`);
  const password = process.argv[3] ?? randomBytes(12).toString("base64url");
  if (password.length < 12) throw new Error("Password must be at least 12 characters");
  user.passwordHash = await bcrypt.hash(password, 12);
  user.active = true;
  await user.save();
  console.log(`\nPassword reset for ${email} (database "${conn.connection.name}")` + (process.argv[3] ? "" : `\n  new password: ${password}`));
  await conn.disconnect();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
