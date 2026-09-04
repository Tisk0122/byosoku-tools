'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Check, Copy, RotateCcw, WandSparkles } from 'lucide-react'

type Props = { kind: string }

const toDate = (value: string) => {
  const [y, m, d] = value.split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : null
}
const fmt = (n: number) => Number.isFinite(n) ? n.toLocaleString('ja-JP', { maximumFractionDigits: 2 }) : ''

export function ToolWorkbench({ kind }: Props) {
  const [text, setText] = useState('')
  const [text2, setText2] = useState('')
  const [num, setNum] = useState('')
  const [num2, setNum2] = useState('')
  const [num3, setNum3] = useState('')
  const [rate, setRate] = useState('10')
  const [date, setDate] = useState('')
  const [date2, setDate2] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [widthMode, setWidthMode] = useState<'half' | 'full'>('half')
  const [result, setResult] = useState('')
  const [items, setItems] = useState(['今日のご飯', '映画を見る', '散歩する', '読書する'])
  const [copied, setCopied] = useState(false)

  const output = useMemo(() => {
    const a = Number(num), b = Number(num2), c = Number(num3)
    if (kind === 'char-count') return `文字数：${text.length}\n空白除外：${text.replace(/\s/g, '').length}\n行数：${text ? text.split(/\r?\n/).length : 0}`
    if (kind === 'remove-linebreaks') return text.replace(/[\r\n]+/g, '')
    if (kind === 'remove-spaces') return text.replace(/[\s　]+/g, '')
    if (kind === 'width-converter') return widthMode === 'half' ? text.replace(/[！-～]/g, x => String.fromCharCode(x.charCodeAt(0) - 0xfee0)).replace(/　/g, ' ') : text.replace(/[!-~]/g, x => String.fromCharCode(x.charCodeAt(0) + 0xfee0)).replace(/ /g, '　')
    if (kind === 'text-compare') return text === text2 ? '2つの文章は一致しています' : '2つの文章は異なります'
    if (kind === 'tax') return Number.isFinite(a) && num !== '' ? `税込価格：${fmt(Math.round(a * (1 + Number(rate) / 100)))}円\n消費税：${fmt(Math.round(a * Number(rate) / 100))}円` : ''
    if (kind === 'discount') return Number.isFinite(a) && Number.isFinite(b) && num !== '' && num2 !== '' ? `割引後価格：${fmt(Math.round(a * (1 - b / 100)))}円\n割引額：${fmt(Math.round(a * b / 100))}円` : ''
    if (kind === 'percent') return Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? `${fmt(a / b * 100)}%\n増減率：${fmt((a - b) / b * 100)}%` : ''
    if (kind === 'split-bill') return a > 0 && b > 0 ? `1人あたり：${fmt(Math.ceil(a / b))}円\n端数：${fmt(a % b)}円` : ''
    if (kind === 'age') { const birth = toDate(date); if (!birth) return ''; const now = new Date(); let age = now.getFullYear() - birth.getFullYear(); if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--; return `満年齢：${Math.max(0, age)}歳` }
    if (kind === 'date-difference') { const x = toDate(date), y = toDate(date2); return x && y ? `日数差：${Math.abs(Math.round((y.getTime() - x.getTime()) / 86400000))}日` : '' }
    if (kind === 'countdown') { const x = toDate(date); if (!x) return ''; const days = Math.ceil((x.getTime() - new Date(new Date().setHours(0,0,0,0)).getTime()) / 86400000); return days >= 0 ? `あと${days}日` : `${Math.abs(days)}日前に終了` }
    if (kind === 'hensachi') return c > 0 && num !== '' ? `偏差値：${fmt(50 + (a - b) / c * 10)}` : ''
    if (kind === 'study-time') { const x = date.split(':').map(Number), y = date2.split(':').map(Number); if (x.length !== 2 || y.length !== 2 || x.some(Number.isNaN) || y.some(Number.isNaN)) return ''; let mins = y[0]*60+y[1]-(x[0]*60+x[1]); if (mins < 0) mins += 1440; return `勉強時間：${Math.floor(mins/60)}時間${mins%60}分` }
    if (kind === 'json') { try { const parsed = JSON.parse(text); return JSON.stringify(parsed, null, 2) } catch { return text ? 'JSONを確認してください' : '' } }
    if (kind === 'base64') { try { return mode === 'encode' ? btoa(unescape(encodeURIComponent(text))) : decodeURIComponent(escape(atob(text))) } catch { return text ? 'Base64を確認してください' : '' } }
    return result
  }, [kind, text, text2, num, num2, num3, rate, date, date2, mode, widthMode, result])

  const copy = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); setCopied(true); window.setTimeout(() => setCopied(false), 1200) } catch {} }
  const clear = () => { setText(''); setText2(''); setNum(''); setNum2(''); setNum3(''); setDate(''); setDate2(''); setResult('') }
  const field = (label: string, value: string, set: (v: string) => void, type = 'number') => <label className="grid gap-2 text-sm font-medium">{label}<input aria-label={label} type={type} value={value} onChange={e => set(e.target.value)} className="input" /></label>
  const basic = ['char-count','remove-linebreaks','remove-spaces','width-converter','json','base64'].includes(kind)
  return <Panel title="入力して結果を確認">
    {basic && <label className="grid gap-2 text-sm font-medium">テキスト<textarea aria-label="テキスト" value={text} onChange={e => setText(e.target.value)} className="input min-h-40 resize-y" placeholder="ここに入力してください" /></label>}
    {kind === 'text-compare' && <div className="grid gap-4 md:grid-cols-2">{field('文章1', text, setText, 'text')}{field('文章2', text2, setText2, 'text')}</div>}
    {kind === 'tax' && <div className="grid gap-4 md:grid-cols-2">{field('税抜価格（円）', num, setNum)}{field('税率（%）', rate, setRate)}</div>}
    {kind === 'discount' && <div className="grid gap-4 md:grid-cols-2">{field('元の価格（円）', num, setNum)}{field('割引率（%）', num2, setNum2)}</div>}
    {kind === 'percent' && <div className="grid gap-4 md:grid-cols-2">{field('現在の値', num, setNum)}{field('基準の値', num2, setNum2)}</div>}
    {kind === 'split-bill' && <div className="grid gap-4 md:grid-cols-2">{field('合計金額（円）', num, setNum)}{field('人数', num2, setNum2)}</div>}
    {kind === 'age' && field('生年月日', date, setDate, 'date')}
    {['date-difference','countdown'].includes(kind) && <div className="grid gap-4 md:grid-cols-2">{field(kind === 'countdown' ? '目標日' : '開始日', date, setDate, 'date')}{kind === 'date-difference' && field('終了日', date2, setDate2, 'date')}</div>}
    {kind === 'hensachi' && <div className="grid gap-4 md:grid-cols-3">{field('自分の点数', num, setNum)}{field('平均点', num2, setNum2)}{field('標準偏差', num3, setNum3)}</div>}
    {kind === 'study-time' && <div className="grid gap-4 md:grid-cols-2">{field('開始時刻', date, setDate, 'time')}{field('終了時刻', date2, setDate2, 'time')}</div>}
    {kind === 'width-converter' && <div className="mb-4 flex gap-2"><button type="button" className={widthMode === 'half' ? 'primary' : 'secondary'} onClick={() => setWidthMode('half')}>半角へ</button><button type="button" className={widthMode === 'full' ? 'primary' : 'secondary'} onClick={() => setWidthMode('full')}>全角へ</button></div>}
    {kind === 'base64' && <div className="mb-4 flex gap-2"><button type="button" className={mode === 'encode' ? 'primary' : 'secondary'} onClick={() => setMode('encode')}>エンコード</button><button type="button" className={mode === 'decode' ? 'primary' : 'secondary'} onClick={() => setMode('decode')}>デコード</button></div>}
    {kind === 'uuid' && <div className="grid gap-2">{field('生成個数（1〜100）', num || '1', setNum)}<button type="button" className="primary" onClick={() => { const n = Math.min(100, Math.max(1, Number(num) || 1)); setResult(Array.from({length:n}, () => crypto.randomUUID()).join('\n')) }}>生成する</button></div>}
    {kind === 'roulette' && <><div className="flex flex-wrap gap-2">{items.map((item, i) => <button type="button" className="pill" key={`${item}-${i}`} onClick={() => setItems(items.filter((_, j) => i !== j))}>{item} ×</button>)}</div><input className="input mt-4" aria-label="選択肢を追加" placeholder="選択肢を追加してEnter" onKeyDown={e => { if (e.key === 'Enter' && e.currentTarget.value.trim()) { setItems([...items, e.currentTarget.value.trim()]); e.currentTarget.value = '' } }} /><button type="button" className="primary mt-4" onClick={() => setResult(items[Math.floor(Math.random() * items.length)] || '選択肢を追加してください')}>決める</button></>}
    {kind !== 'uuid' && kind !== 'roulette' && <div className="mt-5 flex gap-2"><button type="button" className="secondary" onClick={clear}><RotateCcw size={16}/>クリア</button></div>}
    <Output value={output} copy={copy} copied={copied} />
  </Panel>
}
function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-8"><div className="mb-5 flex items-center gap-2"><WandSparkles size={18} className="text-primary"/><h2 className="font-semibold">{title}</h2></div>{children}</section> }
function Output({ value, copy, copied }: { value: string; copy: () => void; copied: boolean }) { return <div className="mt-6" aria-live="polite"><pre className="min-h-20 whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm">{value || '結果がここに表示されます'}</pre>{value && <button type="button" onClick={copy} className="secondary mt-3">{copied ? <><Check size={16}/>コピー済み</> : <><Copy size={16}/>コピー</>}</button>}</div> }

export default ToolWorkbench
