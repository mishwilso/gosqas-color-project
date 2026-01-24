import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer',
  setup() {
    return () => (
      <footer>
        <p>&copy; {new Date().getFullYear()} GOSQAS Color Project</p>
      </footer>
    )
  }
})
