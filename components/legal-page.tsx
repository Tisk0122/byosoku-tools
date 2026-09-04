import Link from 'next/link'
import type { ReactNode } from 'react'
import { Footer, Header } from '@/components/site-shell'

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return <><Header/><main className="mx-auto max-w-3xl px-5 py-16 md:py-24"><div className="mb-10"><Link href="/" className="text-sm text-primary hover:underline">秒速ツール</Link><span className="mx-2 text-muted-foreground">/</span><span className="text-sm text-muted-foreground">{title}</span></div><article className="prose prose-slate max-w-none dark:prose-invert"><h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1><p className="text-sm text-muted-foreground">最終更新日：{updated}</p>{children}</article></main><Footer/></>
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-10"><h2 className="text-xl font-semibold">{title}</h2><div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">{children}</div></section>
}
