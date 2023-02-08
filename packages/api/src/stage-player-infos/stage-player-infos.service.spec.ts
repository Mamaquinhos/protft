import { Repository } from "typeorm";
import { StagePlayerInfo } from "./stage-player-info.entity";
import { StagePlayerInfosService } from "./stage-player-infos.service";

describe("StagePlayerInfos service", () => {
  let service: StagePlayerInfosService;
  const databaseResult = [{ id: 1 }, { id: 2 }, { id: 3 }];
  let stagePlayerInfoRepository: Repository<StagePlayerInfo>;
  const mockStageId = 1;

  beforeEach(() => {
    stagePlayerInfoRepository = {
      find: jest.fn(),
      save: jest.fn(),
      manager: {
        createQueryBuilder: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(databaseResult),
      },
    } as unknown as Repository<StagePlayerInfo>;
    service = new StagePlayerInfosService(stagePlayerInfoRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("findAllByStage", () => {
    it("should call repository", async () => {
      await service.findAllByStage(mockStageId);
      expect(stagePlayerInfoRepository.find).toHaveBeenCalledWith({
        relations: ["player"],
        where: { stageId: mockStageId },
      });
    });
  });

  describe("createStagePlayer", () => {
    it("should call repository", async () => {
      const mockPlayerIds = [1, 2, 3];
      await service.createStagePlayers({
        stageId: mockStageId,
        playerIds: mockPlayerIds,
      });
      expect(stagePlayerInfoRepository.save).toHaveBeenCalledWith([
        {
          stageId: mockStageId,
          playerId: 1,
          extraPoints: 0,
          tiebreakerRanking: 0,
        },
        {
          stageId: mockStageId,
          playerId: 2,
          extraPoints: 0,
          tiebreakerRanking: 0,
        },
        {
          stageId: mockStageId,
          playerId: 3,
          extraPoints: 0,
          tiebreakerRanking: 0,
        },
      ]);
    });
  });

  describe("createStagePlayerByName", () => {
    it("should save three players if they are found on DB", async () => {
      const mockPlayerNames = `Ana
      Boris
      Camila`;
      await service.createStagePlayerByName({
        stageId: mockStageId,
        playerNames: mockPlayerNames,
      });
      expect(stagePlayerInfoRepository.save).toHaveBeenCalledWith([
        {
          stageId: mockStageId,
          playerId: 1,
          extraPoints: 0,
          tiebreakerRanking: 0,
        },
        {
          stageId: mockStageId,
          playerId: 2,
          extraPoints: 0,
          tiebreakerRanking: 0,
        },
        {
          stageId: mockStageId,
          playerId: 3,
          extraPoints: 0,
          tiebreakerRanking: 0,
        },
      ]);
    });

    it("should throw if cant find some player in DB", async () => {
      const mockPlayerNames = `Ana
        Boris
        Camila
        Denis`;
      expect(
        async () =>
          await service.createStagePlayerByName({
            stageId: mockStageId,
            playerNames: mockPlayerNames,
          }),
      ).rejects.toThrowError("Provided names: 4, names found: 3");
      expect(stagePlayerInfoRepository.save).not.toHaveBeenCalled();
    });
  });
});
