import type { DrawAssignment } from './types.js'
import type { ParticipantWithExclusions } from '../types/index.js'

export class DrawService {

  static performDraw(participants: ParticipantWithExclusions[]): DrawAssignment[] {
    if (participants.length < 2) {
      throw new Error('Il faut au moins 2 participants pour effectuer un tirage')
    }

    console.log('🎲 Début du tirage')
    console.log(`📊 Nombre de participants: ${participants.length}`)
    participants.forEach(p => {
      console.log(`   - ${p.name} (id: ${p.id})`)
      const exclusionsList = p.exclusions?.map((e) => {
        const excluded = participants.find((x) => x.id === e.excludedId)
        return excluded?.name || 'inconnu'
      }) || []
      const excludedByList = p.excluded?.map((e) => {
        const excluder = participants.find((x) => x.id === e.participantId)
        return excluder?.name || 'inconnu'
      }) || []

      if (exclusionsList.length > 0) {
        console.log(`     Ne peut pas tirer: ${exclusionsList.join(', ')}`)
      }
      if (excludedByList.length > 0) {
        console.log(`     Ne peut pas être tiré par: ${excludedByList.join(', ')}`)
      }
    })

    if (!this.validateDrawPossibility(participants)) {
      throw new Error('Impossible d\'effectuer le tirage avec les exclusions actuelles')
    }

    const solution = this.findValidAssignment(participants)

    if (!solution) {
      throw new Error('Aucune solution trouvée malgré la validation. Vérifiez les exclusions.')
    }

    console.log('✅ Tirage réussi :')
    solution.forEach(assignment => {
      const giver = participants.find((p) => p.id === assignment.giverId)
      const receiver = participants.find((p) => p.id === assignment.receiverId)
      console.log(`   ${giver?.name} → ${receiver?.name}`)
    })

    return solution
  }

  private static findValidAssignment(participants: ParticipantWithExclusions[]): DrawAssignment[] | null {
    for (let attempt = 0; attempt < 1000; attempt++) {
      const shuffledGivers = [...participants].sort(() => Math.random() - 0.5)

      const n = shuffledGivers.length
      const assignments: DrawAssignment[] = []
      const usedReceivers = new Set<string>()

      const backtrack = (giverIndex: number): boolean => {
        if (giverIndex === n) {
          return true
        }

        const giver = shuffledGivers[giverIndex]

        const shuffledReceivers = [...participants].sort(() => Math.random() - 0.5)

        for (const receiver of shuffledReceivers) {
          if (usedReceivers.has(receiver.id)) continue
          if (receiver.id === giver.id) continue

          const isExcluded =
            giver.exclusions?.some((excl) => excl.excludedId === receiver.id) ||
            giver.excluded?.some((excl) => excl.participantId === receiver.id)

          if (isExcluded) continue

          assignments.push({ giverId: giver.id, receiverId: receiver.id })
          usedReceivers.add(receiver.id)

          if (backtrack(giverIndex + 1)) {
            return true
          }

          assignments.pop()
          usedReceivers.delete(receiver.id)
        }

        return false
      }

      if (backtrack(0)) {
        if (attempt > 0) {
          console.log(`✅ Solution trouvée à la tentative ${attempt + 1}`)
        }
        return assignments
      }
    }

    console.log(`❌ Aucune solution trouvée après 1000 tentatives`)
    return null
  }

  static validateDrawPossibility(participants: ParticipantWithExclusions[]): boolean {
    if (participants.length < 2) return false

    const basicCheck = participants.every(giver => {
      const possibleReceivers = participants.filter(receiver => {
        if (receiver.id === giver.id) return false
        const isExcluded =
          giver.exclusions?.some((excl) => excl.excludedId === receiver.id) ||
          giver.excluded?.some((excl) => excl.participantId === receiver.id)
        return !isExcluded
      })
      return possibleReceivers.length > 0
    })

    if (!basicCheck) {
      console.log('❌ Validation échouée : au moins un participant ne peut donner à personne')
      return false
    }


    return true
  }
}

