import { useCallback } from "react";
import { useQuery } from "urql";
import { Tournament } from "../../../graphql/schema";
import { DataSelect } from "../DataSelect/DataSelect";
import {
  TournamentsQueryResponse,
  TOURNAMENTS_WITH_STATS_QUERY,
} from "../DataSelect/queries";

interface Props {
  value: number[];
  onValueChange: (newValue: number[] | undefined) => void;
}

type SelectTournament = Pick<Tournament, "id" | "name" | "set">;

export const TournamentSelect = ({ value, onValueChange }: Props) => {
  const [{ data, fetching }] = useQuery<TournamentsQueryResponse>({
    query: TOURNAMENTS_WITH_STATS_QUERY,
  });

  const getPrefix = useCallback((data: SelectTournament) => data.set.name, []);

  return (
    <DataSelect<number[], SelectTournament>
      data={data?.tournamentsWithStats}
      valueKey="id"
      labelKey="name"
      value={value}
      onValueChange={onValueChange}
      isLoading={fetching}
      prefix={getPrefix}
      placeholder="Golden Spatula Cup #1, Mid-set Finale"
      isMulti
    />
  );
};
