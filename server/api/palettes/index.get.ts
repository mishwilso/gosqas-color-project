// GET all palettes
import { getTableClient, entityToPalette } from "../../utils/tableClient";
import type { PaletteEntity, Palette } from "../../../types/palette";
import { defineEventHandler, createError } from "h3";

export default defineEventHandler(async () => {
  try {
    const tableClient = await getTableClient();
    const palettes: Palette[] = []


    // List all entities in the table
    const entities = tableClient.listEntities<PaletteEntity>();

    for await (const entity of entities) {
      palettes.push(entityToPalette(entity));
    }

    // Sort em by newest. time? or day?
    palettes.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    return { success: true, data: palettes, };
  } catch (error: any) {
      console.error("Error fetching palettes:", error);
      
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to fetch palettes",
        data: error.message,
      });
  }
});
