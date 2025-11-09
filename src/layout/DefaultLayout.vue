<script setup lang="ts">
import DefaultNavbar from '@/components/DefaultNavbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <DefaultNavbar />
    <main class="flex-1 p-4">
      <router-view />
    </main>
    <footer class="bg-gray-200 text-center py-2">© 2025</footer>
  </div>
</template>
