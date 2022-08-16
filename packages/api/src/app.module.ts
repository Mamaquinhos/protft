import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SetsModule } from "./sets/sets.module";
import { TournamentsModule } from "./tournaments/tournaments.module";
import { StagesModule } from "./stages/stages.module";
import { PointsModule } from "./points/points.module";
import { LobbiesModule } from "./lobbies/lobbies.module";
import { PlayersModule } from "./players/players.module";
import { join } from "path";
import { RoundsModule } from "./rounds/rounds.module";
import { RoundResultsModule } from "./round-results/round-results.module";
import { StagePlayerInfosModule } from "./stage-player-infos/stage-player-infos.module";

const localDatabaseInfo: TypeOrmModuleOptions = {
  host: "localhost",
  port: 5432,
  username: "root",
  password: "changeme",
  database: "mydb",
};

const prodDatabaseInfo: TypeOrmModuleOptions = {
  url: process.env.DATABASE_URL,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
};

const isProd = (): boolean => process.env.NODE_ENV === "production";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      ...(isProd() ? prodDatabaseInfo : localDatabaseInfo),
      autoLoadEntities: true,
      synchronize: !isProd(),
      logging: !isProd(),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      definitions: {
        path: join(process.cwd(), "src/graphql.ts"),
      },
      playground: !isProd(),
      introspection: true,
    }),
    SetsModule,
    TournamentsModule,
    StagesModule,
    LobbiesModule,
    PointsModule,
    PlayersModule,
    RoundsModule,
    RoundResultsModule,
    StagePlayerInfosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
