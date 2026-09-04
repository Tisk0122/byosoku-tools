export type ToolDefinition = {
  slug: string; name: string; description: string; categorySlug: string; icon: string; popular?: boolean; implementation: string; steps: string[]; faqs: { q: string; a: string }[]
}
const common = (name: string, description: string, categorySlug: string, icon: string, implementation: string, popular = false): ToolDefinition => ({ slug: implementation, name, description, categorySlug, icon, implementation, popular, steps: ['入力欄に必要な情報を入力します', '結果を確認し、必要なら設定を調整します', 'コピーして好きな場所で使います'], faqs: [{ q: '登録やインストールは必要ですか？', a: '必要ありません。ブラウザですぐに無料で利用できます。' }, { q: '入力したデータは保存されますか？', a: 'データはサーバーへ送信されず、このページ上でのみ処理されます。' }] })
export const tools: ToolDefinition[] = [
 common('文字数カウント','文章の文字数や空白、改行をリアルタイムで確認','text','Type','char-count',true),
 common('改行削除','文章から改行を取り除いて一行に整える','text','WrapText','remove-linebreaks'),
 common('空白削除','半角・全角スペースをまとめて削除','text','Eraser','remove-spaces'),
 common('全角・半角変換','英数字や記号の全角・半角を変換','text','ArrowLeftRight','width-converter'),
 common('テキスト比較','2つの文章の違いを見つける','text','GitCompare','text-compare'),
 common('消費税計算','税抜き・税込み価格をすばやく計算','calculation','ReceiptText','tax',true),
 common('割引計算','割引後の価格と割引額を計算','calculation','BadgePercent','discount',true),
 common('パーセント計算','割合、増減率、比率を計算','calculation','Percent','percent'),
 common('割り勘計算','合計金額を人数で分ける','calculation','Users','split-bill'),
 common('年齢計算','生年月日から現在の年齢を計算','date-time','Cake','age',true),
 common('日数計算','2つの日付の間の日数を計算','date-time','CalendarRange','date-difference'),
 common('カウントダウン','指定日までの残り日数を確認','date-time','Timer','countdown'),
 common('偏差値計算','点数、平均、標準偏差から偏差値を算出','student','ChartNoAxesColumnIncreasing','hensachi'),
 common('勉強時間計算','開始・終了時間から勉強時間を計算','student','Clock3','study-time'),
 common('JSON整形','JSONの整形、圧縮、エラーチェック','development','Braces','json',true),
 common('UUID生成','使い捨て可能なUUIDを複数生成','development','Fingerprint','uuid'),
 common('Base64変換','日本語にも対応したBase64エンコード・デコード','development','Binary','base64'),
 common('究極の決定ルーレット','迷ったときの答えを楽しく決める','fun','Dices','roulette',true),
]
export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug)
