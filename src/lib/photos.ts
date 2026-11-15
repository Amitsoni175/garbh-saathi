/** Photos (belly photos, Godh Bharai, Sanjhi art): compressed and stored on the phone. */
import { useLiveQuery } from 'dexie-react-hooks';
import { getTodayISO } from './clock';
import { db, type PhotoKind, type PhotoRow } from './db';

const TARGET_BYTES = 300 * 1024;
const MAX_SIDE = 1280;

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Resize to at most 1280px and re-encode until about 300 KB. JPEG works everywhere, including older iPhones. */
export async function compressImage(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  let width: number;
  let height: number;
  let source: CanvasImageSource;
  if (bitmap) {
    width = bitmap.width;
    height = bitmap.height;
    source = bitmap;
  } else {
    // Fallback for browsers without createImageBitmap support for this type.
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = url;
      });
      width = img.naturalWidth;
      height = img.naturalHeight;
      source = img;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height);
  let quality = 0.82;
  let blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  while (blob && blob.size > TARGET_BYTES && quality > 0.4) {
    quality -= 0.12;
    blob = await canvasToBlob(canvas, 'image/jpeg', quality);
  }
  return blob ?? file;
}

export async function savePhoto(
  blob: Blob,
  kind: PhotoKind,
  week: number,
  note?: string,
): Promise<number> {
  return db.photos.add({
    date: getTodayISO(),
    week,
    kind,
    blob,
    mime: blob.type || 'image/jpeg',
    note,
    createdAt: Date.now(),
  });
}

export function usePhotos(kind?: PhotoKind): PhotoRow[] | undefined {
  return useLiveQuery(async () => {
    const rows = kind
      ? await db.photos.where('kind').equals(kind).toArray()
      : await db.photos.toArray();
    return rows.sort((a, b) => a.createdAt - b.createdAt);
  }, [kind]);
}

/** Trigger a download of a blob (e.g. save a picture to the phone). */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
