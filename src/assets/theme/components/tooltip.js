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

// @mui material components
import Fade from "@mui/material/Fade";

// Vision UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import borders from "assets/theme/base/borders";

// Vision UI Dashboard React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

const { black, light } = colors;
const { size, fontWeightRegular } = typography;
const { borderRadius } = borders;

const defaultProps = {
  defaultProps: {
    arrow: true,
    TransitionComponent: Fade,
  }
}

const styleOverrides = {
  styleOverrides: {
    tooltip: {
      maxWidth: pxToRem(200),
      backgroundColor: black.main,
      color: light.main,
      fontSize: size.sm,
      fontWeight: fontWeightRegular,
      textAlign: "center",
      borderRadius: borderRadius.md,
      opacity: 0.7,
      padding: `${pxToRem(5)} ${pxToRem(8)} ${pxToRem(4)}`,
    },

    arrow: {
      color: black.main,
    },
  }
}

const tooltip = {
  defaultProps,
  styleOverrides,
};

export default tooltip


// export default {
//   defaultProps: {
//     arrow: true,
//     TransitionComponent: Fade,
//   },

//   styleOverrides: {
//     tooltip: {
//       maxWidth: pxToRem(200),
//       backgroundColor: black.main,
//       color: light.main,
//       fontSize: size.sm,
//       fontWeight: fontWeightRegular,
//       textAlign: "center",
//       borderRadius: borderRadius.md,
//       opacity: 0.7,
//       padding: `${pxToRem(5)} ${pxToRem(8)} ${pxToRem(4)}`,
//     },

//     arrow: {
//       color: black.main,
//     },
//   },

