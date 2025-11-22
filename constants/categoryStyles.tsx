export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'college':
      return 'from-blue-500 to-cyan-500'
    case 'tech':
    case 'tech-events':
    case 'tech-workshops':
      return 'from-purple-500 to-pink-500'
    case 'academic':
      return 'from-green-500 to-emerald-500'
    case 'sports':
      return 'from-orange-500 to-red-500'
    case 'other':
    default:
      return 'from-gray-500 to-slate-500'
  }
}

export const getCategoryAccentClasses = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'college':
      return 'hover:shadow-blue-500/30'
    case 'tech':
    case 'tech-events':
    case 'tech-workshops':
      return 'hover:shadow-purple-500/30'
    case 'academic':
      return 'hover:shadow-green-500/30'
    case 'sports':
      return 'hover:shadow-orange-500/30'
    case 'other':
    default:
      return 'hover:shadow-gray-500/30'
  }
}

export const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'college':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      )
    case 'tech':
    case 'tech-events':
    case 'tech-workshops':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      )
    case 'academic':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      )
    case 'sports':
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      )
    case 'other':
    default:
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h8M5 6a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2H5z" />
      )
  }
}

