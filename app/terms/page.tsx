import CopyEmail from '@/components/copy-email'
import { LegalPage, LegalSection } from '@/components/legal-page'

export const metadata = {
  title: '利用規約',
  description: '秒速ツールの利用規約です。',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return <LegalPage title="利用規約" updated="2026年9月4日"><LegalSection title="第1条（適用）"><p>本規約は、秒速ツール（以下「本サービス」）の利用条件を定めるものです。利用者は本規約に同意のうえ、本サービスを利用するものとします。</p></LegalSection><LegalSection title="第2条（サービス内容）"><p>本サービスは、文字列処理、計算、変換その他の便利なツールを無料・登録不要で提供します。機能や内容は予告なく変更、停止または終了する場合があります。</p></LegalSection><LegalSection title="第3条（禁止事項）"><p>法令または公序良俗に反する行為、サービス運営を妨害する行為、不正アクセス、過度な負荷を与える行為、第三者の権利を侵害する行為を禁止します。</p></LegalSection><LegalSection title="第4条（知的財産権）"><p>本サービスのデザイン、プログラム、文章その他のコンテンツに関する権利は、運営者または正当な権利者に帰属します。</p></LegalSection><LegalSection title="第5条（免責事項）"><p>本サービスの計算結果や変換結果の正確性、完全性、有用性を保証するものではありません。重要な判断には必ず利用者自身で確認してください。利用により生じた損害について、運営者は法令上許される範囲で責任を負いません。</p></LegalSection><LegalSection title="第6条（規約変更・準拠法）"><p>運営者は必要に応じて本規約を変更できます。変更後の規約は本ページに掲載した時点から効力を生じます。本規約は日本法に準拠し、紛争は運営者所在地を管轄する裁判所を第一審の専属的合意管轄とします。</p></LegalSection><LegalSection title="第7条（お問い合わせ）"><p>本規約に関するお問い合わせは <CopyEmail email="Tisk.address@gmail.com"/> までご連絡ください。</p></LegalSection></LegalPage>
}
