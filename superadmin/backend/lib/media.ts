import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";

// Files are stored in MongoDB GridFS so everything lives in the practice's own database (UK/EU region).
export function bucket() {
  return new GridFSBucket(mongoose.connection.db as never, { bucketName: "media" });
}

export function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

export async function findFile(id: string) {
  const oid = toObjectId(id);
  if (!oid) return null;
  const [file] = await bucket().find({ _id: oid }).toArray();
  return file ?? null;
}

export function streamFile(id: string) {
  return bucket().openDownloadStream(toObjectId(id)!);
}
