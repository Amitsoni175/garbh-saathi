import { useEffect, useRef } from 'react';

/** Shows an image stored as a Blob (IndexedDB), and frees its object URL afterwards. */
export function BlobImage({
  blob,
  alt,
  className = '',
}: {
  blob: Blob;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const url = URL.createObjectURL(blob);
    if (ref.current) ref.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [blob]);
  return (
    <img
      ref={ref}
      alt={alt}
      className={`bg-secondary/40 ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
