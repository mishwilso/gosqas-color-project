export interface Color {
    hex: string
    locked: boolean
}

export interface Palette {
    id: string
    name: string
    colors: Color[]
    createdAt: string
}
