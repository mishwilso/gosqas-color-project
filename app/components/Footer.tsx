import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer',
  setup() {
    return () => (
      <footer class="bg-gray-800 text-gray-300 mt-12 border-t-white">
        <div class="container mx-auto px-4 py-6 text-center">
          <p class="text-sm">
            Built with Nuxt.js + Azure Table Storage | Press SPACE to generate!
          </p>
        </div>
      </footer>
    )
  }
})
