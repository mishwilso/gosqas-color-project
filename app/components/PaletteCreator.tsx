import type { Color } from '../../types/palette';
import { generatePalette, regenerateWithLocks} from '../../utils/colorGenerator';
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import { Lock, Unlock,RefreshCw } from 'lucide-vue-next';
import { $fetch } from 'ofetch';

export default defineComponent({
    name: 'Palette Creator',
    setup() {   
        const paletteName = ref('');
        const colors = ref<Color[]>(generatePalette());
        const isSaving = ref(false);

        const handleColorChange = (index: number, e: Event) => {
            const value = (e.target as HTMLInputElement).value;
            const currentColor = colors.value[index];
            if (currentColor){
                colors.value[index] = {hex: value, locked: currentColor.locked};
            }
        }
 
        // toggle locks
        const handleToggleLock = (index: number, e: Event) => {
            e.stopPropagation();
            const currentColor = colors.value[index];
            if (currentColor){
                colors.value[index] = {hex: currentColor.hex, locked: !currentColor.locked};
            }
        }

        const isLighterColor = (hexColor: string) => {
            const hex = hexColor.replace('#', '');

            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 7), 16);

            const brightness = (0.2126 * r) + (0.7152 * g) + (0.0722 * b)

            return brightness > 128;
        }
        


        // save Pallete to database
        const savePalette = async() => {
            // ensure valid palette name
            if (!paletteName.value.trim()) {
                alert('Please enter a palette name');
                return;
            }

            isSaving.value = true;

            try {
                await $fetch('/api/palettes', {
                    method: 'POST',
                    body: {
                        name: paletteName.value,
                        colors: colors.value
                    }
                });

                // reset the form
                paletteName.value = '';

                // maybe not..cause what if user want multiple palettes with a saved color?
                // colors.value = generatePalette()

                // toss event
                window.dispatchEvent(new Event('palette-saved'));

            } catch {

            } finally {
                isSaving.value = false;
            }
        }

        // keyboard shortcut to generate (Space, mount, unmount)
        const handleKeyPress = (e: KeyboardEvent) => {
            // ensure target in the creator and not like- the input
            if (e.code === 'Space' && e.target === document.body){
                e.preventDefault();
                colors.value = regenerateWithLocks(colors.value);
            }
        }

        onMounted(() => {
            window.addEventListener('keydown', handleKeyPress);
        })

        onUnmounted(() => {
            window.removeEventListener('keydown', handleKeyPress);
        })

        return () => (
        <div class="space-y-4">
            <div class="flex h-40 rounded-xl overflow-hidden">
                {colors.value.map((color, index) => {
                    
                    const textColor = isLighterColor(color.hex) ? "text-black/70" : "text-white/90"
                    
                    return (
                        <div
                            key={index}
                            class="flex-1 relative group flex flex-col justify-center items-center transition-all hover:flex-[1.3]"
                            style={{backgroundColor: color.hex}}
                        >
                            {/* Color Picker */}
                            <input
                                type="color"
                                value="color"
                                onChange={(e) => handleColorChange(index, e)}
                                class={`absolute inset-0 h-full w-full opacity-0 cursor-pointer
                                    focus-visible:opacity-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                            />

                            {/* hex code */}
                            <span class={`font-mono text-sm font-medium ${textColor} uppercase pointer-events-none`}>
                                {color.hex}
                            </span>

                            {/* lock button */}
                            <button 
                                onClick={(e) => handleToggleLock(index, e)}
                                class={`absolute bottom-3 p-1.5 transition-all rounded-md 
                                    ${textColor} 
                                    ${color.locked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                                    hover:bg-black/10
                                    focus-visible:opacity-100`}
                            >
                                {color.locked ? <Lock class="w-4 h-4"/>  : <Unlock class="w-4 h-4"/>}
                            </button>
                        </div>
                    )
                })}
            </div>
            <div class="flex items-center gap-3">
                {/* Palette name */}
                <input
                    type='text'
                    value={paletteName.value}
                    onChange={(e) => paletteName.value = (e.target as HTMLInputElement).value}
                    class="flex-1 h-10 bg-secondary border-0 rounded-md p-4"  
                    placeholder='Palette name' 
                />

                {/* Regencolor button */}
                <button
                    onClick={() => colors.value = regenerateWithLocks(colors.value)}
                    class="h-10 w-10 shrink-0 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                    <RefreshCw class="h-4 w-4 mx-auto " />
                </button>

                {/* save color button */}
                <button
                    onClick={savePalette}
                    disabled = {!paletteName.value}
                    class={`h-10 w-20 shrink-0 border-0 rounded-md bg-primary 
                        text-primary-foreground  text-sm 
                        hover:bg-primary/90 
                        disabled:pointer-events-none disabled:opacity-50
                        transition-colors
                        `}
                >
                    {isSaving.value ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
        )
    }
})