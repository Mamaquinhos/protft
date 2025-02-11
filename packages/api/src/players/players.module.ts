import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LobbyPlayerInfosModule } from "../lobby-player-infos/lobby-player-infos.module";
import { RoundResultsModule } from "../round-results/round-results.module";
import { StagePlayerInfosModule } from "../stage-player-infos/stage-player-infos.module";
import { TournamentResultsModule } from "../tournament-results/tournament-results.module";
import { TournamentsModule } from "../tournaments/tournaments.module";
import { Player } from "./player.entity";
import { PlayersController } from "./players.controller";
import { PlayersResolver } from "./players.resolver";
import { PlayersService } from "./players.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]),
    RoundResultsModule,
    TournamentResultsModule,
    TournamentsModule,
    StagePlayerInfosModule,
    LobbyPlayerInfosModule,
  ],
  providers: [PlayersService, PlayersResolver],
  exports: [PlayersService],
  controllers: [PlayersController],
})
export class PlayersModule {}
