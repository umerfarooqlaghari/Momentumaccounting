import { Readable } from "node:stream";
import { json, preflight } from "@/lib/cors";
import { handler } from "@/lib/handler";
import { HttpError, requireRole } from "@/lib/auth";
import { bucket } from "@/lib/media";

export const OPTIONS = preflight;

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml", "image/gif", "application/pdf"];
const MAX_BYTES = 15 * 1024 * 1024;

export const GET = handler(async (request) => {
  await requireRole(request, ["owner", "editor"]);
  const files = await bucket().find().sort({ uploadDate: -1 }).limit(300).toArray();
  return json(request, {
    items: files.map((f) => ({
      _id: f._id,
      filename: f.filename,
      length: f.length,
      uploadDate: f.uploadDate,
      contentType: f.metadata?.contentType,
      alt: f.metadata?.alt ?? "",
    })),
  });
});

export const POST = handler(async (request) => {
  const session = await requireRole(request, ["owner", "editor"]);
  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "");
  if (!(file instanceof File)) throw new HttpError(422, "No file uploaded");
  if (!ALLOWED.includes(file.type)) throw new HttpError(422, "Only images and PDFs can be uploaded");
  if (file.size > MAX_BYTES) throw new HttpError(422, "File is larger than 15 MB");
  if (file.type.startsWith("image/") && file.type !== "image/svg+xml" && !alt.trim()) {
    throw new HttpError(422, "Alt text is required for images (accessibility)");
  }

  const upload = bucket().openUploadStream(file.name, {
    metadata: { contentType: file.type, alt, uploadedBy: session.email },
  });
  await new Promise<void>((resolve, reject) => {
    Readable.fromWeb(file.stream() as never)
      .pipe(upload)
      .on("finish", () => resolve())
      .on("error", reject);
  });
  return json(request, { item: { _id: upload.id, filename: file.name, contentType: file.type, alt } }, 201);
});
