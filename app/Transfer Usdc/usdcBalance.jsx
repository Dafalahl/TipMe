// UsdcBalance.jsx
import { useChainId, useAccount } from "wagmi";
import { useEffect, useState } from 'react';
import { createPublicClient, http, getContract, formatUnits, erc20Abi } from "viem";
import { usdcData, chainData } from "../config/wallet.js";

export default function UsdcBalance() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const [usdcBalance, setUsdcBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isConnected || !address || !chainId) {
            setUsdcBalance(null);
            setIsLoading(false);
            return;
        }

        async function fetchUsdcBalance() {
            setIsLoading(true);
            setError(null);
            setUsdcBalance(null);
            try {
                const chain = chainData[chainId];
                const usdcAddress = usdcData[chainId];
                
                const client = createPublicClient({ chain, transport: http() });
                const usdc = getContract({ client, address: usdcAddress, abi: erc20Abi });

                const balanceInWei = await usdc.read.balanceOf([address]);
                // 👇 Perbaikan di sini! Menggunakan parseFloat().toFixed(2) untuk membulatkan saldo.
                const balanceFormatted = parseFloat(formatUnits(balanceInWei, 6)).toFixed(2);
                setUsdcBalance(balanceFormatted);
            } catch (err) {
                console.error("Gagal mengambil saldo USDC:", err);
                setError("Gagal memuat saldo.");
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchUsdcBalance();

    }, [address, chainId, isConnected]);

    return (
        <p>
            {isLoading && "Memuat saldo..."}
            {error && `Error: ${error}`}
            {usdcBalance && `Saldo USDC Anda: ${usdcBalance}`}
        </p>
    )
}