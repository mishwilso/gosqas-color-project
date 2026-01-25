import type { Color } from '@/types/palette';
import { generatePalette, regenerateWithLocks} from '@/utils/colorGenerator';
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'Palette Creator',
    setup() {   
        const paletteName = ref('');
        const colors = ref<Color[]>(generatePalette());
        const isSaving = ref(false);

        const handleColorChange = (index: number, e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            const newColors = [...colors.value];
            newColors[index] = {hex: value, locked: false};
            colors.value = newColors;
        }

        const isLighterColor = (hexColor: string) => {
            const hex = hexColor.replace('#', '');

            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 7), 16);

            const brightness = (0.2126 * r) + (0.7152 * g) + (0.0722 * b)

            return brightness > 128;
        }
        
        // Regen colors
        const generate = () => {

        }

        // toggle locks

        // save Pallete to database


        // keyboard shortcut to generate (Space, mount, unmount)



        return () => (
        <div class="space-y-4">
            <div class="flex h-40 rounded-xl overflow-hidden">
                {colors.value.map((color, index) => {
                    
                    const textColor = isLighterColor(color.hex) ? "text-black/70" : "text-white/90"
                    
                    return (
                        <div
                            key={index}
                            class="flex-1 relative flex flex-col justify-center items-center transition-all"
                            style={{backgroundColor: color.hex}}
                        >
                            {/* Color Picker */}
                            <input
                                type="color"
                                value="color"
                                onChange={(e) => handleColorChange(index, e)}
                                class="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                            />

                            {/* hex code */}
                            <span class={`font-mono text-sm font-medium ${textColor} uppercase pointer-events-none`}>
                                {color.hex}
                            </span>

                            {/* lock button */}
                            <button>
                                
                            </button>
                        </div>
                    )
                })}
            </div>
            <p>Palette Creator</p>
        </div>
        )
    }
})