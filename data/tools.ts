export type ToolDefinition = {
  slug: string; name: string; description: string; categorySlug: string; icon: string; popular?: boolean; new?: boolean; implementation: string; steps: string[]; faqs: { q: string; a: string }[]
}
const common = (name: string, description: string, categorySlug: string, icon: string, implementation: string, popular = false, steps: string[] = [], faqs: { q: string; a: string }[] = [], isNew = false): ToolDefinition => ({ slug: implementation, name, description, categorySlug, icon, implementation, popular, steps: steps.length ? steps : ['入力欄に必要な情報を入力します', '結果を確認し、必要なら設定を調整します', 'コピーして好きな場所で使います'], faqs: faqs.length ? faqs : [{ q: '登録やインストールは必要ですか？', a: '必要ありません。ブラウザですぐに無料で利用できます。' }, { q: '入力したデータは保存されますか？', a: 'データはサーバーへ送信されず、このページ上でのみ処理されます。' }], ...(isNew ? { new: true } : {}) })
export const tools: ToolDefinition[] = [
 common('文字数カウント','文章の文字数や空白、改行をリアルタイムで確認','text','Type','char-count',true,['テキスト欄に文章を貼り付けるか入力します','文字数・空白を除いた文字数・行数がリアルタイムで表示されます','気になる場合はコピーしてそのまま使えます'],[{q:'空白や改行は文字数に含まれますか？',a:'全角空白・半角空白・改行を含めてカウントします。「空白除外」の数値は半角・全角の空白と改行を取り除いた文字数です。'},{q:'記号や数字も数えますか？',a:'はい。すべての文字を数えます。'}]),
 common('改行削除','文章から改行を取り除いて一行に整える','text','WrapText','remove-linebreaks',false,['テキスト欄に改行を含む文章を入力します','結果欄に改行が削除された一行の文章が表示されます','必要なら「コピー」でコピーできます'],[]),
 common('空白削除','半角・全角スペースをまとめて削除','text','Eraser','remove-spaces',false,['テキスト欄に文章を入力します','半角・全角の空白がすべて削除された文章が表示されます','コピーして使用します'],[]),
 common('全角・半角変換','英数字や記号の全角・半角を変換','text','ArrowLeftRight','width-converter',false,['変換したい方向（半角へ・全角へ）を選びます','テキスト欄に入力すると自動で変換されます','結果をコピーして使用します'],[]),
 common('テキスト比較','2つの文章の違いを見つける','text','GitCompare','text-compare',false,['文章1と文章2をそれぞれ入力します','2つの文章が一致するかどうかを判定します','結果を確認します'],[]),
 common('消費税計算','税抜き・税込み価格をすばやく計算','calculation','ReceiptText','tax',true,['税抜き価格を入力します','税率（標準10%、軽減8%など）を選択・入力します','税込価格と消費税額が表示されます'],[{q:'税率はどう選べばいいですか？',a:'飲食料品などは8%、その他は10%（2026年時点）です。必要に応じて数値を変更できます。'},{q:'小数点以下の扱いは？',a:'税込価格・消費税は四捨五入して整数（円）で表示します。'}]),
 common('割引計算','割引後の価格と割引額を計算','calculation','BadgePercent','discount',true,['元の価格を入力します','割引率（%）を入力します','割引後価格と割引額が表示されます'],[]),
 common('パーセント計算','割合、増減率、比率を計算','calculation','Percent','percent',false,['「現在の値」と「基準の値」を入力します','基準の値に対する現在の値の割合が%で表示されます','増減率もあわせて確認できます'],[]),
 common('割り勘計算','合計金額を人数で分ける','calculation','Users','split-bill',false,['合計金額と人数を入力します','1人あたりの金額（切り上げ）と端数が表示されます','コピーしてシェアできます'],[]),
 common('年齢計算','生年月日から現在の年齢を計算','date-time','Cake','age',true,['生年月日を選択します','今日時点での満年齢が表示されます','年齢計算に必要なのは生年月日だけです'],[{q:'「満年齢」とは？',a:'誕生日を迎えるたびに1歳ずつ増える年齢のことです。誕生日前日のまではひとつ前の年齢になります。'},{q:'誕生日は今日考慮されますか？',a:'はい。今日が誕生日の場合は年齢が加算されます。'}]),
 common('日数計算','2つの日付の間の日数を計算','date-time','CalendarRange','date-difference',false,['開始日と終了日を選択します','2つの日付の間の日数が表示されます','日付の前後はどちらでも構いません'],[]),
 common('カウントダウン','指定日までの残り日数を確認','date-time','Timer','countdown',false,['目標の日付を選択します','今日から目標日までの残り日数が表示されます','目標日が過ぎている場合は経過日数が表示されます'],[]),
 common('偏差値計算','点数、平均、標準偏差から偏差値を算出','student','ChartNoAxesColumnIncreasing','hensachi',false,['自分の点数・平均点・標準偏差を入力します','偏差値が計算されます','標準偏差がわからない場合は先生や資料で確認してください'],[]),
 common('勉強時間計算','開始・終了時間から勉強時間を計算','student','Clock3','study-time',false,['開始時刻と終了時刻を入力します','勉強した時間が時間と分で表示されます','日をまたぐ場合も自動で計算します'],[]),
 common('JSON整形','JSONの整形、圧縮、エラーチェック','development','Braces','json',true,['JSONをテキスト欄に入力します','整形されたJSONが表示されます','不正なJSONの場合はエラーの案内が表示されます'],[{q:'どういうときに使いますか？',a:'圧縮された長いJSONを読みやすく整形したり、コピーしたJSONが正しいかを確認したりするときに使います。'},{q:'JSONが正しくないとどうなりますか？',a:'「JSONを確認してください」と表示されます。括弧やカンマの不足がないか確認してください。'}]),
 common('UUID生成','使い捨て可能なUUIDを複数生成','development','Fingerprint','uuid',false,['生成したい個数（1〜100）を入力します','指定した数のUUIDが生成されます','コピーして使用します'],[],true),
 common('Base64変換','日本語にも対応したBase64エンコード・デコード','development','Binary','base64',false,['変換の向き（エンコード・デコード）を選びます','テキスト欄に入力します','変換結果が表示されます'],[],true),
 common('究極の決定ルーレット','迷ったときの答えを楽しく決める','fun','Dices','roulette',true,['選択肢を追加します（初期値もそのまま使えます）','「回す」を押すとランダムに1つ選ばれます','決めたい選択肢に置き換えて何度でも使えます'],[]),
]
export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug)
