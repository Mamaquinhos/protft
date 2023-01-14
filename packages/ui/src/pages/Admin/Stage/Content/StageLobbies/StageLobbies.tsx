import { ChangeEvent, Suspense, useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "urql";
import { SearchInput } from "../../../../../components/SearchInput/SearchInput";
import { Player } from "../../../../../graphql/schema";
import { DraggablePlayer } from "../../../Components/PlayerItem/PlayerItem";
import {
  StyledLeftSide,
  StyledRightSide,
} from "../../../Tournament/Content/Content.styled";
import { LobbyGroup } from "./LobbyGroup/LobbyGroup";
import {
  LobbyGroupsQueryResult,
  LobbyGroupsQueryVariables,
  LOBBY_GROUPS_QUERY,
  StagePlayersResponse,
  STAGE_PLAYERS_QUERY,
} from "./queries";
import { StyledBar, StyledContainer } from "./StageLobbies.styled";

export const StageLobbies = () => {
  const { stageId } = useParams();

  const [{ data: lobbyGroupsData }] = useQuery<
    LobbyGroupsQueryResult,
    LobbyGroupsQueryVariables
  >({
    query: LOBBY_GROUPS_QUERY,
    variables: { id: Number(stageId) },
  });

  const [selectedLobbyGroup, setSelectedLobbyGroup] = useState(
    () => lobbyGroupsData?.stage.lobbyGroups[0]?.id
  );

  const [selectedLobbyGroupName, setSelectedLobbyGroupName] = useState(
    () => lobbyGroupsData?.stage.lobbyGroups[0]?.sequence
  );

  const onChangeLobbyGroup = useCallback(
    (direction: number) => {
      const allLobbyGroups = lobbyGroupsData?.stage.lobbyGroups!;
      const currentLobbyGroupIndex = allLobbyGroups.findIndex(
        (lg) => lg.id === selectedLobbyGroup
      )!;
      if (
        direction > 0 &&
        currentLobbyGroupIndex !== allLobbyGroups.length - 1
      ) {
        const nextLobbyGroup = allLobbyGroups[currentLobbyGroupIndex + 1];
        setSelectedLobbyGroupName(nextLobbyGroup.sequence);
        setSelectedLobbyGroup(nextLobbyGroup.id);
      } else if (direction < 0 && currentLobbyGroupIndex !== 0) {
        const nextLobbyGroup = allLobbyGroups[currentLobbyGroupIndex - 1];
        setSelectedLobbyGroupName(nextLobbyGroup.sequence);
        setSelectedLobbyGroup(nextLobbyGroup.id);
      }
    },
    [
      setSelectedLobbyGroup,
      lobbyGroupsData?.stage.lobbyGroups,
      selectedLobbyGroup,
    ]
  );

  const hasLobbieGroups = useMemo(
    () => !!lobbyGroupsData?.stage.lobbyGroups.length,
    [lobbyGroupsData?.stage.lobbyGroups]
  );

  const [{ data: stagePlayersData }] = useQuery<StagePlayersResponse>({
    query: STAGE_PLAYERS_QUERY,
    variables: { id: Number(stageId) },
  });

  const [remainingPlayers, setRemainingPlayers] = useState<Player[]>(
    () => stagePlayersData?.stage.players.map((p) => p.player) || []
  );

  const [filteredRemainingPlayers, setFilteredRemainingPlayers] = useState<
    Player[]
  >(() => remainingPlayers);

  const onChangeSearchInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFilteredRemainingPlayers(() =>
        remainingPlayers.filter((p) =>
          p.name.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    },
    [remainingPlayers, setFilteredRemainingPlayers]
  );

  const onChangeSelectedPlayers = useCallback(
    (playerIds: number[]) => {
      const playersLeft =
        stagePlayersData?.stage.players
          .map((p) => p.player)
          .filter((p) => !playerIds.includes(p.id)) || [];
      setRemainingPlayers(playersLeft);
      setFilteredRemainingPlayers(playersLeft);
    },
    [stagePlayersData?.stage.players]
  );

  return (
    <StyledContainer>
      <StyledLeftSide>
        <StyledBar>
          <SearchInput
            placeholder="Search Players"
            onChange={onChangeSearchInput}
          />
        </StyledBar>
        {filteredRemainingPlayers.map((player) => (
          <DraggablePlayer key={player.id} player={player} />
        ))}
      </StyledLeftSide>
      <StyledRightSide>
        <Suspense fallback={null}>
          <LobbyGroup
            hasLobbieGroups={hasLobbieGroups}
            selectedLobbyGroup={selectedLobbyGroup}
            lobbyGroupName={selectedLobbyGroupName}
            stageId={Number(stageId!)}
            onChangeLobbyGroup={onChangeLobbyGroup}
            onChangeSelectedPlayers={onChangeSelectedPlayers}
          />
        </Suspense>
      </StyledRightSide>
    </StyledContainer>
  );
};
