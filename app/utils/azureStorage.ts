import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";

// just gonna use default creds
const account = 'devstoreaccount1'
const accountKey = 'Eby8vdM52j1qpX12jWRXKdVbdgShKpzUVmq3w8RmvnzCIkJVtPjDSxOvSiJOvXVhqCp6Jkz0x5gVkL9ZqHnDLw=='
const tableName = 'palettes'

const credential = new AzureNamedKeyCredential(account, accountKey)
const tableClient = new TableClient(
  'http://127.0.0.1:10002/devstoreaccount1',
  tableName,
  credential
)

// Create table if it doesn't exist
export async function initializeTable() {
  try {
    await tableClient.createTable()
  } catch (error: any) {
    // Table might already exist, that's okay
    if (error.statusCode !== 409) {
      throw error
    }
  }
}

export { tableClient }
