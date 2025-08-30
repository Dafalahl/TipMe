// wallet.js

import {
  arbitrumSepolia,
  avalancheFuji,
  baseSepolia,
  optimismSepolia,
  sepolia,
  polygonAmoy,
  unichainSepolia,
} from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

const supportedChains = [
  sepolia,
  arbitrumSepolia,
  avalancheFuji,
  baseSepolia,
  optimismSepolia,
  polygonAmoy,
  unichainSepolia,
];

export const config = getDefaultConfig({
  appName: 'AGF',
  projectId: 'YOUR_PROJECT_ID', // GANTI DENGAN PROJECT ID ANDA
  chains: supportedChains,
  ssr: true,
});

export const chainData = supportedChains.reduce((acc, chain) => {
  acc[chain.id] = chain;
  return acc;
}, {});

// Alamat paymaster ini sudah benar (checksum sudah diperbaiki)
export const paymasterData = {
  [arbitrumSepolia.id]: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
  [avalancheFuji.id]: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
  [baseSepolia.id]: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
  [sepolia.id]: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
  [optimismSepolia.id]: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
  [polygonAmoy.id]: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
  [unichainSepolia.id]: "0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966",
};

// ALAMAT-ALAMAT USDC YANG SUDAH DIPERBAIKI
export const usdcData = {
  [arbitrumSepolia.id]: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  [avalancheFuji.id]: "0x5425890298aed601595a70AB815c96711a31Bc65",
  [baseSepolia.id]: "0x0A364f2601841687A2Ab20592944b592102D37F3",
  [sepolia.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7a90",
  [optimismSepolia.id]: "0x5fd84259d66Cd46123540776Be93d94269213e84",
  [polygonAmoy.id]: "0x41e94Eb019C0762f9BFC4545d5C5D863f4177252",
  [unichainSepolia.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7a90",
};