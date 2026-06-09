import type { Idea, RoutinePlan, RoutineSection } from '../types/idea'
import { routineSectionLabels } from '../lib/idea-utils'

interface RoutineBuilderProps {
  routine: RoutinePlan
  ideas: Idea[]
  onRemove: (section: RoutineSection, ideaId: string) => void
  onClear: () => void
}

export default function RoutineBuilder({ routine, ideas, onRemove, onClear }: RoutineBuilderProps) {
  return (
    <section className="routine-panel" aria-labelledby="routine-title">
      <div className="section-header">
        <div>
          <h2 id="routine-title">Routine builder</h2>
          <p className="section-copy">Quickly see one plan for morning, after preschool, before dinner, and bedtime.</p>
        </div>
        <button type="button" className="secondary-button" onClick={onClear}>
          Clear all
        </button>
      </div>

      <div className="routine-grid">
        {Object.entries(routine).map(([sectionKey, ideaIds]) => {
          const section = sectionKey as RoutineSection
          const label = routineSectionLabels[section]
          return (
            <div key={section} className="routine-card">
              <h3>{label}</h3>
              {ideaIds.length === 0 ? (
                <p className="empty-text">Add an idea to this section.</p>
              ) : (
                <ul>
                  {ideaIds.map((ideaId: string) => {
                    const idea = ideas.find((item) => item.id === ideaId)
                    return (
                      <li key={ideaId} className="routine-item">
                        <span>{idea?.title ?? 'Saved activity'}</span>
                        <button
                          type="button"
                          className="inline-button"
                          onClick={() => onRemove(section, ideaId)}
                        >
                          Remove
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
      <button type="button" className="primary-button" onClick={() => window.print()}>
        Print routine view
      </button>
    </section>
  )
}
