const AVATARS = ['🧑‍🎄', '🦌', '⛄', '🧝', '🎅', '🤶', '🐧', '🧸', '🍪', '🐻‍❄️']

// Même nom = même avatar, à chaque affichage
export function avatarFor(name: string): string {
  let hash = 0
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % 1000003
  }
  return AVATARS[hash % AVATARS.length]
}
