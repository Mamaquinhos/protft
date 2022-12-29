import { colors } from "../../design/colors";
import { useExternalNavigation } from "../../hooks/useNavigation";

export const TwitterLogo = () => {
  const goTo = useExternalNavigation("https://twitter.com/protft", "_blank");

  return (
    <svg
      onClick={goTo}
      width="31"
      height="25"
      viewBox="0 0 31 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }}
    >
      <path
        d="M9.74149 24.7729C20.9621 24.7729 27.0983 15.4768 27.0983 7.41604C27.0983 7.15193 27.0929 6.88917 27.0807 6.62742C28.2718 5.76643 29.3073 4.69171 30.124 3.46887C29.031 3.95449 27.8548 4.2815 26.6208 4.42895C27.8802 3.6738 28.8473 2.47869 29.3035 1.0543C28.1247 1.75331 26.8193 2.26125 25.4301 2.53517C24.3165 1.34953 22.7311 0.60791 20.977 0.60791C17.6078 0.60791 14.8757 3.34002 14.8757 6.70757C14.8757 7.18642 14.9294 7.65175 15.0336 8.09848C9.96401 7.84383 5.46832 5.41608 2.45992 1.72524C1.93541 2.62647 1.63342 3.67414 1.63342 4.79113C1.63342 6.90743 2.7105 8.77584 4.34828 9.86916C3.34762 9.83839 2.4075 9.56311 1.5854 9.1059C1.58404 9.13127 1.58404 9.15697 1.58404 9.18368C1.58404 12.1383 3.68715 14.605 6.47811 15.164C5.96577 15.3036 5.42672 15.3787 4.87009 15.3787C4.47713 15.3787 4.09499 15.3395 3.72334 15.2688C4.49978 17.6922 6.75203 19.4561 9.42226 19.5058C7.33403 21.1422 4.7037 22.1172 1.84579 22.1172C1.35375 22.1172 0.868128 22.0891 0.390625 22.0326C3.09027 23.7627 6.29583 24.7729 9.74149 24.7729Z"
        fill="#FAAC01"
      />
    </svg>
  );
};

export const DiscordLogo = () => {
  const goTo = useExternalNavigation("https://discord.gg/Ry5Fp54k3q", "_blank");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 127.14 96.36"
      onClick={goTo}
      width="31"
      height="25"
      style={{ cursor: "pointer" }}
    >
      <g id="图层_2" data-name="图层 2">
        <g id="Discord_Logos" data-name="Discord Logos">
          <g
            id="Discord_Logo_-_Large_-_White"
            data-name="Discord Logo - Large - White"
          >
            <path
              fill={colors.yellow}
              d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
            />
          </g>
        </g>
      </g>
    </svg>
    // <svg
    //   onClick={goTo}
    //   width="31"
    //   height="25"
    //   viewBox="0 0 31 25"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <path
    //     d="M9.74149 24.7729C20.9621 24.7729 27.0983 15.4768 27.0983 7.41604C27.0983 7.15193 27.0929 6.88917 27.0807 6.62742C28.2718 5.76643 29.3073 4.69171 30.124 3.46887C29.031 3.95449 27.8548 4.2815 26.6208 4.42895C27.8802 3.6738 28.8473 2.47869 29.3035 1.0543C28.1247 1.75331 26.8193 2.26125 25.4301 2.53517C24.3165 1.34953 22.7311 0.60791 20.977 0.60791C17.6078 0.60791 14.8757 3.34002 14.8757 6.70757C14.8757 7.18642 14.9294 7.65175 15.0336 8.09848C9.96401 7.84383 5.46832 5.41608 2.45992 1.72524C1.93541 2.62647 1.63342 3.67414 1.63342 4.79113C1.63342 6.90743 2.7105 8.77584 4.34828 9.86916C3.34762 9.83839 2.4075 9.56311 1.5854 9.1059C1.58404 9.13127 1.58404 9.15697 1.58404 9.18368C1.58404 12.1383 3.68715 14.605 6.47811 15.164C5.96577 15.3036 5.42672 15.3787 4.87009 15.3787C4.47713 15.3787 4.09499 15.3395 3.72334 15.2688C4.49978 17.6922 6.75203 19.4561 9.42226 19.5058C7.33403 21.1422 4.7037 22.1172 1.84579 22.1172C1.35375 22.1172 0.868128 22.0891 0.390625 22.0326C3.09027 23.7627 6.29583 24.7729 9.74149 24.7729Z"
    //     fill="#FAAC01"
    //   />
    // </svg>
  );
};
