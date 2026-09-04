import type { LucideIcon } from 'lucide-react'
import { CalendarDays, Calculator, Code2, Dices, GraduationCap, Type } from 'lucide-react'

export type Category = { slug: string; name: string; description: string; icon: LucideIcon }
export const categories: Category[] = [
  { slug: 'text', name: '文章・テキスト', description: '文章作成や編集をもっと効率的に', icon: Type },
  { slug: 'calculation', name: '計算', description: '暮らしに役立つ計算をすばやく', icon: Calculator },
  { slug: 'date-time', name: '日付・時間', description: '日付や時間にまつわる計算', icon: CalendarDays },
  { slug: 'student', name: '学生', description: '勉強や学校生活をサポート', icon: GraduationCap },
  { slug: 'development', name: '開発', description: '開発者のための小さな便利ツール', icon: Code2 },
  { slug: 'fun', name: '遊び・SNS', description: '迷ったときに楽しく決めよう', icon: Dices },
]
export const getCategory = (slug: string) => categories.find((category) => category.slug === slug)
