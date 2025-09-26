import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi'
import {
  mainnet,
  sepolia
} from 'wagmi/chains';
export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'bb602813dea5ab69c70edeb01add2240',
  chains: [mainnet, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});