import sharp from 'sharp'

const light = sharp('public/icon-light-32x32.png')
const dark = sharp('public/icon-dark-32x32.png')

const favicon32 = await light.clone().resize(32, 32).png().toBuffer()
const favicon16 = await light.clone().resize(16, 16).png().toBuffer()

await sharp(Buffer.concat([favicon16, favicon32])).toFile('public/favicon.ico')

await light.clone().resize(180, 180).png().toFile('public/apple-touch-icon.png')

console.log('favicon.ico + apple-touch-icon.png generated')
