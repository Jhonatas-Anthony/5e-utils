<script setup lang="ts">
import DefaultNavbar from '@/components/DefaultNavbar.vue'

function sendToGithub() {
  window.open('https://github.com/Jhonatas-Anthony/5e-utils', '_blank')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <DefaultNavbar />
    <main class="flex-1 p-4">
      <router-view />
    </main>
    <footer class="bg-gray-200 text-center py-2">© 2025 <button class="underline" v-on:click="sendToGithub">GitHub</button></footer>
  </div>
</template>
