<script setup lang="ts">
import { i18n, setLocale } from '@/i18n'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const currentLocale = ref<typeof i18n.global.locale.value>(
  locale.value as typeof i18n.global.locale.value,
)

const menuOpen = ref(false)
const openSubmenu = ref<string | null>(null)
const navbarRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (!menuOpen.value) openSubmenu.value = null
}

function toggleSubmenu(label: string) {
  openSubmenu.value = openSubmenu.value === label ? null : label
}

function isSubmenuOpen(label: string) {
  return openSubmenu.value === label
}

function handleClickOutside(event: MouseEvent) {
  if (navbarRef.value && !navbarRef.value.contains(event.target as Node)) {
    menuOpen.value = false
    openSubmenu.value = null
  }
}

function changeLanguage() {
  setLocale(currentLocale.value)
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <nav ref="navbarRef">
    <div>
      <button @click.stop="toggleMenu">{{ t('common.menu') }}</button>

      <select v-model="currentLocale" @change="changeLanguage">
        <option value="pt">Português Brasil</option>
        <option value="en">English</option>
      </select>
    </div>

    <div v-if="menuOpen">
      <ul>
        <li>
          <router-link to="/">{{ t('navbar.home') }}</router-link>
        </li>
        <li>
          <button @click.stop="toggleSubmenu('users')">
            {{ t('navbar.users.title') }}
          </button>
          <ul v-if="isSubmenuOpen('users')">
            <li>
              <router-link to="/users">{{ t('navbar.users.list') }}</router-link>
            </li>
            <li>
              <router-link to="/users/new">{{ t('navbar.users.new') }}</router-link>
            </li>
          </ul>
        </li>
        <li>
          <button @click.stop="toggleSubmenu('settings')">
            {{ t('navbar.settings.title') }}
          </button>
          <ul v-if="isSubmenuOpen('settings')">
            <li>
              <router-link to="/settings/profile">{{ t('navbar.settings.profile') }}</router-link>
            </li>
            <li>
              <router-link to="/settings/preferences">{{
                t('navbar.settings.preferences')
              }}</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>
