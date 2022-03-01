import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useState, useEffect } from "react";

const providerOptions = {
  // metamask: {
  //   id: 'injected',
  //   name: 'MetaMask',
  //   type: 'injected',
  //   check: 'isMetaMask'
  // },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: '8017fee489474239bae3738e3dbb457d', // Required
      // network: 'rinkeby',
      qrcodeModalOptions: {
        mobileLinks: [
        'rainbow',
        'metamask',
        'argent',
        'trust',
        'imtoken',
        'pillar'
        ]
      }
    }
  } 
};
const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions
});

export default function Walletmodel() {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  useEffect(() => {
    const checkAccount = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setAccount(accounts[0]);
    }
    checkAccount()
  }, []);
  return {
    get providerLoading() {
      return loading
    },
    getAccount() {
      return account
    },
    async connectWallet() {
      setLoading(true);      
      const provider = await web3Modal.connect();
      
      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts) => {
        console.log(accounts);
        setAccount(accounts[0])
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        console.log(chainId);
      });

      // Subscribe to provider connection
      provider.on("connect", (info) => {
        console.log(info);
      });

      // Subscribe to provider disconnection
      provider.on("disconnect", (error) => {
        console.log(error);
      });
      setLoading(false);
      return provider
    },
    async disconnectWallet() {
      web3Modal.clearCachedProvider();
    }
  }
}