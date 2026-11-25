import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

const revision = createHash('sha256').update(readFileSync('public/icons.svg')).digest('hex').slice(0, 12)

export const iconSpriteUrl = `/icons.svg?v=${revision}`
