import { describe, it, expect } from 'vitest'
import { generateRandomColor, isValidHex, generatePalette } from '../../utils/colorGenerator'

describe('Color Generator Utils', () => {
  it('should generate valid hex color', () => {
    const color = generateRandomColor()
    expect(isValidHex(color)).toBe(true)
  })

  it('should generate palette with 5 colors', () => {
    const palette = generatePalette()
    expect(palette).toHaveLength(5)
    expect(palette.every(c => isValidHex(c.hex))).toBe(true)
  })

  it('should validate hex colors correctly', () => {
    expect(isValidHex('#FF5733')).toBe(true)
    expect(isValidHex('#000000')).toBe(true) 
    expect(isValidHex('FF5733')).toBe(false)  // missing #
    expect(isValidHex('#FFF')).toBe(false)    // too short
    expect(isValidHex('#ZZZZZZ')).toBe(false)    // invalid characters
  })
})
