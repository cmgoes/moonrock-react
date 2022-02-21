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


import React, { useState,useEffect } from 'react';
import ReactApexChart from "react-apexcharts";



// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import 'bootstrap/dist/css/bootstrap.css';

import {ethers} from 'ethers'
import Simpleabi from 'contract/Simpleabi.json'
import data from 'contract/data.json'


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

  //let contractAddress = '0x10ed43c718714eb63d5aa57b78b54704e256024e';

  //let contractAddress = '0xAE2Ab58699b5A36a2bccA301d2fD88F5E72984b1';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [connBNCButtonText, setConnBNCButtonText] = useState('Connect Binance');

	const [currentContractVal, setCurrentContractVal] = useState(null);
  const [tokenName, setTokenName] = useState("Token");
	const [balance, setBalance] = useState(0);
  const [usdTokenBalance,setUsdTokenBalance] = useState("0");
  const [userBalance,setUserBalance] = useState(0);
  const [usdBalance,setUsdBalance] = useState("0");


	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
  const [balanceVal, setBalanceVal] = useState(0);
	const [gasVal, setGasVal] = useState(null);
  const [moonRockData,setMoonRockData] = useState({});
  const [count,setCount] = useState(0);
  const[count2,setCount2] =  useState(0);
  const[rockcirculating,setRockcirculating] = useState(0);
  const[rockBurned,setRockBurned] = useState(0);
  const[rockPrice,setRockPrice] = useState(0);
  const[rockPricePercent,setRockPricePercent] = useState(0);
  
  const[rockMarketCap,setRockMarketCap] = useState(0);
  const[last24hrsVolume,setLast24hrsVolume] = useState(0);
  const[marketRank,setMarketRank] = useState(0);
  const[volumeChange24h,setVolumeChange24h]= useState(0);
  
  // Create our number formatter.
var formatter1 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

