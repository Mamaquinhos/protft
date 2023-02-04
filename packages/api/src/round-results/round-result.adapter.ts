import { Round } from "../rounds/round.entity";
import { CreateLobbyGroupResults } from "./dto/create-lobby-group-result.args";
import { CreateLobbyResultArgs } from "./dto/create-lobby-result.args";
import { PlayerResults } from "./dto/get-results.out";
import { RoundResultsRaw } from "./dto/get-results.raw";
import { RoundResult } from "./round-result.entity";

export function fromRawToConsolidatedRoundResults(
  rawResults: RoundResultsRaw[],
): PlayerResults[] {
  const consolidatedResults: { [key: number]: PlayerResults } = {};
  rawResults.forEach(
    ({
      position,
      playerId,
      name,
      region,
      country,
      points,
      extraPoints,
      tiebreakerRanking,
      id,
      slug,
    }) => {
      if (!consolidatedResults[playerId]) {
        consolidatedResults[playerId] = {
          player: {
            id: playerId,
            name,
            region,
            country,
            slug,
          },
          tiebreakerRanking,
          positions: [],
          points: [extraPoints],
          lobbyPlayerId: id,
        };
      }
      if (position && points) {
        consolidatedResults[playerId].positions.push(position);
        consolidatedResults[playerId].points.push(points);
      }
    },
  );
  return Object.values(consolidatedResults);
}

export function formatResults({
  players,
  lobbyId,
}: CreateLobbyResultArgs): RoundResult[] {
  return players.reduce((prev, { playerId, positions }) => {
    return [
      ...prev,
      ...positions.reduce((prev, { roundId, position }) => {
        return [
          ...prev,
          {
            lobbyId,
            playerId,
            position,
            roundId,
          },
        ];
      }, []),
    ];
  }, []);
}

export function formatLobbyGroupResults(
  results: CreateLobbyGroupResults[],
  roundsPlayed: number,
  sequence: number,
  rounds: Round[],
): RoundResult[] {
  const roundInitialIndex = sequence * roundsPlayed - (roundsPlayed - 1) - 1;
  const allRoundIds = rounds.map((r) => r.id);
  const roundsIds = allRoundIds.slice(
    roundInitialIndex,
    roundInitialIndex + roundsPlayed,
  );

  const result: RoundResult[] = results.reduce(
    (prev, { lobbyPlayerId, positions }) => [
      ...prev,
      ...positions.reduce(
        (prev, curr, index) => [
          ...prev,
          {
            lobbyPlayerId,
            position: curr,
            roundId: roundsIds[index],
          },
        ],
        [],
      ),
    ],
    [],
  );

  return result;
}
