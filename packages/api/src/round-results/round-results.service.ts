import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { StagesService } from "../stages/stages.service";
import { PlayersStatsRaw, PlayerStatsRaw } from "./dto/get-player-stats.raw";
import { RoundResultsRaw } from "./dto/get-results.raw";
import { GetStatsArgs } from "./dto/get-stats.args";
import { RoundResult } from "./round-result.entity";
import { LobbyPlayerInfosService } from "../lobby-player-infos/lobby-player-infos.service";
import {
  addPastPoints,
  formatLobbyGroupResults,
  fromRawToConsolidatedRoundResults,
} from "./round-result.adapter";
import { SortingMethods, sortResults } from "./round-result.logic";
import { PlayerWithStats } from "../players/dto/get-player-stats.out";
import { formatStats } from "../players/players.adapter";
import { CreateLobbyGroupResultArgs } from "./dto/create-lobby-group-result.args";
import { LobbiesService } from "../lobbies/lobbies.service";
import { parseFileString } from "../lib/FileParser";
import {
  buildResults,
  createRoundResultEntries,
  extractLobbyPlayerEntries,
} from "./bulk-creation.logic";

interface FileLineWithPlayerLobby {
  lobbyPlayerId: number;
  roundId: number;
  position: number;
}

@Injectable()
export class RoundResultsService {
  constructor(
    @InjectRepository(RoundResult)
    private roundResultsRepository: Repository<RoundResult>,
    private stagesService: StagesService,
    private lobbyPlayerInfosService: LobbyPlayerInfosService,
    private lobbiesService: LobbiesService,
  ) {}

  public async createResults({
    lobbyGroupId,
    results,
  }: CreateLobbyGroupResultArgs): Promise<RoundResult[]> {
    const { roundsPlayed, sequence, stageId } =
      await this.lobbiesService.findOneLobbyGroup(lobbyGroupId);
    const { rounds } = await this.stagesService.findOne(stageId, ["rounds"]);
    const positionInputs = formatLobbyGroupResults(
      results,
      roundsPlayed,
      sequence,
      rounds,
    );
    return this.roundResultsRepository.save(positionInputs);
  }

  public async createBulk(
    fileString: string,
    stageId: number,
  ): Promise<RoundResult[]> {
    const { titles, lines } = parseFileString(fileString);
    const [player, position] = titles;
    if (player !== "Player" || position !== "Position") {
      throw new BadRequestException(`${player} - ${position}`);
    }
    const {
      players: allStagePlayers,
      rounds: allStageRounds,
      lobbies: allStageLobbies,
      lobbyGroups: allStageLobbyGroups,
    } = await this.stagesService.findOne(stageId, [
      "players",
      "players.player",
      "rounds",
      "lobbies",
      "lobbyGroups",
    ]);

    if (lines.length % allStagePlayers.length !== 0) {
      throw new BadRequestException(
        "Number of lines does not match number of stage players",
      );
    }

    if (lines.length / allStagePlayers.length !== allStageLobbyGroups.length) {
      throw new BadRequestException(
        "Number of lines does not match number of lobby groups",
      );
    }

    const resultEntries = buildResults(
      lines,
      allStagePlayers,
      allStageLobbyGroups,
      allStageRounds,
      allStageLobbies,
    );

    const lobbyPlayerEntries = extractLobbyPlayerEntries(resultEntries);

    const lobbyPlayers =
      await this.lobbyPlayerInfosService.createManyLobbyPlayers(
        lobbyPlayerEntries,
      );

    const finalPayload: FileLineWithPlayerLobby[] = createRoundResultEntries(
      resultEntries,
      lobbyPlayers,
    );

    const results = this.roundResultsRepository.save(finalPayload);

    return results;
  }

  public async resultsByStage(stageId: number) {
    const { tiebreakers, tournamentId, sequence } =
      await this.stagesService.findOne(stageId);
    const results = await this.findResultsByStage(stageId);
    const formattedResults = fromRawToConsolidatedRoundResults(results);
    if (tiebreakers?.includes(SortingMethods.TOTAL_EVENT_POINTS)) {
      const allTournamentStages = await this.stagesService.findAllByTournament(
        tournamentId,
      );
      const previousStages = allTournamentStages.filter(
        (s) => s.sequence < sequence,
      );
      if (previousStages.length) {
        const previousStagesResult = await Promise.all(
          previousStages.map((stage) => this.findResultsByStage(stage.id)),
        );
        const resultsWithPast = addPastPoints(
          formattedResults,
          previousStagesResult,
        );
        return sortResults(resultsWithPast, tiebreakers);
      }
    }
    return sortResults(formattedResults, tiebreakers);
  }

