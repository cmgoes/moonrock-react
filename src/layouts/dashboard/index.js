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



// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import 'bootstrap/dist/css/bootstrap.css';

import {ethers} from 'ethers'
import Simpleabi from 'contract/Simpleabi.json'


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
  const [moonRockData,setMoonRockData] = useState(null);
  const [count,setCount] = useState(0);
  const[count2,setCount2] =  useState(0);


  
  const connectWalletHandler = () => {

    if(connButtonText=='Disconnect Wallet'){
      window.location.reload();
    }
    console.log("logged");
   if (window.ethereum && window.ethereum.isMetaMask) {

 window.ethereum.request({ method: 'eth_requestAccounts'})
 .then(result => {
   accountChangedHandler(result[0]);
   setConnButtonText('Disconnect Wallet');
   apiGet() ;
   
    
 })
 .catch(error => {
   setErrorMessage(error.message);
 
 });

} else {
 console.log('Need to install MetaMask');
 setErrorMessage('Please install MetaMask browser extension to interact');
}

}

const apiGet =  () => {
  fetch("https://api.coinstats.app/public/v1/coins/moonrock?currency=USD")
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      setMoonRockData(json);
      let count1 = json != null?json.coin.priceChange1d:0;
      let value = json != null?json.coin.price:0;
      let data = (value/100 ) * count1;
      setCount(count1);
      setCount2(value);

    
      console.log(moonRockData);
     
    });
};

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
   console.log(balance);
   console.log(typeof balance);
   console.log(parseInt(balance,16));
   setBalanceVal(parseFloat(''+parseInt(balance,16)).toFixed(2));
   console.log(parseInt(gasprice,16));
   setGasVal(parseInt(gasprice,16));	
}
 



  return (
    
    <DashboardLayout>
      <DashboardNavbar connectWalletHandler={connectWalletHandler} connButtonText={connButtonText} defaultAccount={defaultAccount} />
    {errorMessage}
        
      <VuiBox py={3}>
        <VuiBox mb={3}>
       
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} xl={6}>
              <MiniStatisticsCard
                title={{ text: "Totale balance", fontWeight: "regular" }}
                count={ balanceVal}
                percentage={{ color: "success", text: "+0%" }}
                icon={{ color: "info", component: <IoCash size="22px" color="white" /> }}
              />
            </Grid>
           
            <Grid item xs={12} lg={12} xl={12}>
              Details
            </Grid> 
            <Grid item xs={12} md={3} xl={3}>
            
              <MiniStatisticsCard
                title={{ text: "Totale reflection ricevute ultime 24h" }}
                count= {count2}
                percentage={{ color: "success", text: count }}
                icon={{ color: "info", component: <IoCash size="22px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={3} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Totale supply ROCK" }}
                count="990,000,000.00"
                percentage={{ color: "success", text: "+0%" }}
                icon={{ color: "info", component: <IoCash size="20px" color="white" /> }}
              />
            </Grid>
            <Grid item xs={12} md={3} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Totale reflection ricevute da primo buy" }}
                count="+0"
                percentage={{ color: "error", text: "-0%" }}
                icon={{ color: "info", component: <IoCash size="22px" color="white" /> }}
              />
            </Grid>
            
            <Grid item xs={12} md={3} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Totale burned token ROCK" }}
                count="10000"
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
