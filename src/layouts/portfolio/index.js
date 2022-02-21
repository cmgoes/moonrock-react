// @mui material components
import Grid from "@mui/material/Grid";
import React, { useState,useEffect } from 'react';


// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";


// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";

// Vision UI Dashboard React base styles

import colors from "assets/theme/base/colors";





import { IoCash } from "react-icons/io5";

// Data

function Portfolio() {
  const { gradients } = colors;
  const [reload,setReload] = useState(false);

  useEffect(() => {
    reload ? setReload(false) : setReload(true);
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} xl={12} style={{minHeight:"500px"}}>
           
            <coin-stats-portfolio-widget locale="en" currency="USD" bg-color="none" status-up-color="#74D492"
status-down-color="#FE4747" text-color="#FFFFFF" border-color="rgba(255,255,255,0.15)"
widgetType="large" coins-count="20" font="Montserrat" link="Tk1Ezm"
rotate-button-color="rgba(28,27,27,0.35)" width="100%"></coin-stats-portfolio-widget>
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Portfolio;