  private findResultsByStage(stageId: number): Promise<RoundResultsRaw[]> {
    return this.roundResultsRepository.manager
      .createQueryBuilder()
      .select(
        "result.roundId, result.position, lpi.id, lpi.playerId, round.sequence, player.name, player.region, player.country, player.slug, points.points",
      )
      .from("lobby_player_info", "lpi")
      .innerJoin("lobby", "lobby", "lobby.id = lpi.lobbyId")
      .innerJoin("stage", "stage", "stage.id = lobby.stageId")
      .innerJoin("player", "player", "player.id = lpi.playerId")
      .leftJoin("round_result", "result", "lpi.id = result.lobbyPlayerId")
      .leftJoin(
        "points",
        "points",
        "points.pointSchemaId = stage.pointSchemaId and points.position = result.position",
      )
      .leftJoin("round", "round", "round.id = result.roundId")
      .orderBy("lpi.id, round.sequence")
      .leftJoin(
        "stage_player_info",
        "spi",
        "spi.stageId = stage.id and spi.playerId = player.id",
      )
      .addSelect("COALESCE(spi.extraPoints, 0)", "extraPoints")
      .addSelect("COALESCE(spi.tiebreakerRanking, 0)", "tiebreakerRanking")
      .where("stage.id = :stageId", { stageId })
      .getRawMany();
  }

  public async resultsByLobbyGroup(lobbyGroupId: number) {
    const results = await this.findResultsByLobbyGroup(lobbyGroupId);
    return fromRawToConsolidatedRoundResults(results);
  }

  private findResultsByLobbyGroup(
    lobbyGroupId: number,
  ): Promise<RoundResultsRaw[]> {
    return this.roundResultsRepository.manager
      .createQueryBuilder()
      .select(
        "result.roundId, result.position, lpi.id, lpi.playerId, round.sequence, player.name, player.region, player.country, points.points",
      )
      .from("lobby_player_info", "lpi")
      .innerJoin("lobby", "lobby", "lobby.id = lpi.lobbyId")
      .innerJoin("stage", "stage", "stage.id = lobby.stageId")
      .innerJoin("player", "player", "player.id = lpi.playerId")
      .leftJoin("round_result", "result", "lpi.id = result.lobbyPlayerId")
      .leftJoin(
        "points",
        "points",
        "points.pointSchemaId = stage.pointSchemaId and points.position = result.position",
      )
      .leftJoin("round", "round", "round.id = result.roundId")
      .orderBy("lpi.id, round.sequence")
      .leftJoin(
        "stage_player_info",
        "spi",
        "spi.stageId = stage.id and spi.playerId = player.id",
      )
      .addSelect("COALESCE(spi.extraPoints, 0)", "extraPoints")
      .addSelect("COALESCE(spi.tiebreakerRanking, 0)", "tiebreakerRanking")
      .where("lobby.lobbyGroupId = :lobbyGroupId", { lobbyGroupId })
      .getRawMany();
  }

  public async playerStats(args: GetStatsArgs) {
    const stats = await this.findStats(args);
    const formatted: PlayerWithStats[] = stats.map(
      ({ id, name, region, country, slug, ...stats }) => ({
        player: {
          id,
          name,
          region,
          country,
          slug,
        },
        ...formatStats(stats),
      }),
    );
    return formatted;
  }

