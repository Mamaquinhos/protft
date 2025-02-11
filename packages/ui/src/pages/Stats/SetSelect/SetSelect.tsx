import { useCallback } from "react";
import { useQuery } from "urql";
import { Set } from "../../../graphql/schema";
import { DataSelect } from "../DataSelect/DataSelect";
import { SetsQueryResponse, SETS_QUERY } from "../DataSelect/queries";

interface Props {
  value: number;
  onValueChange: (newValue: number | undefined) => void;
}

type SelectSet = Pick<Set, "id" | "name">;

export const SetSelect = ({ value, onValueChange }: Props) => {
  const [{ data, fetching }] = useQuery<SetsQueryResponse>({
    query: SETS_QUERY,
  });

  const getPrefix = useCallback((data: SelectSet) => String(data.id), []);

  return (
    <DataSelect<number, SelectSet>
      data={data?.sets}
      valueKey="id"
      labelKey="name"
      value={value}
      onValueChange={onValueChange}
      isLoading={fetching}
      placeholder="Dragonlands, Reckoning"
      prefix={getPrefix}
    />
  );
};
