import sharp from 'sharp'

const W = 1200
const H = 630
const FONT = 'C:/Windows/Fonts/NotoSansJP-VF.ttf'

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Noto';
        src: url('file:///${FONT.replace(/\\/g, '/')}') format('truetype');
      }
      text { font-family: 'Noto', 'Meiryo', sans-serif; }
    </style>
  </defs>
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <circle cx="1100" cy="90" r="220" fill="#ffffff" opacity="0.04"/>
  <circle cx="60" cy="560" r="180" fill="#ffffff" opacity="0.05"/>
  <g transform="translate(80 80)">
    <rect width="120" height="120" rx="24" fill="#0a0a0a" stroke="#ffffff" stroke-width="3"/>
    <circle cx="60" cy="60" r="38" fill="#ffffff"/>
    <circle cx="60" cy="60" r="33" fill="none" stroke="#0a0a0a" stroke-width="5"/>
    <path d="M60 29V20" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round"/>
    <path d="M60 100V91" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round"/>
    <path d="M29 60H20" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 60H91" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round"/>
    <path d="M60 60V38" stroke="#0a0a0a" stroke-width="5" stroke-linecap="round"/>
    <path d="M60 60L76 70" stroke="#e01010" stroke-width="5" stroke-linecap="round"/>
  </g>
  <text x="240" y="150" font-size="58" font-weight="700" fill="#ffffff">秒速ツール</text>
  <text x="240" y="210" font-size="30" fill="#b3b3b3">面倒なことを、1秒で。</text>
  <text x="80" y="500" font-size="34" font-weight="600" fill="#ffffff">${esc('登録不要・完全無料。毎日のちょっとした困りごとを解決')}</text>
  <text x="80" y="548" font-size="26" fill="#8a8a8a">文字数カウント / 割引計算 / 年齢計算 / JSON整形 / ルーレット など</text>
</svg>
`

await sharp(Buffer.from(svg))
  .resize(W, H, { fit: 'fill' })
  .png({ compressionLevel: 9, palette: true })
  .toFile('public/ogp.png')

const meta = await sharp('public/ogp.png').metadata()
console.log(`ogp.png generated: ${meta.width}x${meta.height}`)
