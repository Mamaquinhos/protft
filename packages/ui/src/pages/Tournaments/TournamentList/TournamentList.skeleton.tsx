import { TournamentListItemSkeleton } from "../TournamentListItem/TournamentListItem.skeleton";
import { StyledTournamentList } from "../Tournaments.styled";

export const TournamentListSkeleton = () => {
  return (
    <StyledTournamentList>
      {new Array(20).fill(1).map((_, index) => (
        <TournamentListItemSkeleton key={index} />
      ))}
    </StyledTournamentList>
  );
};
