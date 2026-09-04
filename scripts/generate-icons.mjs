import sharp from 'sharp'

// ベクターのicon.svgから高品質に各サイズをレンダリング
const ICON_SRC = 'public/icon.svg'

// SVGを高解像度でレンダリング（density 上げてからリサイズ→シャープにもう少し余裕）
const svgBuffer = await sharp(ICON_SRC, { density: 384 }).png().toBuffer()
const source = sharp(svgBuffer)

const sizes = [16, 32, 192, 512]

for (const size of sizes) {
  await source.clone().resize(size, size).png().toFile(`public/icon-${size}x${size}.png`)
}

// iOS用（角丸は元SVGのrxを維持）
await source.clone().resize(180, 180).png().toFile('public/apple-icon.png')
await source.clone().resize(180, 180).png().toFile('public/apple-touch-icon.png')

// favicon.ico（16 + 32 を連結）
const ico16 = await source.clone().resize(16, 16).png().toBuffer()
const ico32 = await source.clone().resize(32, 32).png().toBuffer()
await sharp(Buffer.concat([ico16, ico32])).toFile('public/favicon.ico')

console.log('icons + favicon generated')
