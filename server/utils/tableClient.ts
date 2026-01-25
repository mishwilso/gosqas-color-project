import { TableClient, TableServiceClient } from "@azure/data-tables";
import type { PaletteEntity, Palette } from "../../types/palette";

const connectionString = "UseDevelopmentStorage=true";
const tableName = "palettes"; 

// Save the table client , to resue it
let tableClient: TableClient | null = null;
let initialized = false;

// get the TableClient instance
export async function getTableClient() {
  if (!tableClient) {
    // grab the TableClient instance
    tableClient = TableClient.fromConnectionString(connectionString, tableName);
  }

  // ensure table is init
  if (!initialized) {
    await initializeTable();
    initialized = true;
  }

  return tableClient;
}

// init palette table
async function initializeTable() {

  if (process.env.VITEST) {
    console.log('Skipping table init in test environment');
    return;
  }
  
  // TableServiceClient is for managing tables themselves (create/delete tables)
  const serviceClient = TableServiceClient.fromConnectionString(connectionString);
  
  try {
    // try making the palettes table
    await serviceClient.createTable(tableName);
    console.log(`Table "${tableName}" created`);
  } catch (error: any) {
    // 409 = HTTP "Conflict" status
    // ust wanted to make sure it exists
    if (error.statusCode === 409) {
      console.log(`Table "${tableName}" already exists`);
    } else {
      throw error;
    }
  }
}

// convert entity from table to a palette
export function entityToPalette(entity: PaletteEntity): Palette {
  return {
    id: entity.rowKey,
    name: entity.name,
    colors: JSON.parse(entity.colors),
    createdAt: entity.createdAt,
  };
}