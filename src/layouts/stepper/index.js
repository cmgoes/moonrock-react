import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import React from 'react';
import Particles from "examples/Particles";
import VuiBox from "components/VuiBox";
import Stepper from './Stepper';

const StepperComponent = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Particles />
      <VuiBox py={3}>
        <Stepper />
      </VuiBox>
      <Footer />
    </DashboardLayout>
  )
}

export default StepperComponent