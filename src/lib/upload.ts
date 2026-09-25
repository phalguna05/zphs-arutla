import "server-only";
import { put } from "@vercel/blob";

export const uploadsEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function uploadFiles(files: File[], folder: string) {
  const real = files.filter((f) => f instanceof File && f.size > 0);
  if (!real.length || !uploadsEnabled()) return [];
  const results = await Promise.all(
    real.map((file) => put(`${folder}/${file.name}`, file, { access: "public", addRandomSuffix: true })),
  );
  return results.map((r) => r.url);
}
