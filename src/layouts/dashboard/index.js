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
import Grid from "@mui/material/Grid";


import React, { useState } from 'react';
import ReactApexChart from "react-apexcharts";

import {ethers} from 'ethers'
import Simpleabi from 'contract/Simpleabi.json'

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import 'bootstrap/dist/css/bootstrap.css';


// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";


// Vision UI Dashboard React base styles

import colors from "assets/theme/base/colors";
import LineChart from "examples/Charts/LineCharts/LineChart";
import { lineChartDataDashboard } from "layouts/dashboard/data/lineChartData";
import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";

// Dashboard layout components


// React icons

import { IoCash } from "react-icons/io5";


function Dashboard() {
  const { gradients } = colors;
  let contractAddress = '0x4ba8a637c6b36e7890c870ba7dbbd8128dac8b40';

  //let contractAddress = '0xE05AC61617A6a7823e8C8a43af156eAdB7469D02';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
  const [balanceVal, setBalanceVal] = useState(0);
	const [gasVal, setGasVal] = useState(null);


  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "10px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "10px",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      strokeDashArray: 5,
      borderColor: "#56577A",
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0,
        gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [],
      },
      colors: ["#0075FF", "#2CD9FF"],
    },
    colors: ["#0075FF", "#2CD9FF"],
  };

  const chartData = [
    {
      name: "Mobile apps",
      data: [500, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400],
    },
    {
      name: "Websites",
      data: [200, 230, 300, 350, 370, 420, 550, 350, 400, 500, 330, 550],
    },
  ];

  const connectWalletHandler = () => {

     console.log("logged");
    if (window.ethereum && window.ethereum.isMetaMask) {

  window.ethereum.request({ method: 'eth_requestAccounts'})
  .then(result => {
    accountChangedHandler(result[0]);
    setConnButtonText('Wallet Connected');

  })
  .catch(error => {
    setErrorMessage(error.message);
  
  });

} else {
  console.log('Need to install MetaMask');
  setErrorMessage('Please install MetaMask browser extension to interact');
}

}

// update account, will cause component re-render
const accountChangedHandler = (newAccount) => {
  setDefaultAccount(newAccount);
  updateEthers();
}

const chainChangedHandler = () => {
  // reload the page to avoid any errors with chain change mid use of application
  window.location.reload();
}


// listen for account changes
window.ethereum.on('accountsChanged', accountChangedHandler);

window.ethereum.on('chainChanged', chainChangedHandler);

const updateEthers = async () => {
  let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
  setProvider(tempProvider);

  let tempSigner = tempProvider.getSigner();
  setSigner(tempSigner);

  let tempContract = new ethers.Contract(contractAddress, Simpleabi, tempSigner);
  setContract(tempContract);
  let balance =  await tempSigner.getBalance();
		let gasprice =  await tempSigner.getGasPrice();
		//const balance = await tempContract.balanceOf(tempContract.address);
		console.log(parseInt(balance,16));
		setBalanceVal(parseInt(balance,16));
		console.log(parseInt(gasprice,16));
		setGasVal(parseInt(gasprice,16));	
}

 



  return (
    
    <DashboardLayout>
      <DashboardNavbar />
    
        
      <VuiBox py={3}>
        <VuiBox mb={3}>
       
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={6}>
              <MiniStatisticsCard
                title={{ text: "Totale balance", fontWeight: "regular" }}
                count={"$" +balanceVal}
                percentage={{ color: "success", text: "+0%" }}
                icon={{ color: "info", component: <IoCash size="22px" color="white" /> }}
              />
            </Grid>
           
            <Grid item xs={12} lg={12} xl={12}>
              Details
            </Grid> 
            <Grid item xs={12} md={6} xl={6}>
              <MiniStatisticsCard
                title={{ text: "Totale reflection ricevute ultime 24h" }}
                count="00"
                percentage={{ color: "success", text: "+0%" }}
                icon={{ color: "info", component: <IoCash size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <MiniStatisticsCard
                title={{ text: "Totale supply ROCK" }}
                count="$0"
                percentage={{ color: "success", text: "+0%" }}
                icon={{ color: "info", component: <IoCash size="20px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={6}>
              <MiniStatisticsCard
                title={{ text: "Totale reflection ricevute da primo buy" }}
                count="+0"
                percentage={{ color: "error", text: "-0%" }}
                icon={{ color: "info", component: <IoCash size="22px" color="white" /> }}
              />
            </Grid>
            
            <Grid item xs={12} md={6} xl={6}>
              <MiniStatisticsCard
                title={{ text: "Totale burned token ROCK" }}
                count="$0"
                percentage={{ color: "success", text: "+0%" }}
                icon={{ color: "info", component: <IoCash size="20px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={12} xl={12}>
            <LineChart
                      lineChartData={lineChartDataDashboard}
                      lineChartOptions={lineChartOptionsDashboard}
                    />
            </Grid>
          </Grid>
        </VuiBox>
       
        
        
      </VuiBox>

     
      
        <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
