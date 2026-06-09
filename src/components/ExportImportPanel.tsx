import { useRef, useState, type ChangeEvent } from 'react'
import type { RoutinePlan } from '../types/idea'

interface ExportImportPanelProps {
  favorites: string[]
  recentIds: string[]
  routine: RoutinePlan
  onImport: (data: { favorites: string[]; recentIds: string[]; routine: RoutinePlan }) => void
}

export default function ExportImportPanel({ favorites, recentIds, routine, onImport }: ExportImportPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [message, setMessage] = useState<string>('')

  const handleExport = () => {
    const payload = {
      favorites,
      recentIds,
      routine,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sylvie-elias-ideas-backup.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as { favorites?: string[]; recentIds?: string[]; routine?: RoutinePlan }
      if (parsed.favorites && parsed.recentIds && parsed.routine) {
        onImport({ favorites: parsed.favorites, recentIds: parsed.recentIds, routine: parsed.routine })
        setMessage('Settings restored successfully.')
      } else {
        setMessage('That file does not have the right format.')
      }
    } catch {
      setMessage('Unable to read the file. Please try a valid JSON backup.')
    }
  }

  return (
    <section className="export-panel" aria-labelledby="export-title">
      <h2 id="export-title">Backup & restore</h2>
      <p className="section-copy">Save your favourites, recent ideas, and routine sections to a file.</p>

      <div className="export-actions">
        <button type="button" className="secondary-button" onClick={handleExport}>
          Export backup
        </button>
        <label className="file-button">
          Import backup
          <input ref={inputRef} type="file" accept="application/json" onChange={handleFileChange} />
        </label>
      </div>
      {message ? <p className="status-message" aria-live="polite">{message}</p> : null}
    </section>
  )
}
