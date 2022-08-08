import { gql } from "urql";
import {
  Lobby,
  LobbyInput,
  RoundInput,
  Stage,
  StageInput,
} from "../../graphql/schema";

export interface StagesQueryResult {
  stages: Stage[];
}

export interface LobbiesQueryResult {
  lobbies: Lobby[];
}

export interface PlayersQueryVariables {
  tournamentId?: number;
}

export const STAGES_QUERY = gql`
  query stages($tournamentId: Int!) {
    stages(tournamentId: $tournamentId) {
      id
      name
      lobbies {
        id
        name
        players {
          id
          name
          country
        }
      }
      rounds {
        id
        sequence
      }
    }
  }
`;

export interface CreateStageResult {
  createStage: { id: Pick<Stage, "id"> };
}

export type CreateStageVariables = Omit<StageInput, "lobbies"> & {
  tournamentId: number;
};

export const CREATE_STAGE_QUERY = gql`
  mutation createStage(
    $tournamentId: Float!
    $pointSchemaId: Float!
    $name: String!
    $sequence: Float!
    $isFinal: Boolean!
  ) {
    createStage(
      tournamentId: $tournamentId
      pointSchemaId: $pointSchemaId
      name: $name
      sequence: $sequence
      isFinal: $isFinal
    ) {
      id
    }
  }
`;

export const LOBBIES_QUERY = gql`
  query lobbies($stageId: Int!) {
    lobbies(stageId: $stageId) {
      id
      name
    }
  }
`;

export interface CreateLobbyResult {
  createLobby: { id: Pick<Lobby, "id"> };
}

export type CreateLobbyVariables = Omit<
  LobbyInput,
  "roundCount" | "rounds" | "players"
> & {
  stageId: number;
};

export const CREATE_LOBBY_QUERY = gql`
  mutation createLobby($stageId: Float!, $name: String!, $sequence: Float!) {
    createLobby(stageId: $stageId, name: $name, sequence: $sequence) {
      id
    }
  }
`;

export interface CreateRoundResult {
  createRound: { id: number };
}

export type CreateRoundVariables = RoundInput & {
  stageId: number;
};

export const CREATE_ROUND_QUERY = gql`
  mutation createRound($stageId: Float!, $sequence: Float!) {
    createRound(stageId: $stageId, sequence: $sequence) {
      id
    }
  }
`;
