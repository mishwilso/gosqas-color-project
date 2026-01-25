// GET all palettes
import { defineEventHandler } from 'h3';
import { tableClient } from "../../../utils/azureStorage";
import { createError } from 'h3';
import type { Palette, PaletteEntity } from "../../../types/palette";

export default defineEventHandler(async (e) => {
    try {
        const entities = tableClient.listEntities<PaletteEntity>()
        const palettes: Palette[] = []

        // Add entites to the palettes list
        for await (const entity of entities){
            palettes.push({
                id: entity.rowKey,
                name: entity.name,
                colors: JSON.parse(entity.colors),
                createdAt: entity.createdAt 
            })
        }

        // Sort em by newest. time? or day?
        palettes.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )

        return palettes;
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch palettes',
        })
    }
})