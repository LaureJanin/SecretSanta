export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    name: String!
    createdAt: String!
    lotteries: [Lottery!]!
  }

  type Lottery {
    id: ID!
    name: String!
    year: Int!
    budget: Int
    inviteCode: String
    createdAt: String!
    owner: User!
    participants: [Participant!]!
    exclusions: [Exclusion!]!
    draws: [Draw!]!
  }

  type Participant {
    id: ID!
    name: String!
    email: String
    isActive: Boolean!
    giftIdeas: [GiftIdea!]!
    managedChildren: [Participant!]!
  }

  type GiftIdea {
    id: ID!
    title: String!
    description: String
    link: String
    imageUrl: String
    price: Int
    isPurchased: Boolean!
    createdAt: String!
  }

  type LotteryInvite {
    name: String!
    year: Int!
    budget: Int
    ownerName: String!
    participantCount: Int!
    drawDone: Boolean!
  }

  type Exclusion {
    id: ID!
    participant: Participant!
    excluded: Participant!
  }

  type Draw {
    id: ID!
    giver: Participant!
    receiver: Participant!
  }

  type EmailResult {
    sent: Int!
    errors: [String!]!
    success: Boolean!
  }

  type AuthResult {
    success: Boolean!
    user: User
    token: String
    error: String
  }

  type Query {
    # Queries sécurisées - nécessitent d'être authentifié
    me: User
    myLotteries: [Lottery!]!
    myOwnedLotteries: [Lottery!]!

    # Public : aperçu d'une loterie à partir de son lien d'invitation
    lotteryInvite(code: String!): LotteryInvite
  }

  type Mutation {
    # Authentification
    register(email: String!, name: String!, password: String!): AuthResult!
    login(email: String!, password: String!): AuthResult!
    requestPasswordReset(email: String!): Boolean!
    resetPassword(token: String!, password: String!): AuthResult!
    
    # Gestion des loteries (authentification requise)
    createLottery(name: String!, year: Int!, budget: Int): Lottery
    setLotteryBudget(lotteryId: ID!, budget: Int): Lottery
    generateInviteCode(lotteryId: ID!): String!
    joinLottery(code: String!): Lottery
    deleteLottery(lotteryId: ID!): Boolean
    
    # Gestion des participants (authentification requise + propriétaire)
    addParticipant(lotteryId: ID!, name: String!, email: String, isActive: Boolean!): Participant
    addExclusion(lotteryId: ID!, participantId: ID!, excludedId: ID!): Exclusion
    deleteExclusion(exclusionId: ID!): Boolean
    performDraw(lotteryId: ID!): [Draw!]!
    sendDrawResults(lotteryId: ID!): EmailResult!
    
    # Gestion des idées cadeaux
    addGiftIdea(participantId: ID!, title: String!, description: String, link: String, imageUrl: String, price: Int): GiftIdea
    setGiftIdeaPurchased(giftIdeaId: ID!, purchased: Boolean!): GiftIdea
    deleteGiftIdea(giftIdeaId: ID!): Boolean
  }
`
