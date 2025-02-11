import { gql } from "urql";
import {
  CreateLobbyGroupResults,
  Player,
} from "../../../../../../graphql/schema";

export interface ResultsByLobbyGroupQueryVariables {
  lobbyGroupId: number;
}

export interface ResultsByLobbyGroupQueryResult {
  resultsByLobbyGroup: {
    player: Player;
    positions: number[];
    lobbyPlayerId: number;
  }[];
}

export const RESULTS_BY_LOBBY_GROUP_QUERY = gql`
  query results($lobbyGroupId: Int!) {
    resultsByLobbyGroup(lobbyGroupId: $lobbyGroupId) {
      player {
        id
        name
      }
      positions
      lobbyPlayerId
    }
  }
`;

export interface CreateResultsByLobbyGroupMutationVariables {
  lobbyGroupId: number;
  results: CreateLobbyGroupResults[];
}

export const CREATE_RESULTS_BY_LOBBY_GROUP_MUTATION = gql`
  mutation createResults(
    $lobbyGroupId: Int!
    $results: [CreateLobbyGroupResults!]!
  ) {
    createLobbyGroupResult(lobbyGroupId: $lobbyGroupId, results: $results) {
      roundId
    }
  }
`;
