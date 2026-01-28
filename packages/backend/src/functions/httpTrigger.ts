// httpTrigger.ts
// GET /api/palettes - fetch all palettes
// POST /api/palettes - create a new palette
// DELETE /api/palettes/{id} - delete a palette

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions"
import { getTableClient, entityToPalette } from "../utils/tableClient.js"
import type { PaletteEntity, Palette, Color } from "../types/palette.js"
import { randomUUID } from "crypto"

// ============================================================================
// GET /api/palettes - fetch all palettes
// ============================================================================
async function getPalettes(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request for GET /api/palettes")

  try {
    // get our table client
    const tableClient = await getTableClient()
    const palettes: Palette[] = []

    // listEntities returns an async iterator - gotta loop through it
    // still don't fully understand async iterators but this works :)
    const entities = tableClient.listEntities<PaletteEntity>()

    for await (const entity of entities) {
      palettes.push(entityToPalette(entity))
    }

    // sort by creation date (newest first...i thinkZ? )
    palettes.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // send back the goods :D
    return {
      status: 200,
      jsonBody: { success: true, data: palettes }
    }
  } catch (error: unknown) {
    const err = error as Error
    context.error("Error fetching palettes:", err)

    return {
      status: 500,
      jsonBody: {
        success: false,
        message: "Failed to fetch palettes",
        error: err.message
      }
    }
  }
}

// ============================================================================
// POST /api/palettes - create a new palette
// ============================================================================

interface CreatePaletteBody {
  name: string
  colors: Color[]
}

async function createPalette(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request for POST /api/palettes")

  try {
    // grab the body from the request
    const body = (await request.json()) as CreatePaletteBody
    const { name, colors } = body

    // basic validation - make sure they sent us what we need
    if (!name || !colors || !Array.isArray(colors)) {
      return {
        status: 400, 
        jsonBody: {
          success: false,
          message: "Invalid palette data"
        }
      }
    }

    const tableClient = await getTableClient()

    // generate a unique ID and timestamp
    const id = randomUUID()  // built into node, pretty handy :)
    const createdAt = new Date().toISOString()

    // build the entity in the format Azure Tables wants
    // partitionKey + rowKey = unique identifier for the row
    const entity: PaletteEntity = {
      partitionKey: "palettes",        // all palettes go in the same partition
      rowKey: id,                       // this becomes the palette ID
      name,
      colors: JSON.stringify(colors),   
      createdAt
    }

    // save it!
    await tableClient.createEntity(entity)

    // return the created palette (201)
    return {
      status: 201,
      jsonBody: {
        success: true,
        data: entityToPalette(entity)
      }
    }
  } catch (error: unknown) {
    const err = error as Error
    context.error("Error creating palette:", err)

    return {
      status: 500,  
      jsonBody: {
        success: false,
        message: "Failed to create palette",
        error: err.message
      }
    }
  }
}

// ============================================================================
// DELETE /api/palettes/{id} - delete a palette
// ============================================================================
async function deletePalette(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request for DELETE /api/palettes/{id}")

  try {
    // get the ID from the URL - 
    // the {id} in the route becomes request.params.id
    const id = request.params.id

    // make sure they gave us an ID
    if (!id) {
      return {
        status: 400,
        jsonBody: {
          success: false,
          message: "Palette ID is required"
        }
      }
    }

    const tableClient = await getTableClient()

    // delete needs both partitionKey and rowKey
    await tableClient.deleteEntity("palettes", id)

    return {
      status: 200,
      jsonBody: {
        success: true,
        message: `Palette ${id} deleted successfully`
      }
    }
  } catch (error: unknown) {
    const err = error as Error
    context.error("Error deleting palette:", err)

    return {
      status: 500,
      jsonBody: {
        success: false,
        message: "Failed to delete palette",
        error: err.message
      }
    }
  }
}

// ============================================================================
// Register all endpoints with Azure Functions
// ============================================================================
app.get("getPalettes", {
  authLevel: "anonymous",
  route: "palettes",
  handler: getPalettes
})

app.post("createPalette", {
  authLevel: "anonymous",
  route: "palettes",
  handler: createPalette
})

app.deleteRequest("deletePalette", {
  authLevel: "anonymous",
  route: "palettes/{id}",
  handler: deletePalette
})
