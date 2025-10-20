import { gql } from '@apollo/client/core'

export const REGISTER_MUTATION = gql`
mutation Register($email: String!, $name: String!, $password: String!) {
  register(email: $email, name: $name, password: $password) {
    success
    token
    error
    user { id name email }
  }
}`

export const LOGIN_MUTATION = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    success
    token
    error
    user { id name email }
  }
}`

export const MES_LOTERIES_QUERY = gql`
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

