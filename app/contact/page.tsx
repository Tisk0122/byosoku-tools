import { LegalPage, LegalSection } from '@/components/legal-page'

export const metadata = {
  title: 'お問い合わせ',
  description: '秒速ツールへのお問い合わせ方法です。',
  alternates: { canonical: '/contact' },
}

export default function ContactPage() {
  return <LegalPage title="お問い合わせ" updated="2026年9月4日"><LegalSection title="お問い合わせ先"><p>サービスに関するご質問、不具合の報告、掲載内容に関するご連絡は、以下のメールアドレスまでお送りください。</p><p><a className="text-primary hover:underline" href="mailto:contact@example.com">contact@example.com</a></p></LegalSection><LegalSection title="ご連絡の際のお願い"><p>件名にお問い合わせの種類を記載し、発生したページ、操作内容、エラーメッセージなどを具体的にお知らせください。個人情報やパスワードなどの機密情報は送信しないでください。</p></LegalSection><LegalSection title="返信について"><p>内容を確認のうえ、必要に応じて返信します。すべてのお問い合わせに返信できない場合があります。</p></LegalSection></LegalPage>
}
