export type ChildProfile = 'Sylvie' | 'Elias' | 'Both'

export type Category =
  | 'Sensory Diet'
  | 'Outdoor'
  | 'Routine'
  | 'Co-play'
  | 'Calm Down'
  | 'Transition Help'
  | 'Heavy Work'
  | 'Bedtime'
  | 'Speech/Communication'
  | 'Fine Motor'
  | 'Imaginative Play'

export type SensorySystem =
  | 'Vestibular'
  | 'Proprioceptive'
  | 'Oral Motor'
  | 'Tactile'
  | 'Visual'
  | 'Auditory'
  | 'Regulation'
  | 'None'

export type LocationTag = 'Indoor' | 'Outdoor' | 'Either'
export type EffortLevel = 'Low' | 'Medium' | 'High'
export type EnergyLevel = 'Low' | 'Medium' | 'High'

export type TimeOfDayLabel =
  | 'Morning'
  | 'After preschool'
  | 'Before dinner'
  | 'Bath / bedtime'
  | 'Any time'

export type RoutineSection = 'morning' | 'afterPreschool' | 'beforeDinner' | 'bedtime'

export interface Idea {
  id: string
  title: string
  childProfiles: ChildProfile[]
  category: Category
  sensorySystem: SensorySystem
  location: LocationTag
  durationMinutes: number
  effortLevel: EffortLevel
  energyLevel: EnergyLevel
  bestTime: TimeOfDayLabel
  materials: string[]
  safetyNotes: string
  steps: string[]
  why: string
}

export interface IdeaFilters {
  search: string
  category: Category | 'All'
  childProfile: ChildProfile | 'Both'
  quickOnly: boolean
  fiveMinutes: boolean
  lowEffort: boolean
  highEnergy: boolean
  calmNow: boolean
}

export interface RoutinePlan {
  morning: string[]
  afterPreschool: string[]
  beforeDinner: string[]
  bedtime: string[]
}
