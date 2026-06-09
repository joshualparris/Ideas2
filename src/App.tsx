import { useEffect, useMemo, useState } from 'react'
import ideas from './data/ideas'
import type { IdeaFilters, RoutinePlan, ChildProfile, Category } from './types/idea'
import { filterIdeas, pickRandomIdea, routineSectionLabels } from './lib/idea-utils'
import { loadFavorites, loadRecentIds, loadRoutine, saveFavorites, saveRecentIds, saveRoutine } from './lib/storage'
import IdeaCard from './components/IdeaCard'
import RoutineBuilder from './components/RoutineBuilder'
import ExportImportPanel from './components/ExportImportPanel'
import EmptyState from './components/EmptyState'
import './index.css'

const categoryOptions: Array<Category | 'All'> = [
  'All',
  'Sensory Diet',
  'Outdoor',
  'Routine',
  'Co-play',
  'Calm Down',
  'Transition Help',
  'Heavy Work',
  'Bedtime',
  'Speech/Communication',
  'Fine Motor',
  'Imaginative Play',
]

const profileOptions: Array<ChildProfile | 'Both'> = ['Both', 'Sylvie', 'Elias']

const initialFilters: IdeaFilters = {
  search: '',
  category: 'All',
  childProfile: 'Both',
  quickOnly: false,
  fiveMinutes: false,
  lowEffort: false,
  highEnergy: false,
  calmNow: false,
}

const initialRoutine: RoutinePlan = {
  morning: [],
  afterPreschool: [],
  beforeDinner: [],
  bedtime: [],
}

