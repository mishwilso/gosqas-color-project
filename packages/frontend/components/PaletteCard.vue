<script setup lang="ts">
// PaletteCard.vue

import type { Color } from '../utils/types'
import { ref } from 'vue'
import { Check, Trash2 } from 'lucide-vue-next'

// define Props we accept from parent
const props = defineProps<{
  name: string
  colors: Color[]
}>()

// Define the events the component can emit to the parent
const emit = defineEmits<{
  delete: []               // delete event is passed down with id, so no payload
  copy: [hex: string]      // copy event with the hex color string as payload
}>()

// for the checkmark feedback
const copiedIndex = ref<number | null>(null)
const hoveredIndex = ref<number | null>(null)

// same brightness check as PaletteCreator 
const isLighterColor = (hexColor: string) => {
  const hex = hexColor.replace('#', '')

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 7), 16)

  const brightness = (0.2126 * r) + (0.7152 * g) + (0.0722 * b)

  return brightness > 128
}

// copy color to clipboard and show checkmark 
const handleCopyColor = async (e: Event, color: string, index: number) => {
  e.stopPropagation()
  emit('copy', color)
  copiedIndex.value = index

  // reset after a bit so the checkmark goes away
  setTimeout(() => copiedIndex.value = null, 1500)
}

const getTextColor = (hex: string) => {
  return isLighterColor(hex) ? 'text-gray-800' : 'text-white'
}

</script>

<template>
  <div class="group">
    <!-- the color strip -->
    <div class="flex rounded-lg h-24 overflow-hidden shadow-sm">
      <button
        v-for="(color, index) in colors"
        :key="index"
        :title="`Copy ${color.hex}`"
        :style="{ backgroundColor: color.hex }"
        class="flex-1 relative flex items-center justify-center cursor-pointer transition-all duration-200 hover:flex-[1.4]"
        @click="(e) => handleCopyColor(e, color.hex, index)"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
      >
        <!-- show hex on hover, checkmark after copy -->
        <span
          v-if="hoveredIndex === index"
          :class="['text-xs font-semibold uppercase', getTextColor(color.hex)]"
        >
          <Check v-if="copiedIndex === index" class="h-3 w-3" />
          <template v-else>{{ color.hex.replace('#', '') }}</template>
        </span>
      </button>
    </div>

    <!-- palette name + delete button row -->
    <div class="flex items-center justify-between mt-3 px-1">
      <h3 class="font-medium text-foreground text-sm">{{ name }}</h3>
      <!-- trash button - only visible on hover -->
      <button
        class="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
        title="Delete Palette"
        @click="emit('delete')"
      >
        <Trash2 class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
