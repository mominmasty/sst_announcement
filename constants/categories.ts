export const CATEGORIES = [
  'college',
  'tech',
  'tech-events',
  'tech-workshops',
  'academic',
  'sports',
  'other'
] as const

export type Category = typeof CATEGORIES[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  'college': 'College',
  'tech': 'Tech',
  'tech-events': 'Tech Events',
  'tech-workshops': 'Tech Workshops',
  'academic': 'Academic',
  'sports': 'Sports',
  'other': 'Other'
}

export const CATEGORY_OPTIONS = CATEGORIES.map(category => ({
  value: category,
  label: CATEGORY_LABELS[category]
}))