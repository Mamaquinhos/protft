import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { BaseResolver } from "../lib/BaseResolver";
import { RoundResultsService } from "../round-results/round-results.service";
import { CreatePlayerArgs } from "./dto/create-player.args";
import { PlayerFilterMeta } from "./dto/get-player-filter-meta.out";
import { PlayerStats } from "./dto/get-player-stats.out";
import { GetPlayerArgs } from "./dto/get-players.args";
import { formatStats } from "./players.adapter";
import { Player } from "./player.entity";
import { PlayersService } from "./players.service";
import { Tournament } from "../tournaments/tournament.entity";

@Resolver(() => Player)
export class PlayersResolver extends BaseResolver {
  constructor(
    private playersService: PlayersService,
    private roundResultsService: RoundResultsService,
  ) {
    super();
  }

  @ResolveField(() => PlayerStats)
  async playerStats(
    @Parent() player: Player,
    @Args("setId", { type: () => Int, nullable: true }) setId?: number,
  ): Promise<PlayerStats> {
    const rawStats = await this.roundResultsService.findStatsByPlayer(
      player.id,
      setId,
    );
    return formatStats(rawStats);
  }

  @Query(() => [Tournament])
  async tournamentsPlayed(@Args("playerId", { type: () => Int }) id: number) {
    return this.playersService.findTournamentsPlayed(id);
  }

  @Query(() => [Player])
  async players(@Args() { region, country, take, skip }: GetPlayerArgs) {
    const filters = this.cleanGraphQLFilters({ region, country });
    return this.playersService.findAll(filters, { take, skip });
  }

  @Query(() => Player)
  async player(@Args("id", { type: () => Int }) id: number) {
    return this.playersService.findOne(id);
  }

  @Query(() => PlayerFilterMeta)
  async playerFilterMeta(): Promise<PlayerFilterMeta> {
    const [possibleCountries, possibleRegions] = await Promise.all([
      this.playersService.findUniqueCountries(),
      this.playersService.findUniqueRegions(),
    ]);
    return {
      possibleCountries,
      possibleRegions,
    };
  }

  @Mutation(() => Player)
  async createPlayer(@Args() { name, country, region }: CreatePlayerArgs) {
    const payload = { name, country, region };
    return this.playersService.createOne(payload);
  }
}
