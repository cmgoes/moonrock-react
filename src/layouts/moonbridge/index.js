import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import React from 'react';
import Particles from "examples/Particles";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import Bridge from './Bridge';

const Moonbridge = () => {

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Particles />
      <VuiBox py={3}>
        <Bridge />
      </VuiBox>
      <Footer />
    </DashboardLayout>
  )
}

export default Moonbridge