// POST new palette
import { defineEventHandler, readBody } from 'h3';
import { tableClient } from "@/utils/azureStorage";
import { createError } from 'h3';
import type { Palette, PaletteEntity } from "@/types/palette";

export default defineEventHandler(async (e) => {
    try {
        const entry = await readBody(e);
        const { name, colors } = entry;

        if (!name || !colors || !Array.isArray(colors)) {
            throw createError({
                statusCode: 400,
                message: 'Invalid palette data'
            });
        }

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        // Create entity to give to azurite table
        const entity: PaletteEntity = {
            partitionKey: 'palettes',
            rowKey: id,
            name,
            colors: JSON.stringify(colors),
            createdAt
        }

        await tableClient.createEntity(entity);


        // create and return the palette we added (for validation)
        const palette: Palette = {
            id,
            name,
            colors,
            createdAt
        }

        // for testing
        console.log(palette);
        return palette

    } catch (error : any) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Failed to create palette"
        });
    } 
})