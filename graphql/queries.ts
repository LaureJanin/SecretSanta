import { gql } from '@apollo/client/core'

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

export const CREATE_LOTTERY_MUTATION = gql`
mutation CreateLottery($name: String!, $year: Int!, $budget: Int) {
  createLottery(name: $name, year: $year, budget: $budget) {
    id
    name
    year
    budget
  }
}`

export const DELETE_LOTTERY_MUTATION = gql`
mutation DeleteLottery($lotteryId: ID!) {
  deleteLottery(lotteryId: $lotteryId)
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
      budget
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
          imageUrl
          price
          isPurchased
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
            imageUrl
            price
            isPurchased
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
      budget
      inviteCode
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
          imageUrl
          price
          isPurchased
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
            imageUrl
            price
            isPurchased
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
            imageUrl
            price
            isPurchased
          }
        }
      }
    }
  }
`

export const ADD_GIFT_IDEA_MUTATION = gql`
  mutation AddGiftIdea($participantId: ID!, $title: String!, $description: String, $link: String, $imageUrl: String, $price: Int) {
    addGiftIdea(participantId: $participantId, title: $title, description: $description, link: $link, imageUrl: $imageUrl, price: $price) {
      id
      title
      description
      link
      imageUrl
      price
      isPurchased
    }
  }
`

export const DELETE_GIFT_IDEA_MUTATION = gql`
  mutation DeleteGiftIdea($giftIdeaId: ID!) {
    deleteGiftIdea(giftIdeaId: $giftIdeaId)
  }
`

export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      success
      user {
        id
        email
        name
      }
      token
      error
    }
  }
`

export const SET_LOTTERY_BUDGET_MUTATION = gql`
  mutation SetLotteryBudget($lotteryId: ID!, $budget: Int) {
    setLotteryBudget(lotteryId: $lotteryId, budget: $budget) {
      id
      budget
    }
  }
`

export const GENERATE_INVITE_CODE_MUTATION = gql`
  mutation GenerateInviteCode($lotteryId: ID!) {
    generateInviteCode(lotteryId: $lotteryId)
  }
`

export const LOTTERY_INVITE_QUERY = gql`
  query LotteryInvite($code: String!) {
    lotteryInvite(code: $code) {
      name
      year
      budget
      ownerName
      participantCount
      drawDone
    }
  }
`

export const JOIN_LOTTERY_MUTATION = gql`
  mutation JoinLottery($code: String!) {
    joinLottery(code: $code) {
      id
      name
    }
  }
`

export const SET_GIFT_IDEA_PURCHASED_MUTATION = gql`
  mutation SetGiftIdeaPurchased($giftIdeaId: ID!, $purchased: Boolean!) {
    setGiftIdeaPurchased(giftIdeaId: $giftIdeaId, purchased: $purchased) {
      id
      isPurchased
    }
  }
`
