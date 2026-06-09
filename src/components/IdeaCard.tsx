import type { Idea, RoutineSection } from '../types/idea'

interface IdeaCardProps {
  idea: Idea
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onAddToRoutine: (section: RoutineSection, ideaId: string) => void
}

const sectionOptions: Array<{ value: RoutineSection; label: string }> = [
  { value: 'morning', label: 'Morning' },
  { value: 'afterPreschool', label: 'After preschool' },
  { value: 'beforeDinner', label: 'Before dinner' },
  { value: 'bedtime', label: 'Bath / bedtime' },
]

function formatList(items: string[]): string {
  return items.join(', ')
}

export default function IdeaCard({ idea, isFavorite, onToggleFavorite, onAddToRoutine }: IdeaCardProps) {
  return (
    <article className="idea-card">
      <div className="idea-card-header">
        <div>
          <p className="idea-meta">{idea.category} · {idea.location}</p>
          <h3>{idea.title}</h3>
        </div>
        <button
          type="button"
          className={`favorite-button ${isFavorite ? 'favorite-active' : ''}`}
          onClick={() => onToggleFavorite(idea.id)}
          aria-label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="idea-badges">
        <span className="badge">{idea.energyLevel} energy</span>
        <span className="badge">{idea.effortLevel} effort</span>
        <span className="badge">{idea.durationMinutes} min</span>
      </div>

      <div className="idea-details">
        <p className="idea-detail"><strong>Best time:</strong> {idea.bestTime}</p>
        <p className="idea-detail"><strong>Sensory focus:</strong> {idea.sensorySystem}</p>
        <p className="idea-detail"><strong>Materials:</strong> {formatList(idea.materials)}</p>
      </div>

      <details className="idea-expansion">
        <summary>How to do it</summary>
        <ol>
          {idea.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
        <p><strong>Why it helps</strong>: {idea.why}</p>
        <p className="safety-note"><strong>Safety:</strong> {idea.safetyNotes}</p>
      </details>

      <div className="idea-actions">
        <label className="routine-select-label">
          Add to routine
          <select
            defaultValue=""
            onChange={(event) => {
              const target = event.target as HTMLSelectElement
              const section = target.value as RoutineSection
              if (section) {
                onAddToRoutine(section, idea.id)
                target.value = ''
              }
            }}
            aria-label={`Add ${idea.title} to routine`}
          >
            <option value="">Choose section</option>
            {sectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </article>
  )
}
