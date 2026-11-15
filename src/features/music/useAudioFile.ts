import { useEffect, useState } from 'react';
import { audioFileExists, audioFileUrl } from '@/lib/audio';

/** 'checking' → 'present' | 'missing'. Never throws. */
export function useAudioFile(
  file: string | undefined,
  dir: string,
): 'checking' | 'present' | 'missing' {
  const [result, setResult] = useState<{ key: string; ok: boolean } | null>(null);
  const key = file ? `${dir}/${file}` : '';
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    void audioFileExists(audioFileUrl(file, dir)).then((ok) => {
      if (!cancelled) setResult({ key: `${dir}/${file}`, ok });
    });
    return () => {
      cancelled = true;
    };
  }, [file, dir]);
  if (!file) return 'missing';
  if (!result || result.key !== key) return 'checking';
  return result.ok ? 'present' : 'missing';
}