function App() {
  const [filters, setFilters] = useState<IdeaFilters>(initialFilters)
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [routine, setRoutine] = useState<RoutinePlan>(initialRoutine)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    setFavorites(loadFavorites())
    setRecentIds(loadRecentIds())
    setRoutine(loadRoutine())
  }, [])

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  useEffect(() => {
    saveRecentIds(recentIds)
  }, [recentIds])

  useEffect(() => {
    saveRoutine(routine)
  }, [routine])

  const filteredIdeas = useMemo(() => filterIdeas(ideas, filters), [filters])

  useEffect(() => {
    if (!highlightId && filteredIdeas.length > 0) {
      setHighlightId(filteredIdeas[0].id)
    }
  }, [filteredIdeas, highlightId])

  useEffect(() => {
    if (highlightId && !filteredIdeas.some((idea) => idea.id === highlightId)) {
      setHighlightId(filteredIdeas[0]?.id ?? null)
    }
  }, [filteredIdeas, highlightId])

  const highlightIdea = useMemo(
    () => ideas.find((idea) => idea.id === highlightId) ?? filteredIdeas[0] ?? null,
    [highlightId, filteredIdeas],
  )

  const favoriteIdeas = useMemo(
    () => ideas.filter((idea) => favorites.includes(idea.id)),
    [favorites],
  )

  const recentIdeas = useMemo(
    () => recentIds.map((id) => ideas.find((idea) => idea.id === id)).filter(Boolean) as typeof ideas,
    [recentIds],
  )

  const chooseRandomIdea = () => {
    if (filteredIdeas.length === 0) {
      setStatusMessage('No ideas match the current filters. Try a broader search or different category.')
      return
    }

    const selection = pickRandomIdea(filteredIdeas, recentIds, 6)
    if (!selection) {
      setStatusMessage('Unable to pick a new idea right now.')
      return
    }

    setHighlightId(selection.id)
    setStatusMessage('Here is a fresh idea to try.')
    setRecentIds((current) => [selection.id, ...current.filter((id) => id !== selection.id)].slice(0, 12))
  }

  const toggleFavorite = (ideaId: string) => {
    setFavorites((current) =>
      current.includes(ideaId) ? current.filter((id) => id !== ideaId) : [ideaId, ...current],
    )
  }

  const addToRoutine = (section: keyof RoutinePlan, ideaId: string) => {
    setRoutine((current) => {
      if (current[section].includes(ideaId)) {
        return current
      }
      return {
        ...current,
        [section]: [ideaId, ...current[section]],
      }
    })
    setStatusMessage(`Added to ${routineSectionLabels[section]}.`)
  }

  const removeFromRoutine = (section: keyof RoutinePlan, ideaId: string) => {
    setRoutine((current) => ({
      ...current,
      [section]: current[section].filter((id) => id !== ideaId),
    }))
  }

  const clearRoutine = () => {
    setRoutine(initialRoutine)
    setStatusMessage('Routine cleared. Start building again when ready.')
  }

  const updateFilters = (changes: Partial<IdeaFilters>) => {
    setFilters((current) => ({ ...current, ...changes }))
  }

  const importUserData = (data: { favorites: string[]; recentIds: string[]; routine: RoutinePlan }) => {
    setFavorites(data.favorites)
    setRecentIds(data.recentIds)
    setRoutine(data.routine)
    setStatusMessage('Imported your saved ideas successfully.')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Family idea helper</p>
          <h1>Sylvie + Elias Idea Generator</h1>
          <p className="hero-copy">
            Calm, quick activity suggestions for parents who want outdoor play, sensory support, and easy
            routine ideas.
          </p>
        </div>

        <button className="primary-button" type="button" onClick={chooseRandomIdea}>
          Give me an idea
        </button>
      </header>

      <section className="highlight-card" aria-live="polite">
        <div className="highlight-card-top">
          <div>
            <p className="eyebrow">Quick idea</p>
            <h2>{highlightIdea ? highlightIdea.title : 'No idea yet'}</h2>
            {highlightIdea ? (
              <p>{highlightIdea.why}</p>
            ) : (
              <p>Use filters or the button above to find a safe idea.</p>
            )}
          </div>
          <div className="small-badge">{filteredIdeas.length} ideas ready</div>
        </div>
        {statusMessage ? <p className="status-message">{statusMessage}</p> : null}
      </section>

      <div className="filter-panel">
        <div className="filter-group" aria-label="Profile filter">
          <span className="filter-label">Child</span>
          {profileOptions.map((profile) => (
            <button
              key={profile}
              type="button"
              className={`chip ${filters.childProfile === profile ? 'chip-active' : ''}`}
              onClick={() => updateFilters({ childProfile: profile })}
            >
              {profile}
            </button>
          ))}
        </div>

        <div className="filter-group" aria-label="Category filter">
          <span className="filter-label">Category</span>
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              className={`chip ${filters.category === category ? 'chip-active' : ''}`}
              onClick={() => updateFilters({ category })}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <section className="search-panel">
        <label className="search-label" htmlFor="idea-search">
          Search ideas
        </label>
        <input
          id="idea-search"
          type="search"
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.target.value })}
          placeholder="Search by activity, sensory support, or location"
        />
      </section>

      <section className="quick-filter-panel" aria-label="Quick filters">
        <button
          type="button"
          className={`chip ${filters.quickOnly ? 'chip-active' : ''}`}
          onClick={() => updateFilters({ quickOnly: !filters.quickOnly })}
        >
          Quick idea
        </button>
        <button
          type="button"
          className={`chip ${filters.fiveMinutes ? 'chip-active' : ''}`}
          onClick={() => updateFilters({ fiveMinutes: !filters.fiveMinutes })}
        >
          5 minutes
        </button>
        <button
          type="button"
          className={`chip ${filters.lowEffort ? 'chip-active' : ''}`}
          onClick={() => updateFilters({ lowEffort: !filters.lowEffort })}
        >
          Low effort
        </button>
        <button
          type="button"
          className={`chip ${filters.highEnergy ? 'chip-active' : ''}`}
          onClick={() => updateFilters({ highEnergy: !filters.highEnergy })}
        >
          High energy
        </button>
        <button
          type="button"
          className={`chip ${filters.calmNow ? 'chip-active' : ''}`}
          onClick={() => updateFilters({ calmNow: !filters.calmNow })}
        >
          Need calm
        </button>
      </section>

      <section className="section-heading">
        <h2>Ideas</h2>
        <p className="section-copy">Browse the full list or save favourites to use again later.</p>
      </section>

      {filteredIdeas.length === 0 ? (
        <EmptyState
          title="No ideas found"
          message="Try a broader search, switch the child profile, or turn off a quick filter."
        />
      ) : (
        <div className="idea-grid">
          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              isFavorite={favorites.includes(idea.id)}
              onToggleFavorite={toggleFavorite}
              onAddToRoutine={addToRoutine}
            />
          ))}
        </div>
      )}

      <section className="side-sections">
        <div className="compact-panel" aria-labelledby="favourites-title">
          <h2 id="favourites-title">Favourites</h2>
          {favoriteIdeas.length === 0 ? (
            <p className="empty-text">Save ideas with the star button to see them here.</p>
          ) : (
            <ul className="simple-list">
              {favoriteIdeas.slice(0, 6).map((idea) => (
                <li key={idea.id}>{idea.title}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="compact-panel" aria-labelledby="recent-title">
          <h2 id="recent-title">Recently used</h2>
          {recentIdeas.length === 0 ? (
            <p className="empty-text">Recent picks appear here after you choose an idea.</p>
          ) : (
            <ul className="simple-list">
              {recentIdeas.slice(0, 6).map((idea) => (
                <li key={idea.id}>{idea.title}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <RoutineBuilder routine={routine} ideas={ideas} onRemove={removeFromRoutine} onClear={clearRoutine} />
      <ExportImportPanel favorites={favorites} recentIds={recentIds} routine={routine} onImport={importUserData} />
    </div>
  )
}

export default App
