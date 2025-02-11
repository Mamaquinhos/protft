import styled from "styled-components";
import { StyledHorizontalContainer } from "../../../../components/Layout/HorizontalContainer/HorizontalContainer.styled";
import { colors } from "../../../../design/colors";

export const StyledField = styled(StyledHorizontalContainer)`
  gap: 2rem;
  justify-content: space-between;
  color: ${colors.white};
  font-family: Roboto;
  font-size: 18px;
  align-items: center;
`;

export const StyledInput = styled.input`
  border: 2px solid black;
  border-radius: 4px;
  height: 1.5rem;
  padding: 1rem;
`;

export const StyledSelect = styled.select`
  border: 2px solid black;
  border-radius: 4px;
  height: 1.5rem;
`;

export const StyledCheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: none;
  flex-wrap: wrap;
`;

export const StyledOptionContainer = styled(StyledHorizontalContainer)`
  gap: 0.5rem;
`;
