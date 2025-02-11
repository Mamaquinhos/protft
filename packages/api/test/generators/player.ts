import { Player } from "../../src/players/player.entity";

type PlayerGeneratorParams = Partial<Player>;

export function player({
  id,
  name,
  region,
  country,
}: PlayerGeneratorParams): Player {
  const randomId = Math.random() * 999;
  return {
    id: id || randomId,
    name: name || "",
    region: region || "",
    country: country || "",
    playerStats: null,
  };
}
