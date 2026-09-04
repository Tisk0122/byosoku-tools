'use client'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* ignored */
    }
  }
  return (
    <span className="inline-flex items-center gap-2">
      <a className="font-medium text-primary hover:underline" href={`mailto:${email}`}>
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        aria-label="メールアドレスをコピー"
      >
        {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
        {copied ? 'コピーしました' : 'コピー'}
      </button>
    </span>
  )
}
