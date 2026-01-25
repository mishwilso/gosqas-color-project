// POST new palette
import { getTableClient, entityToPalette } from "../../utils/tableClient";
import type { PaletteEntity } from "../../../types/palette";
import { defineEventHandler, createError, readBody } from "h3";

interface CreatePaletteBody {
  name: string;
  colors: string[];
}

export default defineEventHandler(async (e) => {
  try {
    const entry = await readBody<CreatePaletteBody>(e);
    const { name, colors } = entry;

    // Validate request body
    if (!name || !colors || !Array.isArray(colors)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid palette data'
        });
    }

    const tableClient = await getTableClient();
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
    return {
      success: true,
      data: entityToPalette(entity),
    };

  } catch (error: any) {

    console.error("Error creating palette:", error);
    throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || "Failed to create palette"
    });
  }
});
