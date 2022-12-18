import {
  StyledContainer,
  StyledDivider,
  StyledFooterText,
} from "./Footer.styled";
import { TwitterLogo } from "./TwitterLogo";

export const Footer = () => {
  return (
    <>
      <StyledDivider />
      <StyledContainer>
        <StyledFooterText>
          © {new Date().getFullYear()} Pro TFT, all rights reserved
        </StyledFooterText>
        <TwitterLogo />
      </StyledContainer>
    </>
  );
};
