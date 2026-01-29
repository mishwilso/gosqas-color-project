// tableClient.ts
import { TableClient, TableServiceClient } from "@azure/data-tables"
import type { PaletteEntity, Palette } from "../types/palette.js"

const connectionString = "UseDevelopmentStorage=true"
const tableName = "palettes"

let tableClient: TableClient | null = null

export async function getTableClient(): Promise<TableClient> {
  if (!tableClient) {
    // make service client and make sure table exists
    const serviceClient = TableServiceClient.fromConnectionString(connectionString)
    
    try {
      await serviceClient.createTable(tableName)
    } catch (error: any) {
      // 409 is okay, means table exists already 
      if (error.statusCode !== 409) throw error
    }
    
    // make table client
    tableClient = TableClient.fromConnectionString(connectionString, tableName)
  }

  return tableClient
}

export function entityToPalette(entity: PaletteEntity): Palette {
  return {
    id: entity.rowKey,
    name: entity.name,
    colors: JSON.parse(entity.colors),
    createdAt: entity.createdAt
  }
}