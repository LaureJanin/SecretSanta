import type { DrawAssignment } from './types.js'

export class DrawService {

  static performDraw(participants: any[]): DrawAssignment[] {
    if (participants.length < 2) {
      throw new Error('Il faut au moins 2 participants pour effectuer un tirage')
    }

    console.log('🎲 Début du tirage')
    console.log(`📊 Nombre de participants: ${participants.length}`)
    participants.forEach(p => {
      console.log(`   - ${p.name} (id: ${p.id})`)
      const exclusionsList = p.exclusions?.map((e: any) => {
        const excluded = participants.find((x: any) => x.id === e.excludedId)
        return excluded?.name || 'inconnu'
      }) || []
      const excludedByList = p.excluded?.map((e: any) => {
        const excluder = participants.find((x: any) => x.id === e.participantId)
        return excluder?.name || 'inconnu'
      }) || []

      if (exclusionsList.length > 0) {
        console.log(`     Ne peut pas tirer: ${exclusionsList.join(', ')}`)
      }
      if (excludedByList.length > 0) {
        console.log(`     Ne peut pas être tiré par: ${excludedByList.join(', ')}`)
      }
    })

    // Vérifier d'abord si un tirage est possible
    if (!this.validateDrawPossibility(participants)) {
      throw new Error('Impossible d\'effectuer le tirage avec les exclusions actuelles')
    }

    // Utiliser un algorithme de backtracking pour trouver une solution
    const solution = this.findValidAssignment(participants)

    if (!solution) {
      throw new Error('Aucune solution trouvée malgré la validation. Vérifiez les exclusions.')
    }

    console.log('✅ Tirage réussi :')
    solution.forEach(assignment => {
      const giver = participants.find((p: any) => p.id === assignment.giverId)
      const receiver = participants.find((p: any) => p.id === assignment.receiverId)
      console.log(`   ${giver?.name} → ${receiver?.name}`)
    })

    return solution
  }

  /**
   * Algorithme de backtracking pour trouver une assignation valide
   */
  private static findValidAssignment(participants: any[]): DrawAssignment[] | null {
    // Tenter plusieurs fois avec différents ordres si nécessaire
    for (let attempt = 0; attempt < 1000; attempt++) {
      // Mélanger l'ordre des donneurs pour CHAQUE tentative (important !)
      const shuffledGivers = [...participants].sort(() => Math.random() - 0.5)

      const n = shuffledGivers.length
      const assignments: DrawAssignment[] = []
      const usedReceivers = new Set<string>()

      // Fonction récursive de backtracking
      const backtrack = (giverIndex: number): boolean => {
        // Tous les donneurs ont été assignés avec succès
        if (giverIndex === n) {
          return true
        }

        const giver = shuffledGivers[giverIndex]

        // Mélanger les receveurs à chaque appel pour plus de variété
        const shuffledReceivers = [...participants].sort(() => Math.random() - 0.5)

        // Essayer chaque receveur possible (dans un ordre mélangé à chaque fois)
        for (const receiver of shuffledReceivers) {
          // Vérifier si ce receveur est valide
          if (usedReceivers.has(receiver.id)) continue // Déjà reçu un cadeau
          if (receiver.id === giver.id) continue // Ne peut pas se donner à soi-même

          // Vérifier les exclusions
          const isExcluded =
            giver.exclusions?.some((excl: any) => excl.excludedId === receiver.id) ||
            giver.excluded?.some((excl: any) => excl.participantId === receiver.id)

          if (isExcluded) continue

          // Essayer cette assignation
          assignments.push({ giverId: giver.id, receiverId: receiver.id })
          usedReceivers.add(receiver.id)

          // Continuer avec le prochain donneur
          if (backtrack(giverIndex + 1)) {
            return true // Solution trouvée !
          }

          // Backtrack : annuler cette assignation
          assignments.pop()
          usedReceivers.delete(receiver.id)
        }

        // Aucune assignation valide pour ce donneur
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

  static validateDrawPossibility(participants: any[]): boolean {
    if (participants.length < 2) return false

    // Vérification : chaque participant doit pouvoir donner à au moins une personne
    const basicCheck = participants.every(giver => {
      const possibleReceivers = participants.filter(receiver => {
        if (receiver.id === giver.id) return false
        const isExcluded =
          giver.exclusions?.some((excl: any) => excl.excludedId === receiver.id) ||
          giver.excluded?.some((excl: any) => excl.participantId === receiver.id)
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

