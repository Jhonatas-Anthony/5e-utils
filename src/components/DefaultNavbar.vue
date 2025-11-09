<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { menuItems } from '@/config/menu'

const menuOpen = ref(false)
const openSubmenu = ref<string | null>(null)
const menuRef = ref<HTMLElement | null>(null)

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
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    menuOpen.value = false
    openSubmenu.value = null
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <nav ref="navbarRef">
    <button @click.stop="toggleMenu">☰ Menu</button>

    <div v-if="menuOpen" class="menu" ref="menuRef">
      <ul>
        <li v-for="item in menuItems" :key="item.label">
          <template v-if="!item.children">
            <router-link :to="item.route || '#'">{{ item.label }}</router-link>
          </template>

          <template v-else>
            <button @click.stop="toggleSubmenu(item.label)">
              {{ item.label }}
            </button>
            <ul v-if="isSubmenuOpen(item.label)">
              <li v-for="child in item.children" :key="child.label">
                <router-link :to="child.route || '#'">{{ child.label }}</router-link>
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </div>
  </nav>
</template>
