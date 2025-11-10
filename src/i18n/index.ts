import { createI18n } from 'vue-i18n'
import pt from './locales/pt-BR'
import en from './locales/en'

const DEFAULT_LOCALE = localStorage.getItem('locale') || 'pt'

export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: 'en',
  messages: {
    pt,
    en,
  },
})

export function setLocale(locale: typeof i18n.global.locale.value) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}
