/**
 * Check if an announcement has expired
 */
export const isAnnouncementExpired = (announcement: { expiry_date?: string | null }): boolean => {
  if (!announcement.expiry_date) return false
  
  const expiryDate = new Date(announcement.expiry_date)
  const now = new Date()
  
  return expiryDate < now
}

/**
 * Format a date string for HTML datetime-local input
 */
export const formatDateForInput = (dateString?: string | null): string => {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch (error) {
    return ''
  }
}