'use client'
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import CusMenubar from './components/cusMenubar';
import {
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { config } from '@/app/wagmi';
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <CusMenubar></CusMenubar>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
