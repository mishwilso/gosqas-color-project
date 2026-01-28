<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import PaletteCreator from '@/components/PaletteCreator.vue'
import PaletteGallery from '@/components/PaletteGallery.vue'
</script>

<template>
  <div class="h-screen bg-background overflow-hidden flex flex-col">
    <Header />
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Sticky Color Creator -->
      <div class="shrink-0 bg-background">
        <div class="max-w-3xl mx-auto px-4 py-6">
          <PaletteCreator />
        </div>
      </div>

      <div class="border-t border-border" />

      <!-- Scrollable palette area -->
      <div class="relative flex-1 overflow-y-auto">
        <div class="flex-1 max-w-3xl mx-auto px-4 py-6 min-h-full">
          <PaletteGallery />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
