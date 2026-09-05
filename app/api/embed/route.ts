import { NextRequest, NextResponse } from 'next/server'

// Maps an opaque unit key to the actual admax (shinobi) creative id.
// Keeping the real id server-side (not in a URL the browser requests directly)
// avoids the request being matched by hostname-based ad-blocker filter lists.
const UNITS: Record<string, string> = {
  a: '85aa2dd7605fda52b119a8b9f691cb40', // SP 320x50
  b: '35c6779d0fa252f5a810f17a43736fed', // PC 728x90
}

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('u')
  const id = key ? UNITS[key] : null
  if (!id) {
    return new NextResponse('', { status: 404 })
  }
  try {
    const upstream = await fetch(`https://adm.shinobi.jp/s/${id}`, {
      headers: {
        'user-agent': req.headers.get('user-agent') ?? '',
        referer: req.nextUrl.origin,
      },
      cache: 'no-store',
    })
    const body = await upstream.arrayBuffer()
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/javascript; charset=utf-8',
        'cache-control': 'no-store',
      },
    })
  } catch {
    return new NextResponse('', { status: 502 })
  }
}
