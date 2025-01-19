import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia, baseSepolia } from 'wagmi/chains'
import { defineChain } from 'viem'


// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Leofi',
  description: 'Be a professional crypto trader',
  url: 'https://localhost:3000/', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const metisSepolia = defineChain({
  id: 59902,
  name: 'Metis Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Metis Sepolia',
    symbol: 'METIS',
  },
  rpcUrls: {
    default: { http: ['https://sepolia.metisdevops.link'] },
  },
  blockExplorers: {
    default: {
      name: 'Metis Sepolia Explorer',
      url: 'https://sepolia-explorer.metisdevops.link',
      apiUrl: 'https://sepolia-explorer.metisdevops.link/api',
    },
  },
  contracts: {
  },
});

const ancientTestnet = defineChain({
  id: 28122024,
  name: 'Ancient Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ancient Testnet',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://rpcv2-testnet.ancient8.gg/'] },
  },
  blockExplorers: {
    default: {
      name: 'Ancient Testnet Explorer',
      url: 'https://scanv2-testnet.ancient8.gg/',
      apiUrl: 'https://scanv2-testnet.ancient8.gg/api',
    },
  },
  contracts: {
  },
});

const riseTestnet = defineChain({
  id: 11155931,
  name: 'Rise Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Rise Testnet',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://testnet.riselabs.xyz'] },
  },
  blockExplorers: {
    default: {
      name: 'Rise Testnet Explorer',
      url: 'https://testnet-explorer.riselabs.xyz',
      apiUrl: 'https://testnet-explorer.riselabs.xyz/api',
    },
  },
  contracts: {
  },
});

const somniaTestnet = defineChain({
  id: 50311,
  name: 'Somnia Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Somnia Devnet',
    symbol: 'STT',
  },
  rpcUrls: {
    default: { http: ['https://dream-rpc.somnia.network/'] },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Devnet Explorer',
      url: 'https://somnia-devnet.socialscan.io/',
      apiUrl: 'https://somnia-devnet.socialscan.io/api',
    },
  },
  contracts: {
  },
});

// Create wagmiConfig
const chains = [mainnet, sepolia, metisSepolia, ancientTestnet, riseTestnet, baseSepolia, somniaTestnet] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})