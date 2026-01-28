// tableClient.ts - handles all the Azure Table Storage connection stuff

import { TableClient, TableServiceClient } from "@azure/data-tables"
import type { PaletteEntity, Palette } from "../types/palette.js"

// connection string - "UseDevelopmentStorage=true"
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "UseDevelopmentStorage=true"
const tableName = "palettes"

// we only want one client instance 
let tableClient: TableClient | null = null
let initialized = false

// gets or creates the table client
export async function getTableClient(): Promise<TableClient> {
  // only create the client once
  if (!tableClient) {
    tableClient = TableClient.fromConnectionString(connectionString, tableName)
  }

  // make sure the table exists
  if (!initialized) {
    await initializeTable()
    initialized = true
  }

  return tableClient
}

// creates the table if it doesn't exist yet
async function initializeTable(): Promise<void> {
  // need the service client to create tables
  // (TableClient is for data, TableServiceClient is for managing tables?)
  const serviceClient = TableServiceClient.fromConnectionString(connectionString)

  try {
    await serviceClient.createTable(tableName)
    console.log(`Table "${tableName}" created`)
  } catch (error: unknown) {
    const err = error as { statusCode?: number }
    // 409 = "already exists" 
    if (err.statusCode === 409) {
      console.log(`Table "${tableName}" already exists`)
    } else {
      // actual error
      throw error
    }
  }
}

// converts the  table format to Palette object
export function entityToPalette(entity: PaletteEntity): Palette {
  return {
    id: entity.rowKey,             
    name: entity.name,
    colors: JSON.parse(entity.colors),  
    createdAt: entity.createdAt
  }
}
