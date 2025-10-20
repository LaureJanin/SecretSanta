export interface GiftIdea {
  id: string
  title: string
  description?: string
}

export interface Participant {
  id: string
  name: string
  giftIdeas: GiftIdea[]
}

export interface Draw {
  giver: Participant
  receiver: Participant
}

export interface Loterie {
  id: string
  name: string
  year: number
  participants: Participant[]
  draws?: Draw[]
}

