import { gql } from '@apollo/client/core/index.js';

const REGISTER_MUTATION = gql`
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
}`;
const LOGIN_MUTATION = gql`
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
}`;
const CREATE_LOTTERY_MUTATION = gql`
mutation CreateLottery($name: String!, $year: Int!) {
  createLottery(name: $name, year: $year) {
    id
    name
    year
  }
}`;
const DELETE_LOTTERY_MUTATION = gql`
mutation DeleteLottery($lotteryId: ID!) {
  deleteLottery(lotteryId: $lotteryId)
}`;
const ADD_PARTICIPANT_MUTATION = gql`
mutation AddParticipant($lotteryId: ID!, $name: String!, $email: String, $isActive: Boolean!) {
  addParticipant(lotteryId: $lotteryId, name: $name, email: $email, isActive: $isActive) {
    id
    name
    email
    isActive
  }
}`;
const ADD_EXCLUSION_MUTATION = gql`
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
}`;
const DELETE_EXCLUSION_MUTATION = gql`
mutation DeleteExclusion($exclusionId: ID!) {
  deleteExclusion(exclusionId: $exclusionId)
}`;
const PERFORM_DRAW_MUTATION = gql`
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
}`;
const SEND_DRAW_RESULTS_MUTATION = gql`
mutation SendDrawResults($lotteryId: ID!) {
  sendDrawResults(lotteryId: $lotteryId) {
    sent
    errors
    success
  }
}`;
const ME_QUERY = gql`
  query me {
    me {
      id
      email
      name
    }
  }
`;
const MY_LOTERIES_QUERY = gql`
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
`;
const MY_OWNED_LOTTERIES_QUERY = gql`
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
`;
const ADD_GIFT_IDEA_MUTATION = gql`
  mutation AddGiftIdea($participantId: ID!, $title: String!, $description: String, $link: String) {
    addGiftIdea(participantId: $participantId, title: $title, description: $description, link: $link) {
      id
      title
      description
      link
    }
  }
`;
const DELETE_GIFT_IDEA_MUTATION = gql`
  mutation DeleteGiftIdea($giftIdeaId: ID!) {
    deleteGiftIdea(giftIdeaId: $giftIdeaId)
  }
`;

export { ADD_PARTICIPANT_MUTATION as A, CREATE_LOTTERY_MUTATION as C, DELETE_EXCLUSION_MUTATION as D, LOGIN_MUTATION as L, MY_OWNED_LOTTERIES_QUERY as M, PERFORM_DRAW_MUTATION as P, REGISTER_MUTATION as R, SEND_DRAW_RESULTS_MUTATION as S, ADD_EXCLUSION_MUTATION as a, DELETE_LOTTERY_MUTATION as b, ME_QUERY as c, MY_LOTERIES_QUERY as d, ADD_GIFT_IDEA_MUTATION as e, DELETE_GIFT_IDEA_MUTATION as f };
//# sourceMappingURL=queries-DeSTm1vV.mjs.map
