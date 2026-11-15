import { useCallback } from 'react';
import { t as translate, type StringKey, type Vars } from '@/lib/i18n';
import { useSettings } from './settings';

/** `const t = useT(); t('tab.today')`: text in her chosen language. */
export function useT() {
  const { settings } = useSettings();
  const lang = settings.textLang;
  return useCallback((key: StringKey, vars?: Vars) => translate(key, lang, vars), [lang]);
}
