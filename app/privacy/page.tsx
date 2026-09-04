import { LegalPage, LegalSection } from '@/components/legal-page'

export const metadata = {
  title: 'プライバシーポリシー',
  description: '秒速ツールのプライバシーポリシーです。',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return <LegalPage title="プライバシーポリシー" updated="2026年9月4日"><LegalSection title="1. 基本方針"><p>秒速ツール（以下「運営者」）は、利用者の個人情報を適切に取り扱います。本ポリシーは本サービスにおける情報の取得、利用、管理について定めます。</p></LegalSection><LegalSection title="2. 取得する情報"><p>お問い合わせ時に氏名、メールアドレス、問い合わせ内容を取得する場合があります。また、アクセス日時、IPアドレス、ブラウザ情報、閲覧ページなどの技術情報が自動的に記録される場合があります。</p></LegalSection><LegalSection title="3. 利用目的"><p>お問い合わせへの回答、サービスの提供・改善、不正利用の防止、障害対応、利用状況の分析および統計情報の作成に利用します。</p></LegalSection><LegalSection title="4. ツール入力データ"><p>各ツールの入力データは、原則としてブラウザ内で処理され、運営者のサーバーへ送信されません。ただし、ブラウザや通信環境の仕様上、入力内容の取り扱いを保証するものではないため、機密情報の入力は控えてください。</p></LegalSection><LegalSection title="5. Cookie・解析・広告"><p>本サービスでは、利便性向上やアクセス状況の把握のためCookie等を利用する場合があります。導入している解析・広告サービスがある場合は、それぞれの提供者のポリシーも適用されます。ブラウザ設定によりCookieを拒否できますが、一部機能が利用できなくなる場合があります。</p></LegalSection><LegalSection title="6. 第三者提供・委託"><p>法令に基づく場合を除き、本人の同意なく個人情報を第三者へ提供しません。サービス運営に必要な範囲で、業務委託先へ情報を委託する場合は、適切な安全管理を求めます。</p></LegalSection><LegalSection title="7. 安全管理・開示等"><p>取得した情報への不正アクセス、漏えい、滅失、毀損の防止に努めます。利用者は、法令に基づき、保有個人情報の開示、訂正、削除等を請求できます。請求は <a className="text-primary hover:underline" href="mailto:contact@example.com">contact@example.com</a> までご連絡ください。</p></LegalSection><LegalSection title="8. 改定"><p>本ポリシーは、法令やサービス内容の変更に応じて改定する場合があります。重要な変更は本ページでお知らせします。</p></LegalSection></LegalPage>
}
