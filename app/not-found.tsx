import Link from 'next/link'
import { Search } from 'lucide-react'
import { Footer, Header } from '@/components/site-shell'

export const metadata = {
  title: 'ページが見つかりません',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center md:py-32">
        <span className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Search size={28} />
        </span>
        <p className="mt-6 text-sm font-medium text-primary">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">ページが見つかりませんでした</h1>
        <p className="mt-4 text-muted-foreground">
          お探しのページは削除されたか、URLが間違っている可能性があります。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="primary">
            ホームへ戻る
          </Link>
          <Link href="/#categories" className="secondary">
            ツール一覧を見る
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
