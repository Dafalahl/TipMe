'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function ConnectButtonWrapper() {
  const { isConnecting } = useAccount();

  if (isConnecting) {
    return <div className="connectButtonPlaceholder"></div>;
  }

  return <ConnectButton />;
}