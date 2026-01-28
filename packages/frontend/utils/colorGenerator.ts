import type { Color } from "./types";

// Needed: genrandColor, genrandompalettte, genpalettewith locks

// scales rand num to 0xFFFFFF (16777215) and converts to hex string (16)
// pad with leading zeros to ensure 6 digits, adds # prefix
export function generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

export function generatePalette(): Color[] {
    return Array.from({length: 5}, () => ({
        hex: generateRandomColor(),
        locked: false
    }))
}

export function regenerateWithLocks(currentPalette: Color[]): Color[] {
    return currentPalette.map(color =>
        color.locked
        ? color
        : { hex: generateRandomColor(), locked: false }
    )
}

// Validate hex Color Format - # [0-9A-F]x6
export function isValidHex(hex: string) : boolean {
    return /^#[0-9A-F]{6}$/i.test(hex)
}
