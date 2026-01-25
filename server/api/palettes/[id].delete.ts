// DELETE palette by ID
import { defineEventHandler, getRouterParams } from 'h3';
import { tableClient } from "../../../utils/azureStorage";
import { createError } from 'h3';

export default defineEventHandler(async (e) => {
    try {

        // grabs context
        const id = getRouterParams(e).id;

        // if no id - give an error
        if (!id) {
            throw createError({
                statusCode: 400,
                message: 'Palette ID is required'
            })
        }

        // else delete id
        await tableClient.deleteEntity('palettes', id);

        // let them know it worked :)
        return { success: true }

    } catch (error : any){
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Failed to delete palette'
        })
    }
})