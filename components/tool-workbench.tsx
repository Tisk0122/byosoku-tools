'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Check, Copy, Download, RotateCcw, WandSparkles } from 'lucide-react'
import QRCode from 'qrcode'

type Props = { kind: string }

const toDate = (value: string) => {
  const [y, m, d] = value.split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : null
}
const fmt = (n: number) => Number.isFinite(n) ? n.toLocaleString('ja-JP', { maximumFractionDigits: 2 }) : ''

const storeKey = (kind: string) => `byousoku.workbench.${kind}`
type Snapshot = { text: string; text2: string; num: string; num2: string; num3: string; rate: string; date: string; date2: string; mode: 'encode' | 'decode'; widthMode: 'half' | 'full'; items: string[]; category: string; unitFrom: string; unitTo: string }
const UNIT_GROUPS: Record<string, { label: string; units: Record<string, { label: string; factor?: number }> }> = {
  length: { label: '長さ', units: { mm: { label: 'mm（ミリメートル）', factor: 0.001 }, cm: { label: 'cm（センチメートル）', factor: 0.01 }, m: { label: 'm（メートル）', factor: 1 }, km: { label: 'km（キロメートル）', factor: 1000 }, inch: { label: 'inch（インチ）', factor: 0.0254 }, feet: { label: 'feet（フィート）', factor: 0.3048 }, mile: { label: 'mile（マイル）', factor: 1609.344 } } },
  weight: { label: '重さ', units: { mg: { label: 'mg（ミリグラム）', factor: 0.001 }, g: { label: 'g（グラム）', factor: 1 }, kg: { label: 'kg（キログラム）', factor: 1000 }, t: { label: 't（トン）', factor: 1000000 }, lb: { label: 'lb（ポンド）', factor: 453.592 }, oz: { label: 'oz（オンス）', factor: 28.3495 } } },
  temperature: { label: '温度', units: { c: { label: '℃（摂氏）' }, f: { label: '℉（華氏）' }, k: { label: 'K（ケルビン）' } } },
}
function convertUnit(category: string, from: string, to: string, value: number): number | null {
  if (!Number.isFinite(value)) return null
  if (category === 'temperature') {
    let c: number
    if (from === 'c') c = value
    else if (from === 'f') c = (value - 32) * 5 / 9
    else if (from === 'k') c = value - 273.15
    else return null
    if (to === 'c') return c
    if (to === 'f') return c * 9 / 5 + 32
    if (to === 'k') return c + 273.15
    return null
  }
  const group = UNIT_GROUPS[category]
  const fu = group?.units[from]?.factor
  const tu = group?.units[to]?.factor
  if (fu === undefined || tu === undefined) return null
  return value * fu / tu
}
function escapeHtml(s: string) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }
function mdInline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}
function markdownToHtml(md: string): string {
  const lines = escapeHtml(md).split('\n')
  const html: string[] = []
  let inList = false
  let inCode = false
  let codeBuffer: string[] = []
  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (!inCode) { inCode = true; codeBuffer = [] } else { inCode = false; html.push(`<pre><code>${codeBuffer.join('\n')}</code></pre>`) }
      continue
    }
    if (inCode) { codeBuffer.push(line); continue }
    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) { if (inList) { html.push('</ul>'); inList = false } html.push(`<h${h[1].length}>${mdInline(h[2])}</h${h[1].length}>`); continue }
    const li = line.match(/^[-*]\s+(.*)$/)
    if (li) { if (!inList) { html.push('<ul>'); inList = true } html.push(`<li>${mdInline(li[1])}</li>`); continue }
    if (inList) { html.push('</ul>'); inList = false }
    if (line.trim() === '') continue
    html.push(`<p>${mdInline(line)}</p>`)
  }
  if (inList) html.push('</ul>')
  if (inCode) html.push(`<pre><code>${codeBuffer.join('\n')}</code></pre>`)
  return html.join('\n')
}
const emptySnapshot = (kind: string): Snapshot => ({ text: '', text2: '', num: '', num2: '', num3: '', rate: '10', date: '', date2: '', mode: 'encode', widthMode: 'half', items: kind === 'average' ? ['80', '65', '90'] : kind === 'password-gen' ? ['大文字', '小文字', '数字'] : ['今日のご飯', '映画を見る', '散歩する', '読書する'], category: 'length', unitFrom: 'cm', unitTo: 'inch' })

