export const SESSION_COOKIE = "ma_admin";
import { normaliseUrl } from "./urls";

export const backendUrl = () => normaliseUrl(process.env.BACKEND_URL, "http://localhost:4000");

/** Explains a failed connection to the backend, naming the address that was tried. */
export function unreachableMessage(err: unknown) {
  const cause = (err as { cause?: { code?: string; message?: string } })?.cause;
  const reason = cause?.code ?? cause?.message ?? (err as Error)?.message ?? "unknown error";
  return `Can't reach the backend at ${backendUrl()} (${reason}). Check BACKEND_URL in the superadmin's environment variables.`;
}
