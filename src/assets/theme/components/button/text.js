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

// Vision UI Dashboard React Base Styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";

// Vision UI Dashboard React Helper Functions
import pxToRem from "assets/theme/functions/pxToRem";

const { transparent, primary, grey, text } = colors;
const { size } = typography;

export default {
  base: {
    backgroundColor: transparent.main,
    height: "max-content",
    color: text.main,
    boxShadow: "none",
    padding: `${pxToRem(6)} ${pxToRem(12)}`,

    "&:hover": {
      backgroundColor: transparent.main,
      boxShadow: "none",
      color: text.focus,
    },

    "&:focus": {
      boxShadow: "none",
      color: text.focus,
    },

    "&:active, &:active:focus, &:active:hover": {
      opacity: 0.85,
      boxShadow: "none",
    },

    "&:disabled": {
      color: grey[600],
      boxShadow: "none",
    },

    "& .material-icons, .material-icons-round, svg, span": {
      fontSize: `${pxToRem(16)} !important`,
    },
  },

  small: {
    fontSize: size.xs,

    "& .material-icons, .material-icons-round, svg, span": {
      fontSize: `${pxToRem(12)} !important`,
    },
  },

  large: {
    fontSize: size.sm,

    "& .material-icons, .material-icons-round, svg, span": {
      fontSize: `${pxToRem(22)} !important`,
    },
  },

  primary: {
    color: primary.main,
    backgroundColor: transparent.main,

    "&:hover": {
      color: primary.focus,
      backgroundColor: transparent.main,
    },

    "&:focus:not(:hover)": {
      color: primary.focus,
      backgroundColor: transparent.focus,
      boxShadow: "none",
    },
  },

  secondary: {
    color: text.secondary,
    backgroundColor: transparent.main,

    "&:hover": {
      color: text.secondary,
      backgroundColor: transparent.main,
    },

    "&:focus:not(:hover)": {
      color: text.secondary,
      backgroundColor: transparent.focus,
      boxShadow: "none",
    },
  },
};
