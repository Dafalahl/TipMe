'use client';

import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { usdcData } from "../config/wallet.js";
import { isAddress } from 'viem';
import styles from './donationDetail.module.css';

const usdcAbi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "type": "function"
  }
];

export default function CheckBalance({ targetAddress, chainId, maxAmount = 20 }) {
    const usdcContractAddress = usdcData[chainId];

    if (!usdcContractAddress || !isAddress(usdcContractAddress)) {
      return <p>Memuat....</p>;
    }

    const { data: balance, isPending, error } = useReadContract({
      address: usdcContractAddress,
      abi: usdcAbi,
      functionName: 'balanceOf',
      args: [targetAddress],
      enabled: isAddress(usdcContractAddress),
    });

    if (isPending) {
      return <p>Memuat saldo...</p>;
    }

    if (error) {
      return <p>Gagal memuat saldo: {error.message}</p>;
    }

    const formattedBalance = balance ? parseFloat(formatUnits(balance, 6)).toFixed(2) : '0';
    const balanceNumber = parseFloat(formattedBalance);
    const progressPercentage = Math.min((balanceNumber / maxAmount) * 100, 100);

    return (
      <div className={styles.progressContainer}>
        <div className={styles.progressLabel}>
          <span>0 USDC</span>
          <span>{maxAmount} USDC</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className={styles.progressValue}>
          {formattedBalance} USDC terkumpul
        </div>
      </div>
    );
}