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
    loginCode: String
    isActive: Boolean!
    giftIdeas: [GiftIdea!]!
    managedChildren: [Participant!]!
  }

  type GiftIdea {
    id: ID!
    title: String!
    description: String
    link: String
    createdAt: String!
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
    myLottery(id: ID!): Lottery
    
    # Queries publiques
    participantByLoginCode(loginCode: String!): Participant
  }

  type Mutation {
    # Authentification
    register(email: String!, name: String!, password: String!): AuthResult!
    login(email: String!, password: String!): AuthResult!
    
    # Gestion des loteries (authentification requise)
    createLottery(name: String!, year: Int!): Lottery
    
    # Gestion des participants (authentification requise + propriétaire)
    addParticipant(lotteryId: ID!, name: String!, email: String, isActive: Boolean!): Participant
    addExclusion(lotteryId: ID!, participantId: ID!, excludedId: ID!): Exclusion
    performDraw(lotteryId: ID!): [Draw!]!
    sendLoginCodes(lotteryId: ID!): EmailResult!
    sendDrawResults(lotteryId: ID!): EmailResult!
    
    # Gestion des idées cadeaux (public avec loginCode)
    addGiftIdea(participantId: ID!, title: String!, description: String, link: String): GiftIdea
    
    # Test email (authentification requise)
    testGmailDirect: EmailResult!
  }
`
