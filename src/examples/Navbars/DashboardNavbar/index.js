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

import { useState, useEffect } from "react";

// react-router components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from '@mui/material/MenuItem';
import Icon from "@mui/material/Icon";
// import Grid from "@mui/material/Grid";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
// import VuiTypography from "components/VuiTypography";
// import VuiInput from "components/VuiInput";

// Vision UI Dashboard React example components
import Breadcrumbs from "examples/Breadcrumbs";
// import NotificationItem from "examples/Items/NotificationItem";
// import {ethers} from 'ethers'
// import Simpleabi from 'contract/Simpleabi.json'

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  // navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Vision UI Dashboard React context
import {
  useVisionUIController,
  setTransparentNavbar,
  setMiniSidenav,
  // setOpenConfigurator,
} from "context";

import { useWeb3Context, useAddress } from 'utils/web3-context'

// Images
// import team2 from "assets/images/team-2.jpg";
// import logoSpotify from "assets/images/small-logos/logo-spotify.svg";

function DashboardNavbar({
  absolute,
  light,
  isMini,
}) {
  // const { connect, disconnect, connected, providerChainID, checkWrongNetwork, provider, hasCachedProvider, chainID } = useWeb3Context();
  const { connect, disconnect } = useWeb3Context();
  const address = useAddress();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar } = controller;
  // const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  // const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  // const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  // const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <VuiBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          {/* <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} /> */}
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </VuiBox>
       
        {isMini ? null : (
          <VuiBox sx={(theme) => navbarRow(theme, { isMini })}>
           <div>
          <div>	
            <div style={{ display: 'flex'}}> 
              {/* <div style={{ color: '#FFF',marginRight:"10px"}}>{accountNo }</div>     */}
            {/* {(connBNCButtonText=='Disconnect Wallet') ? 
			        '' : <button style={{ marginRight:"10px"}} className={ (connButtonText=='Disconnect Wallet') ? 'btn btn-success' : 'btn btn-primary' } onClick={connectWalletHandler}>{connButtonText}</button>
             } */}

            {/* <button
              style={{ marginRight:"10px"}}
              className={ (connButtonText=='Disconnect Wallet') ? 'btn btn-success' : 'btn btn-primary' }
              onClick={connectWalletHandler}
            >
              {connButtonText}
            </button> */}
            {!address ? (
              <Button 
                variant="contained"
                onClick={connect}
                sx={{
                  mr: '10px',
                  color: '#fff!important',
                  fontSize: 16
                }}
              >
                Connect Wallet
              </Button>
            ) : (
              <>
                <Button
                  id="basic-button"
                  variant="contained"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    mr: '10px',
                    color: '#fff!important',
                    fontSize: 16
                  }}
                >
                  {address.replace(/(.{6}).*(.{4})/, '$1...$2')}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={() => setAnchorEl(null)}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem
                    onClick={disconnect}
                    sx={{
                      color: '#1a2027',
                      backgroundColor: '#fff',
                      p: '10px 20px',
                      "&:hover": {
                        color: '#1a2027!important',
                        backgroundColor: '#fff!important',
                      }
                    }}
                  >
                    Disconnect
                  </MenuItem>
                </Menu>
              </>
            )}

              {/* {(connButtonText=='Disconnect Wallet') ? 
             '': <button className={ (connBNCButtonText=='Disconnect Wallet') ? 'btn btn-success' : 'btn btn-primary' } onClick={connectbncWalletHandler}>{connBNCButtonText}</button>	 
              } */}
             </div>
          </div>
        </div>
            {/* <VuiBox pr={1}>
          
              <VuiInput
                placeholder="Type here..."
                icon={{ component: "search", direction: "left" }}
                sx={({ breakpoints }) => ({
                  [breakpoints.down("sm")]: {
                    maxWidth: "80px",
                  },
                  [breakpoints.only("sm")]: {
                    maxWidth: "80px",
                  },
                  backgroundColor: "info.main !important",
                })}
              />
            </VuiBox> */}
            <VuiBox color={light ? "white" : "inherit"}>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={"text-white"}>{miniSidenav ? "menu_open" : "menu"}</Icon>
              </IconButton>
             
            
            </VuiBox>
          </VuiBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
