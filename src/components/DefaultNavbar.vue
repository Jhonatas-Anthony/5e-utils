<script setup lang="ts">
import { i18n, setLocale } from '@/i18n'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { menuItems } from '@/config/menu'

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
        <li v-for="item in menuItems" :key="item.label">
          <template v-if="item.children">
            <button @click.stop="toggleSubmenu(item.label)">
              {{ t(item.label) }}
            </button>
            <ul v-if="isSubmenuOpen(item.label)">
              <li
                v-for="subitem in item.children"
                :key="subitem.label"
              >
                <router-link :to="subitem.route!">
                  {{ t(subitem.label) }}
                </router-link>
              </li>
            </ul>
          </template>

          <template v-else>
            <router-link :to="item.route!">
              {{ t(item.label) }}
            </router-link>
          </template>
        </li>
      </ul>
    </div>
  </nav>
</template>
