import React, { useState, useContext, useMemo, useCallback } from "react";
import Web3Modal from "web3modal";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { swithNetwork } from "./switch-network";

const uri = "https://bsc-dataseed1.ninicoin.io/"

// NEXT_PUBLIC_NODE_1 = "https://bsc-dataseed1.ninicoin.io"
// NEXT_PUBLIC_NODE_2 = "https://bsc-dataseed1.defibit.io"
// NEXT_PUBLIC_NODE_3 = "https://bsc-dataseed.binance.org"


const DEFAULD_NETWORK = 56;

const Web3Context = React.createContext(null);

export const useWeb3Context = () => {
    const web3Context = useContext(Web3Context);
    if (!web3Context) {
        throw new Error("useWeb3Context() can only be used inside of <Web3ContextProvider />, please declare it at a higher level.");
    }
    const { onChainProvider } = web3Context;
    return useMemo(() => {
        return { ...onChainProvider };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [web3Context]);
};

export const useAddress = () => {
    const { address } = useWeb3Context();
    return address;
};

export const Web3ContextProvider = ({ children }) => {
    const [connected, setConnected] = useState(false);
    const [chainID] = useState(DEFAULD_NETWORK);
    const [providerChainID, setProviderChainID] = useState(DEFAULD_NETWORK);
    const [address, setAddress] = useState("");

    const [provider, setProvider] = useState(new StaticJsonRpcProvider(uri));

    const [web3Modal] = useState(
        new Web3Modal({
            cacheProvider: true,
            providerOptions: {
                walletconnect: {
                    package: WalletConnectProvider,
                    options: {
                        rpc: {
                            56: uri,
                        },
                    },
                },
            },
        }),
    );

    const hasCachedProvider = () => {
        if (!web3Modal) return false;
        if (!web3Modal.cachedProvider) return false;
        return true;
    };

    const _initListeners = useCallback(
        (rawProvider) => {
            if (!rawProvider.on) {
                return;
            }

            rawProvider.on("accountsChanged", () => setTimeout(() => window.location.reload(), 1));

            rawProvider.on("chainChanged", async (chain) => {
                changeNetwork(chain);
            });

            rawProvider.on("network", (_newNetwork, oldNetwork) => {
                if (!oldNetwork) return;
                window.location.reload();
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [provider],
    );

    const changeNetwork = async (otherChainID) => {
        const network = Number(otherChainID);

        setProviderChainID(network);
    };

    const connect = useCallback(async () => {
        const rawProvider = await web3Modal.connect();

        _initListeners(rawProvider);

        const connectedProvider = new Web3Provider(rawProvider, "any");

        const chainId = await connectedProvider.getNetwork().then(network => Number(network.chainId));
        const connectedAddress = await connectedProvider.getSigner().getAddress();

        setAddress(connectedAddress);

        setProviderChainID(chainId);

        if (chainId === 56) {
            setProvider(connectedProvider);
        }

        setConnected(true);

        return connectedProvider;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, web3Modal, connected]);

    const checkWrongNetwork = async () => {
        if (providerChainID !== DEFAULD_NETWORK) {
            const shouldSwitch = window.confirm("Switch to the Binance Smart Chain?");
            if (shouldSwitch) {
                await swithNetwork();
                window.location.reload();
            }
            return true;
        }

        return false;
    };

    const disconnect = useCallback(async () => {
        web3Modal.clearCachedProvider();
        setConnected(false);

        setTimeout(() => {
            window.location.reload();
        }, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, web3Modal, connected]);

    const onChainProvider = useMemo(
        () => ({
            connect,
            disconnect,
            hasCachedProvider,
            provider,
            connected,
            address,
            chainID,
            web3Modal,
            providerChainID,
            checkWrongNetwork,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [connect, disconnect, hasCachedProvider, provider, connected, address, chainID, web3Modal, providerChainID],
    );
        return <Web3Context.Provider value={{ onChainProvider }}>{children}</Web3Context.Provider>;
};
