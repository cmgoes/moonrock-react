// @mui material components
import Grid from "@mui/material/Grid";


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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <coin-stats-portfolio-widget locale="en" currency="USD" bg-color="none" status-up-color="#74D492"
status-down-color="#FE4747" text-color="#FFFFFF" border-color="rgba(255,255,255,0.15)"
widgetType="large" coins-count="20" font="Montserrat" link="Tk1Ezm"
rotate-button-color="rgba(28,27,27,0.35)" width="486"></coin-stats-portfolio-widget>
      <VuiBox py={3}>
        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} xl={12}>
           
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Variazione del valore totale del portafoglio nelle ultime 24h" }}
                count="0"
                percentage={{ color: "success", text: "+0%" }}
                icon={{ color: "info", component: <IoCash size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Lista dei coin all'interno del community wallet con valore" }}
                count="$0"
                percentage={{ color: "success", text: "+0%" }}
                icon={{ color: "info", component: <IoCash size="20px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Lista dei coins attualmente in staking con lock period e reward ottenute" }}
                count="+0"
                percentage={{ color: "error", text: "-2%" }}
                icon={{ color: "info", component: <IoCash size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Lista dei coins attualmente in farming con lock period e reward ottenute" }}
                count="+0"
                percentage={{ color: "error", text: "-2%" }}
                icon={{ color: "info", component: <IoCash size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Totale guadagni derivanti da sell del portafoglio della community" }}
                count="$0"
                percentage={{ color: "success", text: "+0%" }}
                icon={{ color: "info", component: <IoCash size="20px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Totale buybacks / compound growth con i guadagni del portafoglio della community" }}
                count="$0"
                percentage={{ color: "success", text: "+0%" }}
                icon={{ color: "info", component: <IoCash size="20px" color="white" /> }}
              />
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Portfolio;