import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Header',
  setup() {
    return () => (
      <header class="bg-background border-b border-border">
        <div class="max-w-3xl mx-auto px-4 py-4">
          <h1 class="text-lg font-semibold text-foreground">Color Palette Generator</h1>
        </div>
      </header>
    )
  }
})
