import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { getTool, tools } from '@/data/tools'

export const alt = '秒速ツール'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getTool(slug)
  const title = tool?.name ?? '秒速ツール'
  const description = tool?.description ?? '面倒なことを、1秒で。'

  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), 'app/fonts/NotoSansJP-Regular.woff')),
    readFile(join(process.cwd(), 'app/fonts/NotoSansJP-Bold.woff')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg, #0b1220 0%, #14213d 55%, #1d3a8a 100%)',
          fontFamily: '"Noto Sans JP"',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              width: 60,
              height: 60,
              borderRadius: 18,
              background: '#3b82f6',
              color: '#fff',
              fontSize: 30,
              fontWeight: 700,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            秒
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#e2e8f0' }}>秒速ツール</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, color: '#ffffff', lineHeight: 1.25 }}>{title}</div>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 400, color: '#94a3b8', maxWidth: 980 }}>{description}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Noto Sans JP', data: regular, weight: 400, style: 'normal' },
        { name: 'Noto Sans JP', data: bold, weight: 700, style: 'normal' },
      ],
    },
  )
}
