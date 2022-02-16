

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import React, { useState } from 'react';
import { components } from 'react-select';
import Select from 'react-select';


// @mui material components
import Grid from "@mui/material/Grid";


// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";

  

  

const Moonbridge = () => {
    const [coinsData,setCoinsData] = useState({"coins":[{"id":"bitcoin","icon":"https://static.coinstats.app/coins/Bitcoin6l39t.png","name":"Bitcoin","symbol":"BTC","rank":1,"price":39275.16872440091,"priceBtc":1,"volume":26131484729.562355,"marketCap":744415656726.9862,"availableSupply":18953850,"totalSupply":21000000,"priceChange1h":0.51,"priceChange1d":2.77,"priceChange1w":22.29,"websiteUrl":"http://www.bitcoin.org","twitterUrl":"https://twitter.com/bitcoin","exp":["https://blockchair.com/bitcoin/","https://btc.com/","https://btc.tokenview.com/"]}]});
    const { SingleValue, Option } = components;
    const [selectedOption, setSelectedOption] = useState("none");
    const [selectedSecondOption, setSelectedSecondOption] = useState("none");


    const IconSingleValue = (props) => (
      <SingleValue {...props}>
          <img src={props.data.icon} alt="" style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }}/>
          {props.data.symbol}
      </SingleValue>
  );
  
  
  const IconOption = (props) => (
      <Option {...props}>
          <img src={props.data.icon} alt="" style={{ height: '30px', width: '30px', borderRadius: '50%', marginRight: '10px' }}/>
          {props.data.symbol}
      </Option>
  );
  
  const customStyles = {
    option: (provided) => ({
        ...provided,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        
    }),
    singleValue: (provided) => ({
        ...provided,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
       
    }),
}

    const apiGet = () => {
        fetch("https://api.coinstats.app/public/v1/coins?skip=0&limit=100&currency=USD")
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            setCoinsData(json);
            console.log(coinsData);
          });
      };
      const handleTypeSelect = e => {
        setSelectedOption(e.price);
      };
  return (

   
    <DashboardLayout>
    <DashboardNavbar />
    <VuiBox py={3}>
        <VuiBox mb={3}>
        
        <Grid container spacing={3}>
            <Grid item xs={12} md={12} xl={12}>
            
            <div className="container">
    <div className="row">
      <div className="col-md-4"></div>
      <div className="col-md-4">

      <button onClick={apiGet}>Fetch API</button>
     
      <div>
         
    
    <Select
        width = '60px'
        styles={customStyles}
        onChange={handleTypeSelect}
        components={{SingleValue:IconSingleValue,Option: IconOption}}
        options={coinsData.coins}  
        value={coinsData.coins.filter(function(option) {
          return option.price === selectedOption;
        })}
         />
<br></br>
             
          
        <Select
        styles={customStyles}
        components={{SingleValue:IconSingleValue,Option: IconOption}}
        options={coinsData.coins}   />
          <br></br>
          
         
         
         
          
       
      </div>
       
        {/* {coinsData.map((techCompany) => (

<option value={techCompany.value}>{techCompany.label}</option>

))} */}

     
       

      </div>
      <div className="col-md-4"></div>
    </div>
  </div>
                
            </Grid>
         </Grid>
        </VuiBox>
    </VuiBox>

    <Footer />
    </DashboardLayout>
  )
}

export default Moonbridge