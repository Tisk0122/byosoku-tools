# 秒速ツール

登録不要・完全無料。毎日のちょっとした困りごとをすぐに解決する便利ツール集です。

面倒なことを、1秒で。

## 特徴

- **登録不要・完全無料** — すぐに使えます
- **データはどこにも送信されない** — 入力内容はブラウザ内で処理されます
- **レスポンシブ対応** — スマホ・タブレット・PC すべてで快適に動作

## 利用できるツール

- 文章・テキスト：文字数カウント、改行削除、空白削除、全角半角変換、テキスト比較
- 計算：消費税計算、割引計算、パーセント計算、割り勘計算
- 日付・時間：年齢計算、日数計算、カウントダウン
- 学生：偏差値計算、勉強時間計算
- 開発：JSON整形、UUID生成、Base64変換
- 遊び・SNS：究極の決定ルーレット

## 技術スタック

- [Next.js 16](https://nextjs.org/) (App Router / Turbopack)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [lucide-react](https://lucide.dev/)

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番起動
npm run start

# OGP画像・アイコンを再生成
npm run generate:assets
```

## デプロイ

本番 URL 環境変数にサイトのドメインを設定してください（sitemap・canonical・OGP に反映されます）。

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
```

## ライセンス

プライベートプロジェクトです。
