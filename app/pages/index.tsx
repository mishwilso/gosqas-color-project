// pages/index.tsx
import { defineComponent, ref } from 'vue'
import Footer from '~/components/Footer'
import MainContent from '~/components/MainContent'
import Header from '~/components/Header'

export default defineComponent({
  setup() {
    const count = ref(0)
    
    return () => (
      <div class="p-8">
        <Header/>
        <MainContent/>
        <Footer/>
      </div>
    )
  }
})