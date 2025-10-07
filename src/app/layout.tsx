"use client";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { WalletProvider, ChainsConfig } from "../wallet-sdk/";
import { ethers } from "ethers";
import type { Wallet } from '@/wallet-sdk/types'
import { metaMaskWallet } from '../wallet-sdk/connectors/metamask'
import CusMenubar from './components/cusMenubar';


declare global {
  interface Window {
    ethereum?: any;
  }
}

const chains = ChainsConfig;

const window = globalThis.window as Window;
let provider: unknown = null;
if (window?.ethereum) {
  provider = new ethers.BrowserProvider(window.ethereum);
}


const wallets: Wallet[] = [metaMaskWallet];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WalletProvider
          chains={chains}
          wallets={wallets}
          provider={provider}
          autoConnect={true}>
          <CusMenubar></CusMenubar>

          {children}
        </WalletProvider>
      </body>
    </html>
  );
}