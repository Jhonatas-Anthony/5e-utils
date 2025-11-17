<script setup lang="ts">
// import { i18n, setLocale } from '@/i18n'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { menuItems } from '@/config/menu'

const { t } = useI18n()

/* const currentLocale = ref<typeof i18n.global.locale.value>(
  locale.value as typeof i18n.global.locale.value,
) */

const menuOpen = ref(false)
const openSubmenu = ref<string | null>(null)
const navbarRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (!menuOpen.value) openSubmenu.value = null
}

function handleClickOutside(event: MouseEvent) {
  if (navbarRef.value && !navbarRef.value.contains(event.target as Node)) {
    menuOpen.value = false
    openSubmenu.value = null
  }
}

/* function changeLanguage() {
  setLocale(currentLocale.value)
} */

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <nav ref="navbarRef">
    <div>
      <button @click.stop="toggleMenu">{{ t('common.menu') }}</button>

      <!-- <select v-model="currentLocale" @change="changeLanguage">
        <option value="pt">Português Brasil</option>
        <option value="en">English (in progress)</option>
      </select> -->

      <!-- <button class="retro-toggle" @c  lick="toggleTheme">
        <span v-if="themeStore.theme !== 'light-theme'">🌙</span>
        <span v-else>☀️</span>
      </button> -->
    </div>

    <div v-if="menuOpen" class="menu-bar">
      <ul class="menu-root">
        <li v-for="item in menuItems" :key="item.label" class="menu-item">
          <template v-if="item.children">
            <span class="menu-button">{{ t(item.label) }}</span>

            <ul class="submenu">
              <li v-for="subitem in item.children" :key="subitem.label">
                <router-link :to="subitem.route!">
                  {{ t(subitem.label) }}
                </router-link>
              </li>
            </ul>
          </template>

          <template v-else>
            <router-link class="menu-button" :to="item.route!">
              {{ t(item.label) }}
            </router-link>
          </template>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
nav {
  font-family: "Press Start 2P", monospace;
  background: var(--color-bg);
  color: var(--color-text);
  border-bottom: 4px solid var(--color-border);
  padding: 10px;
  box-shadow: 0 0 0 4px #000;
  position: relative;
}

/* Container da parte superior */
nav>div:first-child {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Botão retrô genérico */
nav button,
nav select {
  font-family: inherit;
  font-size: 12px;
  padding: 6px 10px;
  background: var(--bg);
  color: var(--color-text);
  border: 2px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 0 0 3px #000;
  cursor: pointer;
}

nav button:hover,
nav select:hover {
  filter: brightness(1.1);
}

nav select {
  cursor: pointer;
}

/* Botão de tema */
.retro-toggle {
  width: 32px;
  height: 32px;
  text-align: center;
  font-size: 16px;
  padding: 0;
  display: grid;
  place-items: center;
}

/* MENU DROPDOWN ===================================================== */

.menu-bar {
  margin-top: 12px;
}

.menu-root {
  list-style: none;
  display: flex;
  gap: 16px;
  padding: 0;
  margin: 0;
}

.menu-item {
  position: relative;
}

.menu-button {
  font-family: inherit;
  font-size: 12px;
  background: var(--bg);
  padding: 6px 10px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 0 0 3px #000;
  cursor: pointer;
  display: inline-block;
  color: var(--color-text);
}

.menu-button:hover {
  filter: brightness(1.1);
}

/* SUBMENU RETRÔ VIA HOVER */
.submenu {
  display: none;
  position: absolute;
  background: var(--bg);
  border: 3px solid var(--color-border);
  box-shadow: 0 0 0 4px #000;
  padding: 8px;
  list-style: none;
  top: 100%;
  left: 0;
  z-index: 10;
  min-width: 180px;
}

.menu-item:hover .submenu {
  display: block;
}

.submenu li {
  margin-bottom: 6px;
}

.submenu li:last-child {
  margin-bottom: 0;
}

.submenu a {
  background: var(--color-primary);
  display: block;
  padding: 6px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 0 0 3px #000;
}

.submenu a:hover {
  filter: brightness(1.1);
}

/* ANIMAÇÃO OPCIONAL PIXEL POP ========================== */
button:active,
a:active {
  transform: translateY(2px);
  box-shadow: 0 0 0 1px #000;
  transition: 0.05s;
}
</style>
