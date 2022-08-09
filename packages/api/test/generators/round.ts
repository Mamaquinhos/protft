import { Round } from "../../src/lobbies/round.entity";
import { stage as genStage } from "./stage";

export function round({
  id,
  roundResults,
  sequence,
  stage,
  stageId,
}: Partial<Round>): Round {
  const randomId = Math.random() * 999;
  return {
    id: id || randomId,
    roundResults: roundResults || [],
    sequence: sequence || randomId,
    stage: stage || genStage({}),
    stageId: stageId || randomId,
  };
}
