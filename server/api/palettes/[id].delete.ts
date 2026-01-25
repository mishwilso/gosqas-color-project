import { getTableClient } from "../../utils/tableClient";
import { defineEventHandler, createError, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  try {

    // grabs context
    const id = getRouterParam(event, "id");

    // if no id - give an error
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Palette ID is required",
      });
    }

    // else delete id
    const tableClient = await getTableClient();
    await tableClient.deleteEntity("palettes", id);


    // let them know it worked :)
    return {
      success: true,
      message: `Palette ${id} deleted successfully`,
    };
  } catch (error: any) {

    throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'Failed to delete palette'
    })

  }
});
