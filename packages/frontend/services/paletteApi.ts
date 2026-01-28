// paletteApi.ts - API client functions for palette operations
import type { Palette, Color } from '../utils/types'

interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
}

export async function getPalettes(): Promise<ApiResponse<Palette[]>> {
    const response = await fetch('/api/palettes')
    return await response.json()
}

export async function createPalette(name: string, colors: Color[]): Promise<ApiResponse<Palette>> {
    const response = await fetch('/api/palettes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, colors })
    })
    return await response.json()
}

export async function deletePalette(id: string): Promise<void> {
    await fetch(`/api/palettes/${id}`, { method: 'DELETE' })
}