function generatePassword(length: number, sets: string[]) {
  const groups: Record<string, string> = { '大文字': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '小文字': 'abcdefghijklmnopqrstuvwxyz', '数字': '0123456789', '記号': '!@#$%^&*()_-+=?' }
  const chosen = sets.length ? sets : ['小文字', '数字']
  const pool = chosen.map(s => groups[s] || '').join('')
  if (!pool) return ''
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, x => pool[x % pool.length]).join('')
}

function load(kind: string): Snapshot {
  if (typeof window === 'undefined') return emptySnapshot(kind)
  try {
    const raw = window.localStorage.getItem(storeKey(kind))
    if (!raw) return emptySnapshot(kind)
    const parsed = { ...emptySnapshot(kind), ...(JSON.parse(raw) as Partial<Snapshot>) }
    return parsed
  } catch {
    return emptySnapshot(kind)
  }
}

export function ToolWorkbench({ kind }: Props) {
  const [snap, setSnap] = useState<Snapshot>(() => load(kind))
  const { text, text2, num, num2, num3, rate, date, date2, mode, widthMode, items, category, unitFrom, unitTo } = snap
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyErr, setCopyErr] = useState(false)

  const update = (patch: Partial<Snapshot>) => setSnap((s) => ({ ...s, ...patch }))

  useEffect(() => {
    try { window.localStorage.setItem(storeKey(kind), JSON.stringify(snap)) } catch { /* ignore */ }
  }, [snap, kind])

  const output = useMemo(() => {
    const a = Number(num), b = Number(num2), c = Number(num3)
    if (kind === 'char-count') return `文字数：${text.length}\n空白除外：${text.replace(/\s/g, '').length}\n行数：${text ? text.split(/\r?\n/).length : 0}`
    if (kind === 'remove-linebreaks') return text.replace(/[\r\n]+/g, '')
    if (kind === 'remove-spaces') return text.replace(/[\s　]+/g, '')
    if (kind === 'width-converter') return widthMode === 'half' ? text.replace(/[！-～]/g, x => String.fromCharCode(x.charCodeAt(0) - 0xfee0)).replace(/　/g, ' ') : text.replace(/[!-~]/g, x => String.fromCharCode(x.charCodeAt(0) + 0xfee0)).replace(/ /g, '　')
    if (kind === 'text-compare') return text === '' && text2 === '' ? '' : text === text2 ? '2つの文章は一致しています' : '2つの文章は異なります'
    if (kind === 'tax') return Number.isFinite(a) && num !== '' && rate !== '' && Number.isFinite(Number(rate)) ? `税込価格：${fmt(Math.round(a * (1 + Number(rate) / 100)))}円\n消費税：${fmt(Math.round(a * Number(rate) / 100))}円` : ''
    if (kind === 'discount') return Number.isFinite(a) && Number.isFinite(b) && num !== '' && num2 !== '' ? `割引後価格：${fmt(Math.round(a * (1 - b / 100)))}円\n割引額：${fmt(Math.round(a * b / 100))}円` : ''
    if (kind === 'percent') return Number.isFinite(a) && Number.isFinite(b) && num !== '' && num2 !== '' && b !== 0 ? `${fmt(a / b * 100)}%\n増減率：${fmt((a - b) / b * 100)}%` : ''
    if (kind === 'split-bill') { if (!(a > 0 && b > 0)) return ''; const per = Math.ceil(a / b); const change = per * b - a; return `1人あたり：${fmt(per)}円\n${change > 0 ? `おつり：${fmt(change)}円` : '端数なし（きっちり割り切れます）'}` }
    if (kind === 'age') { const birth = toDate(date); if (!birth) return ''; const now = new Date(); if (birth.getTime() > now.getTime()) return '生年月日が未来の日付になっています'; let age = now.getFullYear() - birth.getFullYear(); if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--; return `満年齢：${Math.max(0, age)}歳` }
    if (kind === 'date-difference') { const x = toDate(date), y = toDate(date2); return x && y ? `日数差：${Math.abs(Math.round((y.getTime() - x.getTime()) / 86400000))}日` : '' }
    if (kind === 'countdown') { const x = toDate(date); if (!x) return ''; const days = Math.ceil((x.getTime() - new Date(new Date().setHours(0,0,0,0)).getTime()) / 86400000); return days >= 0 ? `あと${days}日` : `${Math.abs(days)}日前に終了` }
    if (kind === 'hensachi') return Number.isFinite(a) && Number.isFinite(b) && c > 0 && num !== '' && num2 !== '' && num3 !== '' ? `偏差値：${fmt(50 + (a - b) / c * 10)}` : ''
    if (kind === 'study-time') { const x = date.split(':').map(Number), y = date2.split(':').map(Number); if (x.length !== 2 || y.length !== 2 || x.some(Number.isNaN) || y.some(Number.isNaN)) return ''; let mins = y[0]*60+y[1]-(x[0]*60+x[1]); if (mins < 0) mins += 1440; return `勉強時間：${Math.floor(mins/60)}時間${mins%60}分` }
    if (kind === 'json') { try { const parsed = JSON.parse(text); return JSON.stringify(parsed, null, 2) } catch { return text ? 'JSONを確認してください\n（括弧やカンマの不足、余分なカンマがないか確認してください）' : '' } }
    if (kind === 'base64') { try { return mode === 'encode' ? btoa(unescape(encodeURIComponent(text))) : decodeURIComponent(escape(atob(text))) } catch { return text ? 'Base64を確認してください' : '' } }
    if (kind === 'reverse-text') return Array.from(text).reverse().join('')
    if (kind === 'dedupe-lines') { if (!text) return ''; return Array.from(new Set(text.split(/\r?\n/))).join('\n') }
    if (kind === 'sort-lines') { if (!text) return ''; const lines = text.split(/\r?\n/); return [...lines].sort((x, y) => mode === 'encode' ? x.localeCompare(y, 'ja') : y.localeCompare(x, 'ja')).join('\n') }
    if (kind === 'kana-convert') return mode === 'encode' ? text.replace(/[\u3041-\u3096]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60)) : text.replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60))
    if (kind === 'bmi') { if (!(a > 0 && b > 0)) return ''; const h = a / 100; const bmi = b / (h * h); const label = bmi < 18.5 ? '低体重（やせ型）' : bmi < 25 ? '普通体重' : bmi < 30 ? '肥満（1度）' : bmi < 35 ? '肥満（2度）' : bmi < 40 ? '肥満（3度）' : '肥満（4度）'; return `BMI：${fmt(bmi)}\n判定：${label}\n標準体重の目安：${fmt(22 * h * h)}kg` }
    if (kind === 'average') { const nums = items.map(Number).filter(n => Number.isFinite(n)); if (!nums.length) return ''; const sum = nums.reduce((s, n) => s + n, 0); return `件数：${nums.length}件\n合計：${fmt(sum)}\n平均：${fmt(sum / nums.length)}\n最高点：${fmt(Math.max(...nums))}\n最低点：${fmt(Math.min(...nums))}` }
    if (kind === 'weekday') { const d = toDate(date); if (!d) return ''; const days = ['日', '月', '火', '水', '木', '金', '土']; return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日は${days[d.getDay()]}曜日です` }
    if (kind === 'date-add') { const d = toDate(date); if (!d || num === '' || !Number.isFinite(a)) return ''; const days = ['日', '月', '火', '水', '木', '金', '土']; const result = new Date(d); result.setDate(result.getDate() + (mode === 'encode' ? Math.round(a) : -Math.round(a))); return `${result.getFullYear()}年${result.getMonth() + 1}月${result.getDate()}日（${days[result.getDay()]}）` }
    if (kind === 'base-convert') { if (num === '' || !Number.isFinite(a) || a < 0) return ''; const n = Math.floor(a); return `2進数：${n.toString(2)}\n8進数：${n.toString(8)}\n16進数：${n.toString(16).toUpperCase()}` }
    if (kind === 'color-convert') { const hex = text.trim().replace(/^#/, ''); if (!hex) return ''; if (!/^[0-9a-fA-F]{6}$/.test(hex)) return 'HEXカラーコードを確認してください（例：#3B82F6）'; const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), bl = parseInt(hex.slice(4, 6), 16); return `HEX：#${hex.toUpperCase()}\nRGB：rgb(${r}, ${g}, ${bl})` }
    if (kind === 'url-encode') { try { return mode === 'encode' ? encodeURIComponent(text) : text ? decodeURIComponent(text) : '' } catch { return text ? 'URLの形式を確認してください' : '' } }
    if (kind === 'unit-convert') { if (num === '' || !Number.isFinite(a)) return ''; const converted = convertUnit(category, unitFrom, unitTo, a); if (converted === null) return ''; const fromLabel = UNIT_GROUPS[category]?.units[unitFrom]?.label || unitFrom; const toLabel = UNIT_GROUPS[category]?.units[unitTo]?.label || unitTo; return `${fmt(a)} ${fromLabel}\n＝\n${fmt(converted)} ${toLabel}` }
    if (kind === 'timestamp-convert') {
      if (mode === 'encode') { if (num === '' || !Number.isFinite(a)) return ''; const d = new Date(a * 1000); if (isNaN(d.getTime())) return ''; return `日本時間：${d.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}\nUTC：${d.toUTCString()}` }
      if (!date) return ''; const d = new Date(date); if (isNaN(d.getTime())) return ''; return `Unixタイムスタンプ（秒）：${Math.floor(d.getTime() / 1000)}\nミリ秒：${d.getTime()}`
    }
    return result
  }, [kind, text, text2, num, num2, num3, rate, date, date2, mode, widthMode, items, category, unitFrom, unitTo, result])

  const copy = async () => { if (!output) return; setCopyErr(false); try { await navigator.clipboard.writeText(output); setCopied(true); window.setTimeout(() => setCopied(false), 1200) } catch { setCopyErr(true); window.setTimeout(() => setCopyErr(false), 2000) } }
  const clear = () => { setSnap(emptySnapshot(kind)); setResult('') }
  const field = (label: string, value: string, set: (v: string) => void, type = 'number', extra: Record<string, string | number> = {}) => <label className="grid gap-2 text-sm font-medium">{label}<input aria-label={label} type={type} value={value} onChange={e => set(e.target.value)} className="input" {...extra} /></label>
  const basic = ['char-count','remove-linebreaks','remove-spaces','width-converter','json','base64','reverse-text','dedupe-lines','sort-lines','kana-convert','url-encode'].includes(kind)
  if (kind === 'qr-code') {
    return <Panel title="QRコードを作成">
      <label className="grid gap-2 text-sm font-medium">QRコードにする内容（URL・テキストなど）<textarea aria-label="QRコードにする内容" value={text} onChange={e => update({ text: e.target.value })} className="input min-h-24 resize-y" placeholder="https://example.com" /></label>
      <QrCodeCanvas value={text} />
    </Panel>
  }
  if (kind === 'markdown-preview') {
    return <Panel title="Markdownプレビュー">
      <label className="grid gap-2 text-sm font-medium">Markdownを入力<textarea aria-label="Markdownを入力" value={text} onChange={e => update({ text: e.target.value })} className="input min-h-56 resize-y font-mono text-sm" placeholder={'# 見出し\n\n**太字** や *斜体* も使えます\n\n- リスト項目'} /></label>
      <div className="mt-2">
        <p className="text-sm font-medium">プレビュー</p>
        <div className="prose prose-sm mt-2 max-w-none rounded-xl border border-border bg-card p-5 dark:prose-invert" dangerouslySetInnerHTML={{ __html: text ? markdownToHtml(text) : '<p>ここにプレビューが表示されます</p>' }} />
      </div>
    </Panel>
  }
  return <Panel title="入力して結果を確認">
    {basic && <label className="grid gap-2 text-sm font-medium">テキスト<textarea aria-label="テキスト" value={text} onChange={e => update({ text: e.target.value })} className="input min-h-40 resize-y" placeholder="ここに入力してください" /></label>}
    {kind === 'text-compare' && <div className="grid gap-4 md:grid-cols-2">{field('文章1', text, v => update({ text: v }), 'text')}{field('文章2', text2, v => update({ text2: v }), 'text')}</div>}
    {kind === 'tax' && <div className="grid gap-4 md:grid-cols-2">{field('税抜価格（円）', num, v => update({ num: v }), 'number', { min: 0 })}{field('税率（%）', rate, v => update({ rate: v }), 'number', { min: 0, step: '0.1' })}</div>}
    {kind === 'discount' && <div className="grid gap-4 md:grid-cols-2">{field('元の価格（円）', num, v => update({ num: v }), 'number', { min: 0 })}{field('割引率（%）', num2, v => update({ num2: v }), 'number', { min: 0, max: 100 })}</div>}
    {kind === 'percent' && <div className="grid gap-4 md:grid-cols-2">{field('現在の値', num, v => update({ num: v }))}{field('基準の値', num2, v => update({ num2: v }))}</div>}
    {kind === 'split-bill' && <div className="grid gap-4 md:grid-cols-2">{field('合計金額（円）', num, v => update({ num: v }), 'number', { min: 0 })}{field('人数', num2, v => update({ num2: v }), 'number', { min: 1, step: '1' })}</div>}
    {kind === 'age' && field('生年月日', date, v => update({ date: v }), 'date')}
    {['date-difference','countdown'].includes(kind) && <div className="grid gap-4 md:grid-cols-2">{field(kind === 'countdown' ? '目標日' : '開始日', date, v => update({ date: v }), 'date')}{kind === 'date-difference' && field('終了日', date2, v => update({ date2: v }), 'date')}</div>}
    {kind === 'hensachi' && <div className="grid gap-4 md:grid-cols-3">{field('自分の点数', num, v => update({ num: v }))}{field('平均点', num2, v => update({ num2: v }))}{field('標準偏差', num3, v => update({ num3: v }), 'number', { min: 0.01, step: '0.01' })}</div>}
    {kind === 'study-time' && <div className="grid gap-4 md:grid-cols-2">{field('開始時刻', date, v => update({ date: v }), 'time')}{field('終了時刻', date2, v => update({ date2: v }), 'time')}</div>}
    {kind === 'width-converter' && <div className="mt-5 flex gap-2"><button type="button" className={widthMode === 'half' ? 'primary' : 'secondary'} onClick={() => update({ widthMode: 'half' })}>半角へ</button><button type="button" className={widthMode === 'full' ? 'primary' : 'secondary'} onClick={() => update({ widthMode: 'full' })}>全角へ</button></div>}
    {kind === 'base64' && <div className="mt-5 flex gap-2"><button type="button" className={mode === 'encode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'encode' })}>エンコード</button><button type="button" className={mode === 'decode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'decode' })}>デコード</button></div>}
    {kind === 'url-encode' && <div className="mt-5 flex gap-2"><button type="button" className={mode === 'encode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'encode' })}>エンコード</button><button type="button" className={mode === 'decode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'decode' })}>デコード</button></div>}
    {kind === 'unit-convert' && <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">{Object.entries(UNIT_GROUPS).map(([key, g]) => <button key={key} type="button" className={category === key ? 'primary' : 'secondary'} onClick={() => { const units = Object.keys(g.units); update({ category: key, unitFrom: units[0], unitTo: units[1] }) }}>{g.label}</button>)}</div>
      <div className="grid gap-4 md:grid-cols-3">
        {field('数値', num, v => update({ num: v }))}
        <label className="grid gap-2 text-sm font-medium">変換前の単位<select aria-label="変換前の単位" value={unitFrom} onChange={e => update({ unitFrom: e.target.value })} className="input">{Object.entries(UNIT_GROUPS[category]?.units || {}).map(([k, u]) => <option key={k} value={k}>{u.label}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-medium">変換後の単位<select aria-label="変換後の単位" value={unitTo} onChange={e => update({ unitTo: e.target.value })} className="input">{Object.entries(UNIT_GROUPS[category]?.units || {}).map(([k, u]) => <option key={k} value={k}>{u.label}</option>)}</select></label>
      </div>
    </div>}
    {kind === 'timestamp-convert' && <div className="grid gap-4">
      <div className="flex flex-wrap gap-2"><button type="button" className={mode === 'encode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'encode' })}>タイムスタンプ→日時</button><button type="button" className={mode === 'decode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'decode' })}>日時→タイムスタンプ</button></div>
      {mode === 'encode' ? field('Unixタイムスタンプ（秒）', num, v => update({ num: v })) : field('日時', date, v => update({ date: v }), 'datetime-local')}
      <button type="button" className="secondary" onClick={() => update(mode === 'encode' ? { num: String(Math.floor(Date.now() / 1000)) } : { date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) })}>現在時刻を入力</button>
    </div>}
    {kind === 'sort-lines' && <div className="mt-5 flex gap-2"><button type="button" className={mode === 'encode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'encode' })}>昇順</button><button type="button" className={mode === 'decode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'decode' })}>降順</button></div>}
    {kind === 'kana-convert' && <div className="mt-5 flex flex-wrap gap-2"><button type="button" className={mode === 'encode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'encode' })}>ひらがな→カタカナ</button><button type="button" className={mode === 'decode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'decode' })}>カタカナ→ひらがな</button></div>}
    {kind === 'bmi' && <div className="grid gap-4 md:grid-cols-2">{field('身長（cm）', num, v => update({ num: v }), 'number', { min: 0, step: '0.1' })}{field('体重（kg）', num2, v => update({ num2: v }), 'number', { min: 0, step: '0.1' })}</div>}
    {kind === 'average' && <NumberListControls items={items} setItems={v => update({ items: v })} />}
    {kind === 'weekday' && field('日付', date, v => update({ date: v }), 'date')}
    {kind === 'date-add' && <div className="grid gap-4"><div className="grid gap-4 md:grid-cols-2">{field('基準日', date, v => update({ date: v }), 'date')}{field('日数', num, v => update({ num: v }), 'number', { min: 0, step: '1' })}</div><div className="flex gap-2"><button type="button" className={mode === 'encode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'encode' })}>足す</button><button type="button" className={mode === 'decode' ? 'primary' : 'secondary'} onClick={() => update({ mode: 'decode' })}>引く</button></div></div>}
    {kind === 'base-convert' && field('10進数の値', num, v => update({ num: v }), 'number', { min: 0, step: '1' })}
    {kind === 'color-convert' && <div className="grid gap-3">{field('HEXカラーコード', text, v => update({ text: v }), 'text', { placeholder: '#3B82F6' })}{/^[0-9a-fA-F]{6}$/.test(text.trim().replace(/^#/, '')) && <div className="h-16 w-16 rounded-xl border border-border" style={{ backgroundColor: '#' + text.trim().replace(/^#/, '') }} />}</div>}
    {kind === 'password-gen' && <div className="grid gap-4"><div className="grid gap-4 md:grid-cols-2">{field('文字数（8〜64）', num || '16', v => update({ num: v }), 'number', { min: 8, max: 64 })}</div><div className="flex flex-wrap gap-2">{['大文字','小文字','数字','記号'].map(label => { const active = items.includes(label); return <button key={label} type="button" className={active ? 'primary' : 'secondary'} onClick={() => update({ items: active ? items.filter(x => x !== label) : [...items, label] })}>{label}</button> })}</div><button type="button" className="primary" onClick={() => { const n = Math.min(64, Math.max(8, Number(num) || 16)); setResult(generatePassword(n, items)) }}>生成する</button></div>}
    {kind === 'coin-flip' && <button type="button" className="primary" onClick={() => setResult(Math.random() < 0.5 ? '表' : '裏')}>コインを投げる</button>}
    {kind === 'dice-roll' && <div className="grid gap-4">{field('サイコロの数（1〜5）', num || '1', v => update({ num: v }), 'number', { min: 1, max: 5 })}<button type="button" className="primary" onClick={() => { const n = Math.min(5, Math.max(1, Number(num) || 1)); const rolls = Array.from({ length: n }, () => Math.floor(Math.random() * 6) + 1); setResult(`${rolls.join(' , ')}${n > 1 ? `\n合計：${rolls.reduce((s, x) => s + x, 0)}` : ''}`) }}>振る</button></div>}
    {kind === 'uuid' && <div className="grid gap-2">{field('生成個数（1〜100）', num || '1', setNumLocal, 'number', { min: 1, max: 100 })}<button type="button" className="primary" onClick={() => { const n = Math.min(100, Math.max(1, Number(num) || 1)); setResult(Array.from({length:n}, () => crypto.randomUUID()).join('\n')) }}>生成する</button></div>}
    {kind === 'roulette' && <RouletteControls items={items} setItems={(v) => update({ items: v })} />}
    {!['uuid','roulette','password-gen'].includes(kind) && <div className="mt-5 flex gap-2"><button type="button" className="secondary" onClick={clear}><RotateCcw size={16}/>クリア</button></div>}
    <Output value={output} copy={copy} copied={copied} copyErr={copyErr} />
  </Panel>

  function setNumLocal(v: string) { update({ num: v }) }
}
function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-8"><div className="mb-5 flex items-center gap-2"><WandSparkles size={18} className="text-primary"/><h2 className="font-semibold">{title}</h2></div>{children}</section> }
function Output({ value, copy, copied, copyErr }: { value: string; copy: () => void; copied: boolean; copyErr: boolean }) { return <div className="mt-6" aria-live="polite"><pre className="min-h-20 whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm">{value || '結果がここに表示されます'}</pre>{value && <div className="mt-3 flex items-center gap-3"><button type="button" onClick={copy} className="secondary">{copied ? <><Check size={16}/>コピー済み</> : <><Copy size={16}/>コピー</>}</button>{copyErr && <span className="text-sm text-destructive">コピーに失敗しました。手動で選択してコピーしてください</span>}</div>}</div> }
function RouletteControls({ items, setItems }: { items: string[]; setItems: (v: string[]) => void }) {
  const [result, setResult] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [cycle, setCycle] = useState('')
  const spin = () => { if (spinning || items.length === 0) return; setSpinning(true); setResult(''); const picked = items[Math.floor(Math.random() * items.length)] || ''; const dur = 1500; const base = 22; let elapsed = 0; const id = window.setInterval(() => { elapsed += base; const p = Math.min(1, elapsed / dur); const steps = Math.floor(p * p * items.length * 14); setCycle(items[steps % items.length]); if (elapsed >= dur) { window.clearInterval(id); setSpinning(false); setResult(picked); if (picked) setHistory((h) => [picked, ...h.filter(x => x !== picked)].slice(0, 10)) } }, base) }
  const copy = async () => { if (!result) return; try { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 1200) } catch { /* ignore */ } }
  return <div className="grid gap-4"><div className="flex flex-wrap gap-2">{items.map((item, i) => <button type="button" className="pill" key={`${item}-${i}`} onClick={() => setItems(items.filter((_, j) => i !== j))}>{item} ×</button>)}</div><input className="input" aria-label="選択肢を追加" placeholder="選択肢を追加してEnter" onKeyDown={e => { if (e.key === 'Enter' && e.currentTarget.value.trim()) { setItems([...items, e.currentTarget.value.trim()]); e.currentTarget.value = '' } }} /><button type="button" className="primary" onClick={spin} disabled={spinning}>{spinning ? '回転中...' : '決める'}</button><div className="relative flex min-h-44 items-center justify-center overflow-hidden rounded-2xl border border-border bg-primary/5 p-6">{spinning ? <p className="animate-cycle-blur text-4xl font-black tracking-tight text-primary">{cycle || '…'}</p> : result ? <div className="relative">{['✦','✦','✦','✦'].map((s, k) => <span key={k} className="pointer-events-none absolute inset-0 flex items-start justify-center text-primary animate-sparkle" style={{ transform: `rotate(${k * 90}deg)`, animationDelay: `${k * 0.06}s` }}>{s}</span>)}<p className="animate-result-bounce text-center text-4xl font-black tracking-tight text-primary">{result}</p></div> : <p className="text-lg font-medium text-muted-foreground">「決める」を押して決定！</p>}</div>{result && !spinning && <div className="flex justify-center gap-3"><button type="button" className="secondary" onClick={spin}>もう一度</button><button type="button" className="secondary" onClick={copy}>{copied ? <><Check size={16}/>コピー済み</> : <><Copy size={16}/>結果をコピー</>}</button></div>}{history.length > 0 && <div className="rounded-2xl border border-border bg-card p-4"><p className="text-xs font-medium text-muted-foreground">履歴（直近10件）</p><ul className="mt-2 space-y-1 text-sm">{history.map((h, i) => <li key={`${h}-${i}`} className="text-muted-foreground">{i + 1}. {h}</li>)}</ul></div>}</div>
}
function NumberListControls({ items, setItems }: { items: string[]; setItems: (v: string[]) => void }) {
  return <div className="grid gap-3">
    <div className="flex flex-wrap gap-2">{items.map((item, i) => <button type="button" className="pill" key={`${item}-${i}`} onClick={() => setItems(items.filter((_, j) => i !== j))}>{item} ×</button>)}</div>
    <input className="input" type="number" inputMode="decimal" aria-label="点数を追加" placeholder="点数を入力してEnter" onKeyDown={e => { if (e.key === 'Enter' && e.currentTarget.value.trim() && Number.isFinite(Number(e.currentTarget.value.trim()))) { setItems([...items, e.currentTarget.value.trim()]); e.currentTarget.value = '' } }} />
  </div>
}
function QrCodeCanvas({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!value) { canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height); setError(false); return }
    QRCode.toCanvas(canvas, value, { width: 240, margin: 1 }, (err: Error | null | undefined) => setError(!!err))
  }, [value])
  const download = () => {
    const canvas = canvasRef.current
    if (!canvas || !value) return
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  return <div className="mt-6 grid justify-items-center gap-4">
    <canvas ref={canvasRef} width={240} height={240} className="rounded-xl border border-border bg-white p-2" aria-label="生成されたQRコード" />
    {error && <p className="text-sm text-destructive">QRコードを生成できませんでした。内容を確認してください</p>}
    {value && !error && <button type="button" className="secondary" onClick={download}><Download size={16}/>PNGでダウンロード</button>}
  </div>
}
export default ToolWorkbench
