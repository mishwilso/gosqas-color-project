import { initializeTable } from '../../utils/azureStorage'
import { defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
  await initializeTable()
  return { success: true }
})