var formatter2 = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

  const headers = {'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-CMC_PRO_API_KEY':'75e00f1a-cfef-40f9-958e-25ef02fb9a95',
  'Access-Control-Allow-Origin': '*' };

  useEffect(() => {    
    const headers = {'Accept': 'application/json',
    'Content-Type': 'application/json'};

    const apiGet = async () => {
      const responseData = await fetch("http://46.249.199.38:26497/market-cap/quotes?symbol=ROCK",{headers})
      .then(response => response.json())
      .then(response => {
      
        setMoonRockData(response.ROCK);
        let moonRockData = response.ROCK;
        let burned = parseFloat(moonRockData.total_supply) - parseFloat(moonRockData.self_reported_circulating_supply);
        const circulating_supply = moonRockData.self_reported_circulating_supply;
        setRockcirculating(formatter2.format(circulating_supply));
        setRockBurned(formatter2.format(burned));
        //setRockPrice(parseFloat(moonRockData.quote.USD.price).toPrecision(5));
        setRockPrice(parseFloat(moonRockData.quote.USD.price).toFixed(7));
        setRockPricePercent(parseFloat(moonRockData.quote.USD.percent_change_24h).toPrecision(3));
        setRockMarketCap(formatter1.format(moonRockData.self_reported_market_cap));
        setLast24hrsVolume(formatter1.format(moonRockData.quote.USD.volume_24h));
        setVolumeChange24h(parseFloat(moonRockData.quote.USD.volume_change_24h).toPrecision(4));
        setMarketRank(moonRockData.cmc_rank);
          console.log(response);
      
      });
        //const resJson = await responseData.json();
        //console.log(resJson);
    };
    apiGet();
    let burned = parseFloat(data.data.ROCK.total_supply) - parseFloat(data.data.ROCK.self_reported_circulating_supply);
    setRockcirculating(formatter2.format(data.data.ROCK.self_reported_circulating_supply));
    setRockBurned(formatter2.format(burned));
    setRockPrice(parseFloat(data.data.ROCK.quote.USD.price).toFixed(2));
    setRockPricePercent(parseFloat(data.data.ROCK.quote.USD.percent_change_24h).toPrecision(3));
    setRockMarketCap(formatter1.format(data.data.ROCK.self_reported_market_cap));
    setLast24hrsVolume(formatter1.format(data.data.ROCK.quote.USD.volume_24h));
    setVolumeChange24h(parseFloat(data.data.ROCK.quote.USD.volume_change_24h).toPrecision(4));
    setMarketRank(data.data.ROCK.cmc_rank);
   },[]);

   const connectbncWalletHandler = () =>{
    if(connBNCButtonText==='Disconnect Wallet'){
      window.location.reload();
      
    }
    if (window.BinanceChain) {

      window.BinanceChain.request({method: "eth_accounts"})
     
      .then(result => {
        accountBNCChangedHandler(result[0]);
        setConnBNCButtonText('Disconnect Wallet');
        
        
         
      })
      .catch(error => {
        setErrorMessage(error.message);
      
      });
     
     } else {
      console.log('Need to install binance chain');
      setErrorMessage('Please install binance chain browser extension to interact');
     }
     
   }
  const connectWalletHandler = () => {

    if(connButtonText==='Disconnect Wallet'){
      window.location.reload();
    }
    console.log("logged");
    console.log(window.ethereum);
    
   if (window.ethereum && window.ethereum.isMetaMask) {

 window.ethereum.request({ method: 'eth_requestAccounts'})
 .then(result => {
   accountChangedHandler(result[0]);
   setConnButtonText('Disconnect Wallet');
   
   
    
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

const accountBNCChangedHandler = (newAccount) => {
  setDefaultAccount(newAccount);
  updateBNC();
 }

const chainChangedHandler = () => {
 // reload the page to avoid any errors with chain change mid use of application
 window.location.reload();
}

const updateBNC = async () => {
  if (window.BinanceChain) {
 let tempProvider = new ethers.providers.Web3Provider(window.BinanceChain);
 setProvider(tempProvider);

 let tempSigner = tempProvider.getSigner();
 setSigner(tempSigner);

 let tempContract = new ethers.Contract(contractAddress, Simpleabi, tempSigner);
 setContract(tempContract);
 
}
}



const updateEthers = async () => {
  if (window.ethereum) {
 let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
 setProvider(tempProvider);

 let tempSigner = tempProvider.getSigner();
 setSigner(tempSigner);

 let tempContract = new ethers.Contract(contractAddress, Simpleabi, tempSigner);
 setContract(tempContract);
 
}
}

const updateBalance = async () => {
  let balanceBigN = await contract.balanceOf(defaultAccount);
  let balanceNumber = balanceBigN;

  let tokenDecimals = await contract.decimals();

  let tokenBalance = balanceNumber / Math.pow(10, tokenDecimals);

  setBalance(formatter1.format(toFixed(tokenBalance)));
  let usdtoken = tokenBalance * rockPrice;
  setUsdTokenBalance(formatter1.format(usdtoken));
  console.log(toFixed(tokenBalance));
  if(defaultAccount){
    provider.getBalance(defaultAccount)
    .then(balanceResult => {
      let balance = formatter1.format(ethers.utils.formatEther(balanceResult));
      setUserBalance(balance);
      let a = balance*391;
      setUsdBalance(formatter1.format(a));
      
    })
    };

}
function toFixed(x) {
  if (Math.abs(x) < 1.0) {
     var e = parseInt(x.toString().split('e-')[1]);
     if (e) {
        x *= Math.pow(10, e - 1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
     }
  } else {
     var e = parseInt(x.toString().split('+')[1]);
     if (e > 20) {
        e -= 20;
        x /= Math.pow(10, e);
        x += (new Array(e + 1)).join('0');
     }
  }
  return x;
}
const getCurrentVal = async () => {
  let val = await contract.get();
  setCurrentContractVal(val);
}
const updateTokenName = async () => {
  setTokenName(await contract.name());
}
const getPercentClass = (val) => {
  return (val>=0) ? 'success' : 'error';
}
useEffect(() => {
  if (contract != null) {
    updateBalance();
    //updateTokenName();
  }
}, [contract,updateBalance]);





  return (
    
    <DashboardLayout>
      <DashboardNavbar connectWalletHandler={connectWalletHandler} connectbncWalletHandler={connectbncWalletHandler} connButtonText={connButtonText} connBNCButtonText={connBNCButtonText} defaultAccount={defaultAccount} />
      <div style={{ color: '#FFF'}}>{errorMessage}</div> 
    
      <VuiBox py={3}>
        <VuiBox mb={3}>
        <Grid container spacing={2} className="dashboard-background">
          <Grid item xs={12} md={9} xl={9}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Total Balance", subText: "$"+usdTokenBalance +" USD", fontWeight: "regular" }}
                count={ balance +" ROCK" }
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Last 24H Reflections", subText: "$0", fontWeight: "regular" }}
                count={0}
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Reflections Since First Buy", subText: "$0", fontWeight: "regular" }}
                count={0}
              />
            </Grid>
           
           
            <Grid item xs={12} md={4} xl={4}>
            
              <MiniStatisticsCard
                title={{ text: "Rock Circulating Supply" }}
                count= {rockcirculating}
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Totale ROCK Burned" }}
                count={rockBurned}
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Rock Price" }}
                count={rockPrice}
                
              />
            </Grid>
            
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "ROCK Market Cap" }}
                count={'$'+rockMarketCap}
                
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Last 24Hours Volume" }}
                count={'$'+last24hrsVolume}
                
              />
            </Grid>
            <Grid item xs={12} md={4} xl={4}>
              <MiniStatisticsCard
                title={{ text: "Market Rank" }}
                count={'#'+marketRank}
              />
            </Grid>
            </Grid>
            </Grid>
            <Grid item xs={12} md={12} xl={12} style={{height:"420px"}}>
            <coin-stats-chart-widget type="large" coin-id="moonrock" width="100%" chart-height="150"
currency="USD" locale="en" bg-color="none" status-up-color="#74D492" status-down-color="#FE4747"
bg-color="none" text-color="#FFFFFF" buttons-color="#1C1B1B" chart-color="#FFA959"
chart-gradient-from="rgba(255,255,255,0.07)" chart-gradient-to="rgba(0,0,0,0)"
border-color="rgba(255,255,255,0.15)" btc-color="#6DD400" eth-color="#67B5FF"
chart-label-background="#000000" font="Montserrat"
candle-grids-color="rgba(255,255,255,0.1)"></coin-stats-chart-widget>
            </Grid>
          </Grid>
        </VuiBox>
       
        
        
      </VuiBox>

     
      
        <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
