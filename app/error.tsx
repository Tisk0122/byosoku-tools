'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RotateCcw, TriangleAlert } from 'lucide-react'
import { Footer, Header } from '@/components/site-shell'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center md:py-32">
        <span className="grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <TriangleAlert size={28} />
        </span>
        <p className="mt-6 text-sm font-medium text-destructive">エラー</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">問題が発生しました</h1>
        <p className="mt-4 text-muted-foreground">
          一時的な不具合が発生した可能性があります。もう一度お試しいただくか、ホームに戻ってください。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => reset()} className="primary">
            <RotateCcw size={16} />
            もう一度試す
          </button>
          <Link href="/" className="secondary">
            ホームへ戻る
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
