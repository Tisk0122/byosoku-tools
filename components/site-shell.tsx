'use client'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeftRight, ArrowRight, BadgePercent, Binary, Braces, Cake, CalendarRange, ChartNoAxesColumnIncreasing, Clock3, Dices, Eraser, Fingerprint, GitCompare, Menu, Moon, Percent, ReceiptText, Search, Star, Sun, Timer, Trash2, Type, Users, WrapText, X, Zap } from 'lucide-react'
import { categories } from '@/data/categories'
import { tools, type ToolDefinition } from '@/data/tools'

export function Header() {
 const [open,setOpen]=useState(false); const [dark,setDark]=useState(false)
 useEffect(()=>{setDark(document.documentElement.classList.contains('dark'))},[])
 const toggle=()=>{const nextDark=!dark; setDark(nextDark); document.documentElement.classList.toggle('dark',nextDark); document.documentElement.classList.toggle('light',!nextDark); try { window.localStorage.setItem('byousoku.theme', nextDark ? 'dark' : 'light') } catch { /* ignore */ }}
 return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl transition-colors duration-300"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"><Link href="/" className="flex items-center gap-2 font-semibold tracking-tight"><span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground"><Zap size={17} fill="currentColor" /></span><span>秒速ツール</span></Link><nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex"><Link href="/" className="hover:text-foreground">ホーム</Link><Link href="/#categories" className="hover:text-foreground">カテゴリー</Link><Link href="/#popular" className="hover:text-foreground">人気ツール</Link><Link href="/#favorites" className="hover:text-foreground">お気に入り</Link><Link href="/#new" className="hover:text-foreground">新着ツール</Link></nav><div className="flex items-center gap-2"><button type="button" aria-label="テーマ切り替え" onClick={toggle} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">{dark?<Sun size={18}/>:<Moon size={18}/>}</button><button type="button" aria-label="メニュー" aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(!open)} className="grid size-9 place-items-center rounded-lg hover:bg-muted md:hidden">{open?<X size={19}/>:<Menu size={19}/>}</button></div></div>{open&&<nav id="mobile-nav" className="animate-fade-up border-t border-border bg-background px-5 py-4 md:hidden"><div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm"><Link href="/" onClick={()=>setOpen(false)}>ホーム</Link><Link href="/#categories" onClick={()=>setOpen(false)}>カテゴリー</Link><Link href="/#popular" onClick={()=>setOpen(false)}>人気ツール</Link><Link href="/#favorites" onClick={()=>setOpen(false)}>お気に入り</Link><Link href="/#new" onClick={()=>setOpen(false)}>新着ツール</Link></div></nav>}</header>
}
function clearLocalData(){
 if(typeof window==='undefined')return
 if(!window.confirm('この端末に保存されているツールの入力内容とお気に入りをすべて削除します。よろしいですか？'))return
 try{
  Object.keys(window.localStorage).filter(k=>k.startsWith('byousoku.workbench.')||k==='byousoku.favorites').forEach(k=>window.localStorage.removeItem(k))
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT))
  window.alert('保存されていたデータを削除しました')
 }catch{
  window.alert('削除に失敗しました。ブラウザの設定をご確認ください')
 }
}
export function Footer(){return <footer className="border-t border-border bg-card"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between"><div><Link href="/" className="flex items-center gap-2 font-semibold"><span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground"><Zap size={15} fill="currentColor"/></span>秒速ツール</Link><p className="mt-2 text-sm text-muted-foreground">面倒なことを、1秒で。</p></div><div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"><Link href="/">ホーム</Link><Link href="/#categories">カテゴリー</Link><Link href="/#popular">人気ツール</Link><Link href="/terms">利用規約</Link><Link href="/privacy">プライバシーポリシー</Link><Link href="/contact">お問い合わせ</Link><button type="button" onClick={clearLocalData} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"><Trash2 size={14}/>保存データを削除</button></div><p className="text-xs text-muted-foreground">© 2026 秒速ツール</p></div></footer>}
const AD_UNIT_SP={src:'https://adm.shinobi.jp/s/85aa2dd7605fda52b119a8b9f691cb40',width:320,height:50}
const AD_UNIT_PC={src:'https://adm.shinobi.jp/s/35c6779d0fa252f5a810f17a43736fed',width:728,height:90}
export function AdSlot(){
 const [isMobile,setIsMobile]=useState<boolean|null>(null)
 useEffect(()=>{
  const mql=window.matchMedia('(max-width: 767px)')
  const update=()=>setIsMobile(mql.matches)
  update()
  mql.addEventListener('change',update)
  return ()=>mql.removeEventListener('change',update)
 },[])
 if(isMobile===null)return <div className="mx-auto my-8 h-[50px] w-full max-w-[320px] md:h-[90px] md:max-w-[728px]" aria-hidden="true"/>
 const unit=isMobile?AD_UNIT_SP:AD_UNIT_PC
 const srcDoc=`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:transparent"><script type="text/javascript" charset="utf-8" src="${unit.src}"><\/script></body></html>`
 return <div className="mx-auto my-8 w-full" style={{maxWidth:unit.width}}><iframe key={unit.src} title="広告" srcDoc={srcDoc} className="block w-full border-0" style={{height:unit.height}} loading="lazy"/></div>
}
function Icon({name}:{name:string}){const icons:any={Type,Search,Dices,Zap,WrapText,Eraser,ArrowLeftRight,GitCompare,ReceiptText,BadgePercent,Percent,Users,Cake,CalendarRange,Timer,ChartNoAxesColumnIncreasing,Clock3,Braces,Fingerprint,Binary}; const I=icons[name]||Zap; return <I size={20}/>}

const FAVORITES_KEY='byousoku.favorites'
const FAVORITES_EVENT='byousoku:favorites-changed'
function readFavorites():string[]{
 if(typeof window==='undefined')return []
 try{const raw=window.localStorage.getItem(FAVORITES_KEY); const parsed=raw?JSON.parse(raw):[]; return Array.isArray(parsed)?parsed:[]}catch{return []}
}
function writeFavorites(list:string[]){
 try{window.localStorage.setItem(FAVORITES_KEY,JSON.stringify(list))}catch{/* ignore */}
 window.dispatchEvent(new CustomEvent(FAVORITES_EVENT))
}
export function useFavorites(){
 const [favorites,setFavorites]=useState<string[]>([])
 const [mounted,setMounted]=useState(false)
 useEffect(()=>{
  setFavorites(readFavorites()); setMounted(true)
  const onChange=()=>setFavorites(readFavorites())
  window.addEventListener(FAVORITES_EVENT,onChange)
  window.addEventListener('storage',onChange)
  return ()=>{window.removeEventListener(FAVORITES_EVENT,onChange); window.removeEventListener('storage',onChange)}
 },[])
 const toggle=(slug:string)=>{
  const set=new Set(favorites)
  set.has(slug)?set.delete(slug):set.add(slug)
  const next=Array.from(set)
  setFavorites(next); writeFavorites(next)
 }
 return {favorites,mounted,toggle,isFavorite:(slug:string)=>favorites.includes(slug)}
}
export function ToolCard({tool}:{tool:ToolDefinition}){
 const {isFavorite,toggle}=useFavorites()
 const fav=isFavorite(tool.slug)
 return <Link href={`/tools/${tool.slug}`} className="group animate-fade-up flex min-h-40 flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"><div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon name={tool.icon}/></span><div className="flex items-center gap-2">{tool.new&&<span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">NEW</span>}<button type="button" aria-label={fav?'お気に入りから削除':'お気に入りに追加'} aria-pressed={fav} onClick={e=>{e.preventDefault();e.stopPropagation();toggle(tool.slug)}} className="grid size-7 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-primary"><Star size={16} className={fav?'fill-primary text-primary':''}/></button><ArrowRight size={18} className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"/></div></div><div><h3 className="mt-4 font-semibold">{tool.name}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{tool.description}</p></div></Link>
}
export function FavoritesSection(){
 const {favorites,mounted}=useFavorites()
 if(!mounted||favorites.length===0)return null
 const list=tools.filter(t=>favorites.includes(t.slug))
 if(!list.length)return null
 return <section id="favorites" className="animate-fade-up mx-auto max-w-6xl px-5 py-20"><div className="flex items-end justify-between"><div><p className="text-sm font-medium text-primary">あなたの</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">お気に入りツール</h2></div><span className="hidden text-sm text-muted-foreground md:block">星マークで追加・解除できます</span></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map(t=><ToolCard key={t.slug} tool={t}/>)}</div></section>
}
export function SearchTools(){const [q,setQ]=useState(''); const results=useMemo(()=>tools.filter(t=>(t.name+t.description+(categories.find(c=>c.slug===t.categorySlug)?.name||'')).includes(q)),[q]); return <div className="mx-auto max-w-3xl"><div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-lg shadow-primary/5 focus-within:border-primary"><Search className="text-primary" size={21}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="文字数カウント、割引計算、ルーレット..." className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"/></div>{q&&<div className="animate-fade-up mt-3 grid gap-2 rounded-2xl border border-border bg-card p-3 shadow-xl">{results.length?results.slice(0,6).map(t=><Link key={t.slug} href={`/tools/${t.slug}`} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-muted"><span>{t.name}</span><ArrowRight size={15}/></Link>):<p className="px-3 py-4 text-sm text-muted-foreground">該当するツールが見つかりませんでした</p>}</div>}</div>}
export function Roulette(){const [items,setItems]=useState(['今日のご飯','映画を見る','散歩する','読書する']); const [value,setValue]=useState(''); const [history,setHistory]=useState<string[]>([]); const [copied,setCopied]=useState(false); const [spinning,setSpinning]=useState(false); const [cycle,setCycle]=useState(''); const spin=()=>{if(spinning||items.length===0)return; setSpinning(true); setValue(''); const picked=items[Math.floor(Math.random()*items.length)]||''; const dur=1500; const base=22; let elapsed=0; const id=window.setInterval(()=>{elapsed+=base; const p=Math.min(1,elapsed/dur); const steps=Math.floor(p*p*items.length*14); setCycle(items[steps%items.length]); if(elapsed>=dur){window.clearInterval(id); setSpinning(false); setValue(picked); if(picked)setHistory(h=>[picked,...h.filter(x=>x!==picked)].slice(0,10))}},base)}; const copy=async()=>{if(!value)return; try{await navigator.clipboard.writeText(value);setCopied(true);setTimeout(()=>setCopied(false),1200)}catch{}}; return <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground"><Dices/></span><div><p className="text-sm font-medium text-primary">遊び・SNS</p><h2 className="text-xl font-semibold">究極の決定ルーレット</h2></div></div><p className="mt-5 text-sm leading-6 text-muted-foreground">迷ったときは、答えをルーレットに任せてみよう。</p><div className="mt-5 flex flex-wrap gap-2">{items.map((x,i)=><button type="button" key={`${x}-${i}`} onClick={()=>setItems(items.filter((_,j)=>j!==i))} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-destructive">{x} ×</button>)}</div><div className="mt-4 flex gap-2"><input aria-label="選択肢を追加" id="roulette-add" className="min-w-0 flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary" placeholder="選択肢を追加" onKeyDown={e=>{if(e.key==='Enter'&&e.currentTarget.value.trim()){setItems([...items,e.currentTarget.value.trim()]);e.currentTarget.value=''}}}/><button type="button" onClick={spin} disabled={spinning} className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{spinning?'回転中...':'回す'}</button></div><div className="relative mt-6 flex min-h-44 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-6"><div className={spinning?'absolute inset-0 animate-wheel-spin rounded-full opacity-30 blur-sm ring-4 ring-primary/40':''}/>{spinning?<p className="animate-cycle-blur text-4xl font-black tracking-tight text-primary">{cycle||'…'}</p>:value?<div className="relative"><span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 text-primary">✦</span>{[0,1,2,3,4,5].map(k=>{const a=(k/6)*360; return <span key={k} className="pointer-events-none absolute -top-8 left-1/2 size-2 rounded-full bg-primary animate-sparkle" style={{transform:`translateX(-50%) rotate(${a}deg) translateY(-26px)`,animationDelay:`${k*0.06}s`}}/>})}<p className="animate-result-bounce text-center text-4xl font-black tracking-tight text-primary">{value}</p></div>:<p className="text-lg font-medium text-muted-foreground">「回す」を押して決定！</p>}</div>{value&&!spinning&&<div className="mt-4 flex justify-center gap-3"><button type="button" onClick={spin} className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">もう一度回す</button><button type="button" onClick={copy} className="rounded-xl border border-border bg-card px-5 py-2 text-sm font-medium transition hover:bg-muted">{copied?'コピー済み':'結果をコピー'}</button></div>}{history.length>0&&<div className="mt-6 rounded-2xl border border-border bg-card p-4"><p className="text-xs font-medium text-muted-foreground">履歴（直近10件）</p><ul className="mt-2 space-y-1 text-sm">{history.map((h,i)=><li key={`${h}-${i}`} className="text-muted-foreground">{i+1}. {h}</li>)}</ul></div>}</div>}
