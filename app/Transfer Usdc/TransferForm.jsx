// components/TransferForm.jsx
'use client';

import { useState } from 'react';
import Transfer7702 from '@/app/Transfer Usdc/transfer7702';
import UsdcBalance from '@/app/Transfer Usdc/usdcBalance';
import { useAccount } from 'wagmi';
import styles from './TransferForm.module.css'; 

export default function TransferForm({ targetAddress }) {
  const [inputValue, setInputValue] = useState('');
  const [usdcValue, setUsdcValue] = useState('');
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <p>Harap hubungkan dompet untuk berdonasi.</p>;
  }

  return (
     <div className={styles.formLayout}>
      <p className={styles.balanceText}>
        <UsdcBalance />
      </p>
      <input
        type="text"
        value={usdcValue}
        onChange={(e) => setUsdcValue(e.target.value)}
        placeholder="Masukkan jumlah..."
        className={styles.inputField}
      />
      <Transfer7702 targetAddress={targetAddress} ValueUsdc={usdcValue} />
    </div>
  );
}