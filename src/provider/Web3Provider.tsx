"use client";
import { FC } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { type Chain } from "viem";

interface MetaMaskProviderProps {
  children: React.ReactNode;
}

const metis_sepolia: Chain = {
  id: 59_902,
  name: "Metis Sepolia Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Metis Sepolia Testnet",
    symbol: "tMETIS",
  },
  rpcUrls: {
    default: { http: ["https://sepolia.metisdevops.link	"] },
  },
  blockExplorers: {
    default: {
      name: "Metis Sepolia Testnet explorer",
      url: "https://sepolia-explorer.metisdevops.link/",
    },
  },
  testnet: true,
};

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [metis_sepolia],
    transports: {
      // RPC URL for each chain
      // [metis.id]: http(`https://metis-pokt.nodies.app`),
      [metis_sepolia.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",

    // Required App Info
    appName: "Leofi",
  })
);

const queryClient = new QueryClient();

export const Web3Provider: FC<MetaMaskProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
