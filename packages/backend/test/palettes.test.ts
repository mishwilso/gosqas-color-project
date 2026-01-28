import { describe, it, expect } from 'vitest'

// MUST HAVE THIS DO NOT WORK WITHOUT
const BASE_URL = 'http://localhost:3000'

describe('Palette API', () => {
  it('should create and retrieve palette', async () => {
    const postRes = await fetch(`${BASE_URL}/api/palettes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Palette',
        colors: [
          { hex: '#FF5733', locked: false },
          { hex: '#33FF57', locked: false },
        ]
      })
    })
    const postData = await postRes.json()

    expect(postData.success).toBe(true)
    expect(postData.data.name).toBe('Test Palette')

    await fetch(`${BASE_URL}/api/palettes/${postData.data.id}`, {
      method: 'DELETE'
    })
  })
})
