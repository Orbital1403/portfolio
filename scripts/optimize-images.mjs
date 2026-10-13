// Prepare hobby photographs for the web: at most 1600 px for the gallery and an
// 800 px "-800" copy for cards and photo grids. Run after adding new photographs:
//   node scripts/optimize-images.mjs
// Camera metadata (including GPS location) is always removed. Photographs without
// metadata are only re-encoded when that saves at least 15 %, so repeated runs
// do not keep recompressing the same photograph.
import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const jpegFile = /\.jpe?g$/i
const thumbnailFile = /-800\.jpe?g$/i
const jpegExtension = /(\.jpe?g)$/i

const root = 'public/images/hobbies'
const FULL = 1600
const THUMB = 800
const jpeg = { quality: 80, mozjpeg: true, progressive: true }

function* photos(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory())
      yield* photos(path)
    else if (jpegFile.test(name) && !thumbnailFile.test(name))
      yield path
  }
}

let before = 0
let after = 0
for (const path of photos(root)) {
  const original = statSync(path).size
  const { exif, xmp, iptc } = await sharp(path).metadata()
  const full = await sharp(path).rotate().resize(FULL, FULL, { fit: 'inside', withoutEnlargement: true }).jpeg(jpeg).toBuffer()
  if (exif || xmp || iptc || full.length < original * 0.85)
    writeFileSync(path, full)
  const thumbPath = path.replace(jpegExtension, '-800$1')
  const thumb = await sharp(path).rotate().resize(THUMB, THUMB, { fit: 'inside', withoutEnlargement: true }).jpeg(jpeg).toBuffer()
  writeFileSync(thumbPath, thumb)
  before += original
  after += statSync(path).size
  console.log(`${path}: ${Math.round(original / 1024)} KB -> ${Math.round(statSync(path).size / 1024)} KB, thumbnail ${Math.round(thumb.length / 1024)} KB`)
}
console.log(`Full-size photographs: ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB`)
