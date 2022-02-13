/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";

export default styled(InputBase)(({ theme, ownerState }) => {
  const { palette, boxShadows, functions, typography, borders } = theme;
  const { size, error, success, iconDirection, direction, disabled } = ownerState;

  const { inputColors, white, grey } = palette;
  const { inputBoxShadow } = boxShadows;
  const { pxToRem, boxShadow } = functions;
  const { size: fontSize } = typography;
  const { borderRadius } = borders;

  // border color value

  let borderColorValue = "";

  if (error) {
    borderColorValue = inputColors.error;
  } else if (success) {
    borderColorValue = inputColors.success;
  }

  // styles for the input with size="small"
  const smallStyles = () => ({
    fontSize: fontSize.xs,
    padding: `${pxToRem(4)} ${pxToRem(12)}`,
  });

  // styles for the input with size="medium"
  const mediumStyles = () => ({
    padding: `${pxToRem(8)} ${pxToRem(12)}`,
  });

  // styles for the input with size="large"
  const largeStyles = () => ({
    padding: pxToRem(12),
  });

  // styles for the focused state of the input
  let focusedBorderColorValue = inputColors.borderColor.focus;

  if (error) {
    focusedBorderColorValue = inputColors.error;
  } else if (success) {
    focusedBorderColorValue = inputColors.success;
  }

  let focusedPaddingLeftValue;

  if (direction === "rtl" && iconDirection === "left") {
    focusedPaddingLeftValue = pxToRem(12);
  } else if (direction === "rtl" && iconDirection === "right") {
    focusedPaddingLeftValue = pxToRem(12);
  } else if (direction === "ltr" && iconDirection === "right") {
    focusedPaddingLeftValue = pxToRem(12);
  } else if (direction === "ltr" && iconDirection === "left") {
    focusedPaddingLeftValue = pxToRem(12);
  }

  let focusedPaddingRightValue;

  if (direction === "rtl" && iconDirection === "left") {
    focusedPaddingRightValue = pxToRem(12);
  } else if (direction === "rtl" && iconDirection === "right") {
    focusedPaddingRightValue = pxToRem(12);
  } else if (direction === "ltr" && iconDirection === "right") {
    focusedPaddingRightValue = pxToRem(12);
  } else if (direction === "ltr" && iconDirection === "left") {
    focusedPaddingRightValue = pxToRem(12);
  }

  let focusedBoxShadowValue = boxShadow([0, 0], [0, 2], inputColors.boxShadow, 1);

  if (error) {
    focusedBoxShadowValue = inputBoxShadow.error;
  } else if (success) {
    focusedBoxShadowValue = inputBoxShadow.success;
  }

  // styles for the input with error={true}
  const errorStyles = () => ({
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23fd5c70' viewBox='0 0 12 12'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23fd5c70' stroke='none'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: `right ${pxToRem(12)} center`,
    backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,
    borderColor: inputColors.error,
  });

  // styles for the input with success={true}
  const successStyles = () => ({
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 8'%3E%3Cpath fill='%2366d432' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: `right ${pxToRem(12)} center`,
    backgroundSize: `${pxToRem(16)} ${pxToRem(16)}`,
    borderColor: inputColors.success,
  });

  // styles for the input containing an icon
  const withIconStyles = () => {
    let withIconBorderRadiusValue = `0 ${borderRadius.md} ${borderRadius.md} 0`;

    if (direction === "rtl" && iconDirection === "left") {
      withIconBorderRadiusValue = `0 ${borderRadius.md} ${borderRadius.md} 0`;
    } else if (direction === "rtl" && iconDirection === "right") {
      withIconBorderRadiusValue = `${borderRadius.md} 0 0 ${borderRadius.md}`;
    } else if (direction === "ltr" && iconDirection === "right") {
      withIconBorderRadiusValue = `${borderRadius.md} 0 0 ${borderRadius.md}`;
    }

    let withIconPaddingLeftValue;
    if (direction === "rtl" && iconDirection === "left") {
      withIconPaddingLeftValue = 0;
    } else if (direction === "rtl" && iconDirection === "right") {
      withIconPaddingLeftValue = pxToRem(12);
    } else if (direction === "ltr" && iconDirection === "right") {
      withIconPaddingLeftValue = pxToRem(12);
    } else if (direction === "ltr" && iconDirection === "left") {
      withIconPaddingLeftValue = 0;
    }

    let withIconPaddingRightValue;

    if (direction === "rtl" && iconDirection === "left") {
      withIconPaddingRightValue = pxToRem(12);
    } else if (direction === "rtl" && iconDirection === "right") {
      withIconPaddingRightValue = 0;
    } else if (direction === "ltr" && iconDirection === "right") {
      withIconPaddingRightValue = 0;
    } else if (direction === "ltr" && iconDirection === "left") {
      withIconPaddingRightValue = pxToRem(12);
    }

    return {
      paddingLeft: withIconPaddingLeftValue,
      paddingRight: withIconPaddingRightValue,
    };
  };

  return {
    backgroundColor: disabled ? `${grey[200]} !important` : white.main,
    pointerEvents: disabled ? "none" : "auto",
    backgroundColor: `${disabled ? grey[600] : inputColors.backgroundColor} !important`,
    color: `${white.main} !important`,
    borderRadius: borderRadius.lg,
    border: `0.5px solid ${grey[600]}`,
    ...(size === "small" && smallStyles()),
    ...(size === "medium" && mediumStyles()),
    ...(size === "large" && largeStyles()),
    ...(error && errorStyles()),
    ...(success && successStyles()),
    ...((iconDirection === "left" || iconDirection === "right") && withIconStyles()),
    "& ::placeholder": {
      color: `${white.main} !important`,
      fontSize: "12px",
    },

    "&.Mui-focused": {
      borderColor: focusedBorderColorValue,
      paddingLeft: focusedPaddingLeftValue,
      paddingRight: focusedPaddingRightValue,
      boxShadow: focusedBoxShadowValue,
      outline: 0,
    },

    "&.MuiInputBase-multiline": {
      padding: `${pxToRem(10)} ${pxToRem(12)}`,
    },
  };
});
