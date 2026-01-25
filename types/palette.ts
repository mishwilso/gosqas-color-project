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

export interface PaletteEntity {
    partitionKey: string
    rowKey: string
    name: string
    colors: string 
    createdAt:string 
    
}