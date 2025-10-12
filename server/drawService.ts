import type { DrawAssignment } from './types.js'

export class DrawService {
  static generateLoginCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  static performDraw(participants: any[]): DrawAssignment[] {
    if (participants.length < 2) {
      throw new Error('Il faut au moins 2 participants pour effectuer un tirage')
    }

    const availableReceivers = [...participants]
    const shuffledGivers = [...participants].sort(() => Math.random() - 0.5)
    const assignments: DrawAssignment[] = []

    for (const giver of shuffledGivers) {
      const possibleReceivers = availableReceivers.filter(receiver => {
        if (receiver.id === giver.id) return false

        const isExcluded =
          giver.exclusions?.some((excl: any) => excl.excludedId === receiver.id) ||
          giver.excluded?.some((excl: any) => excl.participantId === receiver.id)

        return !isExcluded
      })

      if (possibleReceivers.length === 0) {
        console.log('⚠️ Conflit détecté, nouveau tirage...')
        return this.performDraw(participants)
      }

      const randomIndex = Math.floor(Math.random() * possibleReceivers.length)
      const receiver = possibleReceivers[randomIndex]

      assignments.push({ giverId: giver.id, receiverId: receiver.id })

      const receiverIndex = availableReceivers.findIndex(p => p.id === receiver.id)
      availableReceivers.splice(receiverIndex, 1)
    }

    return assignments
  }

  static validateDrawPossibility(participants: any[]): boolean {
    return participants.length >= 2 && participants.every(giver => {
      const possibleReceivers = participants.filter(receiver => {
        if (receiver.id === giver.id) return false
        const isExcluded =
          giver.exclusions?.some((excl: any) => excl.excludedId === receiver.id) ||
          giver.excluded?.some((excl: any) => excl.participantId === receiver.id)
        return !isExcluded
      })
      return possibleReceivers.length > 0
    })
  }
}
