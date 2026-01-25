import { defineComponent, ref } from 'vue'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PaletteCreator from '@/components/PaletteCreator'
import PaletteGalley from '@/components/PaletteGalley'

export default defineComponent({
  setup() {
    
    return () => (
      <div class="min-h-screen bg-background overflow-hidden flex flex-col">
        <Header/>
        <main class="flex-1 flex flex-col overflow-hidden">
          {/* Sticky Color Creator */}
          <div class="shrink-0 bg-background">
            <div class="max-w-3xl mx-auto px-4 py-6">
              <PaletteCreator/>
            </div>
          </div>

          <div class="border-t border-border"/>
          
          {/* Scrollable palette area */}
          <div class="flex-1 overflow-y-auto">
            <div class="max-w-3xl mx-auto px-4 py-6">
              <PaletteGalley/>
            </div>
          </div>
        </main>
        <Footer/>
      </div>
    )
  }
})