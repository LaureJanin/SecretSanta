export function validateEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null
  return email.toLowerCase().trim() || null
}

export function compareEmails(email1: string | null | undefined, email2: string | null | undefined): boolean {
  const normalized1 = normalizeEmail(email1)
  const normalized2 = normalizeEmail(email2)
  
  if (!normalized1 || !normalized2) return false
  return normalized1 === normalized2
}

