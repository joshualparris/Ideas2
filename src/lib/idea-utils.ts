import type { Idea, IdeaFilters, RoutineSection } from '../types/idea'

export const routineSectionLabels: Record<RoutineSection, string> = {
  morning: 'Morning',
  afterPreschool: 'After preschool',
  beforeDinner: 'Before dinner',
  bedtime: 'Bath / bedtime',
}

export function matchesFilters(idea: Idea, filters: IdeaFilters): boolean {
  const text = `${idea.title} ${idea.category} ${idea.sensorySystem} ${idea.why}`.toLowerCase()
  const searchMatches = filters.search.trim().length === 0 || text.includes(filters.search.toLowerCase())
  const categoryMatches = filters.category === 'All' || idea.category === filters.category
  const childMatches =
    filters.childProfile === 'Both' || idea.childProfiles.includes(filters.childProfile)

  const quickMatches = !filters.quickOnly || (idea.durationMinutes <= 10 && idea.effortLevel !== 'High')
  const fiveMinuteMatches = !filters.fiveMinutes || idea.durationMinutes <= 5
  const lowEffortMatches = !filters.lowEffort || idea.effortLevel === 'Low'
  const highEnergyMatches = !filters.highEnergy || idea.energyLevel === 'High'
  const calmNowMatches = !filters.calmNow || idea.energyLevel === 'Low' || idea.category === 'Calm Down'

  return (
    searchMatches &&
    categoryMatches &&
    childMatches &&
    quickMatches &&
    fiveMinuteMatches &&
    lowEffortMatches &&
    highEnergyMatches &&
    calmNowMatches
  )
}

export function filterIdeas(ideas: Idea[], filters: IdeaFilters): Idea[] {
  return ideas.filter((idea) => matchesFilters(idea, filters))
}

export function pickRandomIdea(ideas: Idea[], recentIds: string[], avoidRecent = 6): Idea | undefined {
  if (ideas.length === 0) {
    return undefined
  }

  const recentSet = new Set(recentIds.slice(-avoidRecent))
  const candidates = ideas.filter((idea) => !recentSet.has(idea.id))
  const source = candidates.length > 0 ? candidates : ideas
  return source[Math.floor(Math.random() * source.length)]
}
