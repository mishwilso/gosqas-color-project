import type { Color } from "types/palette";
import { defineComponent, ref } from "vue";
import { Check, Trash2 } from 'lucide-vue-next';
import type { PropType } from "vue";


interface PaletteCardProps {
    name: string;
    colors: Color[];
    onDelete: () => void;
    onCopy: (hex: string) => void;
}

export default defineComponent ({
    name: 'PaletteCard',
    props: {
        name: { type: String, required: true },
        colors: { type: Array as PropType<Color[]>, required: true },
        onDelete: { type: Function as PropType<() => void>, required: true },
        onCopy: { type: Function as PropType<(hex: string) => void>, required: true },
    },
    setup(props) {
        const copiedIndex = ref<number | null>(null);
        const hoveredIndex = ref<number | null>(null);

        console.log(props.colors);

        const isLighterColor = (hexColor: string) => {
            const hex = hexColor.replace('#', '');

            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 7), 16);

            const brightness = (0.2126 * r) + (0.7152 * g) + (0.0722 * b)

            return brightness > 128;
        }

        const handleCopyColor = async (e: Event, color: string, index: number) => {
            e.stopPropagation;
            props.onCopy(color);
            copiedIndex.value = (index);
            setTimeout(() => copiedIndex.value = (null), 1500);
        }

        return () => (
            <div class="group">
                {/* Pallete */}
                <div class="flex rounded-lg h-24 overflow-hidden shadow-sm">
                    {props.colors.map((color, index) => {
                        const textColor = isLighterColor(color.hex) ? "text-gray-800" : "text-white";

                        return <button
                            key={index}
                            title={`Copy ${color.hex}`}
                            onClick={(e) => handleCopyColor(e, color.hex, index)}
                            style={{backgroundColor: color.hex}}
                            onMouseenter={() => hoveredIndex.value = (index)}
                            onMouseleave={() => hoveredIndex.value = (null)}
                            class="flex-1 relative flex items-center justify-center  cursor-pointer transition-all duration-200 hover:flex-[1.4] "
                        >
                            {
                                hoveredIndex.value === index && (
                                    <span class={`text-sm text-white font-semibold uppercase ${textColor}`}>
                                        {copiedIndex.value === index ? (
                                            <Check class="h-3 w-3" />
                                        ) : (
                                            color.hex.replace('#', '')
                                        )}
                                    </span>
                                )
                            }
                        </button>
                    })}
                </div>
                {/* Palette Name and Delete Button */}
                <div class="flex items-center justify-between mt-3 px-1">
                    <h3 class="font-medium text-foreground text-sm">{props.name}</h3>
                    <button
                        onClick={props.onDelete}
                        class="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                        title="Delete Palette"
                    >
                        <Trash2 class="h-4 w-4"/>
                    </button>
                </div>
            </div>
        )
    }
})