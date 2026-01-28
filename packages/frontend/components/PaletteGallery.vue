<script setup lang="ts">
// PaletteGallery.vue 

import { onMounted, ref } from 'vue'
import type { Palette } from '../utils/types'
import PaletteCard from './PaletteCard.vue'
import { getPalettes, deletePalette as deletePaletteApi } from '../services/paletteApi'

const palettes = ref<Palette[]>([])
const isLoading = ref(true)

// grabs all palettes from the API
const fetchPalettes = async () => {
  isLoading.value = true

  try {
    // hit the GET /api/palettes endpoint
    const response = await getPalettes()
    console.log('API response:', response)
    palettes.value = response.data
  } catch (error) {
    console.error('Failed to fetch palettes:', error)
  } finally {
    isLoading.value = false
  }
}

// DELETE /api/palettes/{id}
const deletePalette = async (id: string) => {
  // make sure user actually want to delete it
  if (!confirm('Delete this palette?')) return

  try {
    await deletePaletteApi(id)
    // refresh the list after deleting
    await fetchPalettes()
  } catch (error) {
    alert('Failed to delete palette')
  }
}

// copy hex to clipboard
const copyHex = async (hex: string) => {
  await navigator.clipboard.writeText(hex)
  alert(`Copied ${hex}`)
}

onMounted(async () => {
  // fetch palettes when component loads
  await fetchPalettes()

  // listen for when PaletteCreator saves something so we can refresh (ask Vincent for better method :D)
  window.addEventListener('palette-saved', fetchPalettes)
})

</script>

<template>
  <div>
    <!-- header with count -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-base font-semibold text-foreground">Your Palettes</h2>
      <span class="text-sm text-muted-foreground">
        {{ palettes.length }} saved
      </span>
    </div>

    <!-- Case: load, no palettes, palettes -->
    <!-- loading state -->
    <div v-if="isLoading" class="bg-card/50 rounded-2xl p-12 text-center border border-dotted border-border">
      <p class="text-muted-foreground">Loading palettes...</p>
    </div>

    <!-- empty state - no palettes yet -->
    <div v-else-if="palettes.length === 0" class="bg-card/50 rounded-2xl p-12 text-center border border-dotted border-border">
      <p class="text-muted-foreground mb-1">No palettes yet</p>
      <p class="text-sm text-muted-foreground">Create your first palette above :)</p>
    </div>

    <!-- the actual palette grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <PaletteCard
        v-for="palette in palettes"
        :key="palette.id"
        :name="palette.name"
        :colors="palette.colors || []"
        @delete="deletePalette(palette.id)"
        @copy="copyHex"
      />
    </div>
  </div>
</template>