  private findStats({
    setId,
    skip,
    take = 10,
    region,
    tournamentIds,
    sort,
  }: Partial<GetStatsArgs>): Promise<PlayersStatsRaw[]> {
    return this.roundResultsRepository.manager
      .createQueryBuilder()
      .select("*")
      .from((subquery) => {
        return subquery
          .select('"totalGames"')
          .addSelect('"averagePosition"')
          .addSelect('"topFourCount" / "totalGames"', "topFourPercent")
          .addSelect('"topOneCount" / "totalGames"', "topOnePercent")
          .addSelect('"eigthCount" / "totalGames"', "eigthPercent")
          .addSelect("id")
          .addSelect("name")
          .addSelect("region")
          .addSelect("country")
          .addSelect("slug")
          .from((rawSubquery) => {
            const baseQuery = this.getBaseStatsQuery(rawSubquery);
            let query = baseQuery
              .addSelect("player.*")
              .from("round_result", "result")
              .innerJoin(
                "lobby_player_info",
                "lpi",
                "lpi.id = result.lobbyPlayerId",
              )
              .innerJoin("player", "player", "player.id = lpi.playerId")
              .innerJoin("lobby", "l", "l.id = lpi.lobbyId")
              .innerJoin("stage", "s", "s.id = l.stageId")
              .innerJoin("tournament", "t", "t.id = s.tournamentId")
              .groupBy("player.id");

            if (region) {
              query = query.andWhere("player.region = :region", { region });
            }

            if (setId) {
              query = query.andWhere("t.setId = :setId", { setId });
            }

            if (tournamentIds && tournamentIds.length) {
              query = query.andWhere("t.id IN (:...tournamentIds)", {
                tournamentIds,
              });
            }

            return query;
          }, "rawStats");
      }, "stats")
      .where('stats."totalGames" > 0')
      .orderBy(
        sort
          ? { [`stats.\"${sort.column}\"`]: sort.asc ? "ASC" : "DESC" }
          : { [`stats.\"averagePosition\"`]: "ASC" },
      )
      .take(take)
      .skip(skip)
      .getRawMany<PlayersStatsRaw>();
  }

  public findStatsByPlayer(
    playerId: number,
    setId?: number,
    tournamentId?: number,
  ): Promise<PlayerStatsRaw> {
    const queryBuilder =
      this.roundResultsRepository.manager.createQueryBuilder();
    // add subquery here to get the / total games values
    return queryBuilder
      .select('"totalGames"')
      .addSelect('"averagePosition"')
      .addSelect('"topFourCount" / "totalGames"', "topFourPercent")
      .addSelect('"topOneCount" / "totalGames"', "topOnePercent")
      .addSelect('"eigthCount" / "totalGames"', "eigthPercent")
      .addSelect("id")
      .addSelect("name")
      .addSelect("region")
      .addSelect("country")
      .from((qb) => {
        let query = this.getBaseStatsQuery(qb)
          .addSelect("player.*")
          .from("round_result", "result")
          .innerJoin(
            "lobby_player_info",
            "lpi",
            "lpi.id = result.lobbyPlayerId",
          )
          .innerJoin("player", "player", "player.id = lpi.playerId")
          .innerJoin("lobby", "lobby", "lobby.id = lpi.lobbyId")
          .innerJoin("stage", "stage", "stage.id = lobby.stageId")
          .innerJoin(
            "tournament",
            "tournament",
            "tournament.id = stage.tournamentId",
          )
          .groupBy("player.id")
          .where("lpi.playerId = :playerId", { playerId });

        if (setId) {
          query = query.andWhere("tournament.setId = :setId", { setId });
        }

        if (tournamentId) {
          query = query.andWhere("tournament.id = :tournamentId", {
            tournamentId,
          });
        }

        return query;
      }, "rawStats")
      .getRawOne();
  }

  private getBaseStatsQuery(
    queryBuilder: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    return queryBuilder
      .select(`CAST(COUNT(*) as decimal)`, "totalGames")
      .addSelect(
        `CAST(COALESCE(AVG(position),0) as decimal)`,
        "averagePosition",
      )
      .addSelect(
        `CAST(COALESCE(SUM(CASE WHEN position <= 4 THEN 1 ELSE 0 END),0) as decimal)`,
        "topFourCount",
      )
      .addSelect(
        `CAST(COALESCE(SUM(CASE WHEN position = 1 THEN 1 ELSE 0 END),0) as decimal)`,
        "topOneCount",
      )
      .addSelect(
        `CAST(COALESCE(SUM(CASE WHEN position = 8 THEN 1 ELSE 0 END),0) as decimal)`,
        "eigthCount",
      );
  }
}
