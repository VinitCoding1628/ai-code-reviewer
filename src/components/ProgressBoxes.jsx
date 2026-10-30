import { BookOpen, CodeXml, Zap } from 'lucide-react'

function getScoreTier(score) {
  if (score < 50) {
    return {
      Icon: CodeXml,
      accent: 'text-rose-600 dark:text-rose-400',
    }
  }
  if (score < 75) {
    return {
      Icon: BookOpen,
      accent: 'text-orange-600 dark:text-orange-400',
    }
  }
  return {
    Icon: Zap,
    accent: 'text-emerald-600 dark:text-emerald-400',
  }
}

const ProgressBoxes = ({ name, score }) => {
  const { Icon, accent } = getScoreTier(score)

  return (
    <div className="flex w-full items-center gap-2.5 rounded-md border border-muted-foreground/20 px-2 py-2.5 shadow">
      <Icon className={`size-5 shrink-0 ${accent}`} aria-hidden />
      <div className="flex min-w-0 flex-col gap-0.5">
        <h4 className="text-balance font-medium">{name}</h4>
        <p className="text-xs text-muted-foreground">{score}/100</p>
      </div>
    </div>
  )
}

export default ProgressBoxes
