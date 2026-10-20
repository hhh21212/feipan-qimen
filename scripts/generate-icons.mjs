import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const dir = 'public/icons'
const icon = readFileSync(`${dir}/icon.svg`)
const maskable = readFileSync(`${dir}/maskable.svg`)

async function run() {
  await sharp(icon).resize(192, 192).png().toFile(`${dir}/icon-192.png`)
  await sharp(icon).resize(512, 512).png().toFile(`${dir}/icon-512.png`)
  await sharp(icon).resize(180, 180).png().toFile(`${dir}/apple-touch-icon.png`)
  await sharp(maskable).resize(512, 512).png().toFile(`${dir}/maskable-512.png`)
  await sharp(icon).resize(32, 32).png().toFile(`${dir}/favicon-32.png`)
  console.log('icons generated')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
