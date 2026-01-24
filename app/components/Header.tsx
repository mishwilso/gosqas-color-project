import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Header',
  setup() {
    return () => (
      <header>
        <nav>
          <h1>GOSQAS Color Project</h1>
        </nav>
      </header>
    )
  }
})
