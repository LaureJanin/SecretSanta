import { gql } from '@apollo/client/core'

// === AUTHENTIFICATION ===
export const REGISTER_MUTATION = gql`
mutation Register($email: String!, $name: String!, $password: String!) {
  register(email: $email, name: $name, password: $password) {
    success
    user {
      id
      email
      name
    }
    token
    error
  }
}`

export const LOGIN_MUTATION = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    success
    user {
      id
      email
      name
    }
    token
    error
  }
}`

// === LOTERIES ===
export const CREATE_LOTTERY_MUTATION = gql`
mutation CreateLottery($name: String!, $year: Int!) {
  createLottery(name: $name, year: $year) {
    id
    name
    year
  }
}`

export const ADD_PARTICIPANT_MUTATION = gql`
mutation AddParticipant($lotteryId: ID!, $name: String!, $email: String, $isActive: Boolean!) {
  addParticipant(lotteryId: $lotteryId, name: $name, email: $email, isActive: $isActive) {
    id
    name
    email
    isActive
  }
}`

export const ADD_EXCLUSION_MUTATION = gql`
mutation AddExclusion($lotteryId: ID!, $participantId: ID!, $excludedId: ID!) {
  addExclusion(lotteryId: $lotteryId, participantId: $participantId, excludedId: $excludedId) {
    id
    participant {
      id
      name
    }
    excluded {
      id
      name
    }
  }
}`

export const DELETE_EXCLUSION_MUTATION = gql`
mutation DeleteExclusion($exclusionId: ID!) {
  deleteExclusion(exclusionId: $exclusionId)
}`

export const PERFORM_DRAW_MUTATION = gql`
mutation PerformDraw($lotteryId: ID!) {
  performDraw(lotteryId: $lotteryId) {
    id
    giver {
      id
      name
    }
    receiver {
      id
      name
    }
  }
}`

export const SEND_DRAW_RESULTS_MUTATION = gql`
mutation SendDrawResults($lotteryId: ID!) {
  sendDrawResults(lotteryId: $lotteryId) {
    sent
    errors
    success
  }
}`

export const ME_QUERY = gql`
  query me {
    me {
      id
      email
      name
    }
  }
`

export const MY_LOTERIES_QUERY = gql`
  query myLotteries {
    myLotteries {
      id
      name
      year
      owner {
        id
        name
      }
      participants {
        id
        name
        email
        isActive
        giftIdeas {
          id
          title
          description
          link
        }
      }
      draws {
        id
        giver {
          id
          name
          email
        }
        receiver {
          id
          name
          email
          giftIdeas {
            id
            title
            description
            link
          }
        }
      }
    }
  }
`

export const MY_OWNED_LOTTERIES_QUERY = gql`
  query myOwnedLotteries {
    myOwnedLotteries {
      id
      name
      year
      owner {
        id
        name
      }
      participants {
        id
        name
        email
        isActive
        giftIdeas {
          id
          title
          description
          link
        }
      }
      exclusions {
        id
        participant {
          id
          name
        }
        excluded {
          id
          name
        }
      }
      draws {
        id
        giver {
          id
          name
          giftIdeas {
            id
            title
            description
            link
          }
        }
        receiver {
          id
          name
          giftIdeas {
            id
            title
            description
            link
          }
        }
      }
    }
  }
`

export const ADD_GIFT_IDEA_MUTATION = gql`
  mutation AddGiftIdea($participantId: ID!, $title: String!, $description: String, $link: String) {
    addGiftIdea(participantId: $participantId, title: $title, description: $description, link: $link) {
      id
      title
      description
      link
    }
  }
`

export const DELETE_GIFT_IDEA_MUTATION = gql`
  mutation DeleteGiftIdea($giftIdeaId: ID!) {
    deleteGiftIdea(giftIdeaId: $giftIdeaId)
  }
`
