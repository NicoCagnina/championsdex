import { useStore } from './store'
import { en } from './locales/en'
import { es } from './locales/es'

const DICTS = { en, es } as const

function getPath(obj: any, path: string): string {
  const keys = path.split('.')
  let cur = obj
  for (const k of keys) {
    if (cur == null || typeof cur !== 'object') return path
    cur = cur[k]
  }
  return typeof cur === 'string' ? cur : path
}

export function useT() {
  const locale = useStore(s => s.locale)
  const dict = DICTS[locale as keyof typeof DICTS] ?? en

  function t(key: string): string {
    return getPath(dict, key)
  }

  return { t, locale: locale as 'en' | 'es' }
}
