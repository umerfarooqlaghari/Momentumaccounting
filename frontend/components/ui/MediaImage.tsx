import Image from "next/image";
import { mediaUrl, unoptimizedMedia } from "@/lib/site";

/** Image uploaded through superadmin (served from the backend media library). */
export function MediaImage({ id, alt, className = "", sizes = "100vw", priority = false }: { id: string; alt: string; className?: string; sizes?: string; priority?: boolean }) {
  return <Image src={mediaUrl(id)} alt={alt} fill sizes={sizes} priority={priority} unoptimized={unoptimizedMedia} className={`object-cover ${className}`} />;
}
