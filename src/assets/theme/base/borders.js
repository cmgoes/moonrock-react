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

/**
 * The base border styles for the Vision UI Dashboard  Material.
 * You can add new border width, border color or border radius using this file.
 * You can customized the borders value for the entire Vision UI Dashboard  Material using thie file.
 */

// Vision UI Dashboard React Base Styles
import colors from "assets/theme/base/colors";

// Vision UI Dashboard React Helper Functions
import pxToRem from "assets/theme/functions/pxToRem";

const { borderCol } = colors;

export default {
  borderColor: {
    grey: { borderCol },
    white: "rgba(226, 232, 240, 0.3)",
  },

  borderWidth: {
    0: 0,
    1: pxToRem(1),
    2: pxToRem(2),
    3: pxToRem(3),
    4: pxToRem(4),
    5: pxToRem(5),
  },

  borderRadius: {
    xs: pxToRem(2),
    sm: pxToRem(4),
    md: pxToRem(8),
    button: pxToRem(12),
    lg: pxToRem(15),
    xl: pxToRem(20),
    xxl: pxToRem(24),
    form: pxToRem(24),
    section: pxToRem(160),
  },
};
