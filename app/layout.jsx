'use client';
import '@rainbow-me/rainbowkit/styles.css';
import {
        RainbowKitProvider,
        } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
        QueryClientProvider,
        QueryClient,
        } from "@tanstack/react-query";
import {config} from './config/wallet.js';
import './globals.css';
import Link from 'next/link';
import ConnectButtonWrapper from './components/ConnectButtonWrapper'; // 👈 Import komponen baru

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return <html lang="en">
            <body>
              <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                  <RainbowKitProvider>
                    <header className="header"> 
                      <div className="navbar">
                        <div className="router">
                          <Link href="/" className="custom-gradient-text">
                            TipMe
                          </Link>
                          <Link href="/create-donation">Create!</Link>
                          <Link href="/explore">Explore</Link>
                        </div>
                        <div className="connectButton">
                          <ConnectButtonWrapper />
                        </div>
                      </div>
                    </header>
                    {children} 
                  </RainbowKitProvider>
                </QueryClientProvider>
              </WagmiProvider>
            </body>
          </html>
};