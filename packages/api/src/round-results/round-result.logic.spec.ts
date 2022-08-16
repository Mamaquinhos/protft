import { generatePlayer } from "../../test/data/result-tiebreakers";
import {
  sortByAveragePosition,
  sortByFirstPlaces,
  sortByLastRoundFirstPlace,
  sortByLastRoundPosition,
  sortByLessTopEigth,
  sortByPoints,
  sortByRecentHighestPlacement,
  sortByTopFour,
} from "./round-result.logic";

describe("Sorting with tie breakers", () => {
  describe("sort by points", () => {
    const playerTopEigth = generatePlayer([8, 8, 8, 8]);
    const playerTopOne = generatePlayer([1, 1, 1, 1]);

    it("should be negative if a has higher placement than b", () => {
      expect(sortByPoints(playerTopOne, playerTopEigth)).toBeLessThan(0);
    });
    it("should be positive if b has higher placement than a", () => {
      expect(sortByPoints(playerTopEigth, playerTopOne)).toBeGreaterThan(0);
    });
    it("should be zero if a = b", () => {
      expect(sortByPoints(playerTopOne, playerTopOne)).toBe(0);
    });
  });

  describe("sort by top four", () => {
    const playerWithThreeTopFours = generatePlayer([1, 2, 3, 5, 5]);
    const playerWithTwoTopFours = generatePlayer([1, 2, 5, 6, 7]);
    it("should be negative if a has higher placement than b", () => {
      expect(
        sortByTopFour(playerWithThreeTopFours, playerWithTwoTopFours),
      ).toBeLessThan(0);
    });
    it("should be positive if b has higher placement than a", () => {
      expect(
        sortByTopFour(playerWithTwoTopFours, playerWithThreeTopFours),
      ).toBeGreaterThan(0);
    });
    it("should be zero if a = b", () => {
      expect(
        sortByPoints(playerWithThreeTopFours, playerWithThreeTopFours),
      ).toBe(0);
    });
  });

  describe("sort by highest recent placement", () => {
    const playerWithEqualResults = generatePlayer([1, 1, 1]);
    const playerWithFirstInLastGame = generatePlayer([8, 8, 1]);
    const playerWithFirstInFirstGame = generatePlayer([1, 8, 8]);
    it("should be negative if a has higher placement than b", () => {
      expect(
        sortByRecentHighestPlacement(
          playerWithFirstInLastGame,
          playerWithFirstInFirstGame,
        ),
      ).toBeLessThan(0);
    });
    it("should be zero if a = b", () => {
      expect(
        sortByRecentHighestPlacement(
          playerWithEqualResults,
          playerWithEqualResults,
        ),
      ).toBe(0);
    });
    it("should be positive if b has higher placement than a", () => {
      expect(
        sortByRecentHighestPlacement(
          playerWithFirstInFirstGame,
          playerWithFirstInLastGame,
        ),
      ).toBeGreaterThan(0);
    });
  });

  describe("sort by average position", () => {
    const highAveragePlayer = generatePlayer([1, 2, 3, 4]);
    const highAvgInvertedPlayer = generatePlayer([4, 3, 2, 1]);
    const slightlyLowerAveragePlayer = generatePlayer([1, 2, 3, 5]);
    it("should be negative if a has higher placement than b", () => {
      expect(
        sortByAveragePosition(highAveragePlayer, slightlyLowerAveragePlayer),
      ).toBeLessThan(0);
    });
    it("should be zero if a = b", () => {
      expect(
        sortByAveragePosition(highAvgInvertedPlayer, highAveragePlayer),
      ).toBe(0);
    });
    it("should be positive if b has higher placement than a", () => {
      expect(
        sortByAveragePosition(slightlyLowerAveragePlayer, highAveragePlayer),
      ).toBeGreaterThan(0);
    });
  });

  describe("sort by less top eigth", () => {
    const oneTop8Player = generatePlayer([1, 1, 8]);
    const twoTop8Player = generatePlayer([2, 8, 8]);
    const noTop8Player = generatePlayer([2, 3, 4]);

    it("should be negative if a has higher placement than b", () => {
      expect(sortByLessTopEigth(noTop8Player, twoTop8Player)).toBeLessThan(0);
    });

    it("should be positive if b has higher placement than a", () => {
      expect(sortByLessTopEigth(oneTop8Player, noTop8Player)).toBeGreaterThan(
        0,
      );
    });

    it("should be zero if a = b", () => {
      expect(sortByLessTopEigth(twoTop8Player, twoTop8Player)).toBe(0);
    });
  });

  describe("sort by most top one", () => {
    const twoTop1Player = generatePlayer([1, 1, 8]);
    const oneTop1Player = generatePlayer([1, 8, 8]);
    const noTop1Player = generatePlayer([2, 3, 4]);

    it("should be negative if a has higher placement than b", () => {
      expect(sortByFirstPlaces(twoTop1Player, noTop1Player)).toBeLessThan(0);
    });

    it("should be positive if b has higher placement than a", () => {
      expect(sortByFirstPlaces(noTop1Player, oneTop1Player)).toBeGreaterThan(0);
    });

    it("should be zero if a = b", () => {
      expect(sortByFirstPlaces(twoTop1Player, twoTop1Player)).toBe(0);
    });
  });

  describe("sort by last round top one", () => {
    const championPlayer = generatePlayer([3, 2, 1]);
    const middleRoundTop1Player = generatePlayer([3, 1, 2]);
    const noTop1Player = generatePlayer([2, 3, 4]);

    it("should be negative if a has higher placement than b", () => {
      expect(
        sortByLastRoundFirstPlace(championPlayer, noTop1Player),
      ).toBeLessThan(0);
    });

    it("should be positive if b has higher placement than a", () => {
      expect(
        sortByLastRoundFirstPlace(middleRoundTop1Player, championPlayer),
      ).toBeGreaterThan(0);
    });

    it("should be zero if none of the players got top 1 last round", () => {
      expect(
        sortByLastRoundFirstPlace(middleRoundTop1Player, noTop1Player),
      ).toBe(0);
    });
  });

  describe("sort by last round position", () => {
    const lastRoundWinner = generatePlayer([8, 8, 1]);
    const lastRoundLoser = generatePlayer([1, 1, 8]);
    const lastRoundMiddlePack = generatePlayer([2, 3, 4]);

    it("should be negative if a has higher placement than b", () => {
      expect(
        sortByLastRoundPosition(lastRoundWinner, lastRoundMiddlePack),
      ).toBeLessThan(0);
    });

    it("should be positive if b has higher placement than a", () => {
      expect(
        sortByLastRoundPosition(lastRoundLoser, lastRoundWinner),
      ).toBeGreaterThan(0);
    });

    it("should be zero if both players had the same position", () => {
      expect(
        sortByLastRoundPosition(lastRoundMiddlePack, lastRoundMiddlePack),
      ).toBe(0);
    });
  });
});
