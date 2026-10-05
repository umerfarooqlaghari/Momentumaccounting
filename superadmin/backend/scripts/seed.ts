// Seeds MongoDB with initial content and the first owner account.
//   npm run seed            only fills empty collections (safe to re-run)
//   npm run seed -- --force replaces seeded collections (destroys edits!)
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { connectDB } from "@/lib/db";
import { getResource } from "@/lib/resources";
import { AdminUser, modelFor } from "@/lib/models";
import * as data from "./seed-data";

process.loadEnvFile?.(".env");

const force = process.argv.includes("--force");

const lists: Record<string, Record<string, unknown>[]> = {
  services: data.services,
  audiences: data.audiences,
  testimonials: data.testimonials,
  team: data.team,
  faqs: data.faqs,
  posts: data.posts,
  locations: data.locations,
  landingPages: data.landingPages,
  leadMagnets: data.leadMagnets,
  emailTemplates: data.emailTemplates,
  redirects: data.redirects,
};
const singletons: Record<string, Record<string, unknown>> = {
  settings: data.settings,
  quiz: data.quiz,
  calculator: data.calculator,
};

async function main() {
  const conn = await connectDB();
  console.log(`Connected to ${conn.connection.name}`);

  for (const [key, items] of Object.entries(lists)) {
    const Model = modelFor(getResource(key)!);
    await Model.syncIndexes();
    const count = await Model.countDocuments();
    if (count && !force) {
      console.log(`  ${key}: ${count} existing — skipped`);
      continue;
    }
    if (force) await Model.deleteMany({});
    await Model.insertMany(items);
    console.log(`  ${key}: inserted ${items.length}`);
  }

  for (const [key, doc] of Object.entries(singletons)) {
    const Model = modelFor(getResource(key)!);
    const existing = await Model.findOne();
    if (existing && !force) {
      console.log(`  ${key}: exists — skipped`);
      continue;
    }
    await Model.deleteMany({});
    await Model.create(doc);
    console.log(`  ${key}: created`);
  }

  if ((await AdminUser.countDocuments()) === 0) {
    const email = process.env.ADMIN_EMAIL ?? "ben@momentumaccounting.uk";
    const password = process.env.ADMIN_PASSWORD || randomBytes(12).toString("base64url");
    await AdminUser.create({ email, name: process.env.ADMIN_NAME ?? "Ben Keville", role: "owner", passwordHash: await bcrypt.hash(password, 12) });
    console.log(`\n  Owner account created\n    email:    ${email}\n    password: ${password}\n  Change it after first login.`);
  }

  await conn.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
