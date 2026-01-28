<script setup lang="ts">
// PaletteCreator.vue

import type { Color } from '../utils/types'
import { generatePalette, regenerateWithLocks } from '../utils/colorGenerator'
import { createPalette } from '../services/paletteApi'
import { ref, onMounted, onUnmounted } from 'vue'
import { Lock, Unlock, RefreshCw } from 'lucide-vue-next'

// state for the palette name input
const paletteName = ref('')
const colors = ref<Color[]>(generatePalette())
const isSaving = ref(false)

// when user picks a color from the color picker
const handleColorChange = (index: number, e: Event) => {
  const value = (e.target as HTMLInputElement).value
  const currentColor = colors.value[index]
  if (currentColor) {
    colors.value[index] = { hex: value, locked: currentColor.locked }
  }
}

// toggle lock on a color
const handleToggleLock = (index: number, e: Event) => {
  e.stopPropagation() // don't trigger the color picker
  const currentColor = colors.value[index]
  if (currentColor) {
    colors.value[index] = { hex: currentColor.hex, locked: !currentColor.locked }
  }
}

// used to decide if text should be black or white on top of it (works sometimes)
const isLighterColor = (hexColor: string) => {
  const hex = hexColor.replace('#', '')

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 7), 16)

  // fancy google formula for perceived brightness
  const brightness = (0.2126 * r) + (0.7152 * g) + (0.0722 * b)

  return brightness > 128
}

const getTextColor = (hex: string) => {
  return isLighterColor(hex) ? 'text-black/70' : 'text-white/90'
}

// saves the current palette to the database
const savePalette = async () => {
  if (!paletteName.value.trim()) {
    alert('Please enter a palette name')
    return
  }

  isSaving.value = true

  try {
    // POST to /api/palettes with name and colors
    await createPalette(paletteName.value, colors.value)
    paletteName.value = ''

    // tell gallery to refresh
    window.dispatchEvent(new Event('palette-saved'))
  } catch {
  } finally {
    isSaving.value = false
  }
}

const regenerate = () => {
  colors.value = regenerateWithLocks(colors.value)
}

// spacebar = new colors! :D
const handleKeyPress = (e: KeyboardEvent) => {
  // only trigger if pressing space on the body (not in an input)
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault()
    colors.value = regenerateWithLocks(colors.value)
  }
}

// set up keyboard listener
onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

// clean up when component unmounts
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<template>
  <div class="space-y-4">
    <!-- the color bars -->
    <div class="flex h-40 rounded-xl overflow-hidden">
      <div
        v-for="(color, index) in colors"
        :key="index"
        class="flex-1 relative group flex flex-col justify-center items-center transition-all hover:flex-[1.3]"
        :style="{ backgroundColor: color.hex }"
      >
        <!-- hidden color picker - click anywhere on the color to open it -->
        <input
          type="color"
          value="color"
          class="absolute inset-0 h-full w-full opacity-0 cursor-pointer focus-visible:opacity-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          @change="(e) => handleColorChange(index, e)"
        />

        <!-- hex code display -->
        <span
          :class="['font-mono text-sm font-medium uppercase pointer-events-none', getTextColor(color.hex)]"
        >
          {{ color.hex }}
        </span>

        <!-- lock/unlock button - shows on hover or if locked -->
        <button
          :class="[
            'absolute bottom-3 p-1.5 transition-all rounded-md hover:bg-black/10 focus-visible:opacity-100',
            getTextColor(color.hex),
            color.locked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          ]"
          @click="(e) => handleToggleLock(index, e)"
        >
          <Lock v-if="color.locked" class="w-4 h-4" />
          <Unlock v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- controls row -->
    <div class="flex items-center gap-3">
      <!-- palette name input -->
      <input
        v-model="paletteName"
        type="text"
        class="flex-1 h-10 bg-secondary border-0 rounded-md p-4"
        placeholder="Palette name"
      />

      <!-- regenerate button -->
      <button
        class="h-10 w-10 shrink-0 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        @click="regenerate"
      >
        <RefreshCw class="h-4 w-4 mx-auto" />
      </button>

      <!-- save button - disabled if no name entered -->
      <button
        :disabled="!paletteName"
        class="h-10 w-20 shrink-0 border-0 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50 transition-colors"
        @click="savePalette"
      >
        {{ isSaving ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </div>
</template>
