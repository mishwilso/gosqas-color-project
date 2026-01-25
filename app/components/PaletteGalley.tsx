import { defineComponent, onMounted, ref } from 'vue'
import type { Palette } from 'types/palette';
import PaletteCard from './PaletteCard';
import { $fetch } from 'ofetch';
import { useFetch } from 'nuxt/app';

// TODO: Make a nicer alert pop up :)

export default defineComponent({
    name: 'Palette gallery',
    setup() {  
        
        const palettes = ref<Palette[]>([]);
        const isLoading = ref(true);

        const fetchPalettes = async() => {
            isLoading.value = true;

            try {
                const response  = await $fetch('/api/palettes')
                console.log('API response:', response);
                palettes.value = response.data;
            
            } catch (error) {
                console.error('Failed to fetch palettes:', error)
            } finally {
                isLoading.value = false;
            }
        }

        const deletePalette = async(id: string) => {
            // double check with user
            if (!confirm('Delete this palette?')) return
            
            try {
                await $fetch(`/api/palettes/${id}`, {
                    method: 'DELETE'
                })
                await fetchPalettes()
            } catch (error) {
                alert('Failed to delete palette');
            }
        }

        const copyHex = async (hex: string) => {
            await navigator.clipboard.writeText(hex)
            alert(`Copied ${hex}`)
        }

        onMounted(async () => {
            await fetchPalettes()

            // Listen for the palette-saved event
            window.addEventListener('palette-saved', fetchPalettes)
        })
        
        return () => (
        <div>
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-base font-semibold text-foreground">Your Palettes</h2>
                <span class="text-sm text-muted-foreground">
                    {palettes.value.length} saved
                </span>
            </div>

            {isLoading.value ? (
                <div class="bg-card/50 rounded-2xl p-12 text-center border border-dotted border-border">
                    <p class="text-muted-foreground">Loading palettes...</p>
                </div>
            ) : palettes.value.length === 0 ? (
                <div class="bg-card/50 rounded-2xl p-12 text-center border border-dotted border-border">
                    <p class="text-muted-foreground mb-1">No palettes yet</p>
                    <p class="text-sm text-muted-foreground">Create your first palette above :)</p>
                </div>
            ) : (
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {palettes.value.map((palette) => (
                        <PaletteCard
                            key={palette.id}
                            name={palette.name}
                            colors={palette.colors || []}
                            onDelete={() => deletePalette(palette.id)}
                            onCopy={copyHex}
                        />
                    ))}
                </div>
            )}
            {/* <div class="bg-card px-6 py-6 rounded-md absolute bottom-4 left-1/2 -translate-x-1/2">
                {palettes.value.toString()}
            </div> */}
        </div>
        )
  }
})