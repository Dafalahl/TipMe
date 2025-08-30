// transfer7702.jsx
import { useState } from 'react';
import { createPublicClient, http, getContract, hexToBigInt, encodePacked } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  createBundlerClient,
  toSimple7702SmartAccount,
} from "viem/account-abstraction";
import { erc20Abi } from "viem";
import { useChainId } from "wagmi";
import { chainData, usdcData, paymasterData } from "../config/wallet.js";
import { signPermit } from "./permit.js";
import { isAddress } from 'viem';
import styles from './TransferForm.module.css';

export default function Transfer7702({ targetAddress , ValueUsdc }) {
    
    const chainId = useChainId();
    const [isSending, setIsSending] = useState(false);
    const [txHash, setTxHash] = useState(null);
    const [error, setError] = useState(null);

    async function handleTransfer() {
        setError(null);
        setTxHash(null);
        setIsSending(true);
        
        if (!targetAddress || !isAddress(targetAddress)) {
          setError("Alamat tujuan tidak valid.");
          setIsSending(false);
          return;
        }

        try {
            const chain = chainData[chainId];
            const usdcAddress = usdcData[chainId];

            // PENTING: PRIVATE KEY SEBAGAI CONTOH SAJA, TIDAK AMAN DI FRONTEND
            const ownerPrivateKey = process.env.NEXT_PUBLIC_OWNER_PRIVATE_KEY; 
            if (!ownerPrivateKey) {
              throw new Error("Kunci privat tidak ditemukan. Harap tambahkan OWNER_PRIVATE_KEY di file .env.local");
            }

            const client = createPublicClient({ chain, transport: http() });
            const owner = privateKeyToAccount(ownerPrivateKey);
            const account = await toSimple7702SmartAccount({ client, owner  });
            console.log("Akun 7702:", account);

            const usdc = getContract({ client, address: usdcAddress, abi: erc20Abi });
            const usdcBalance = await usdc.read.balanceOf([account.address]);

            if (usdcBalance < 1000000) {
                setError(`Dana ${account.address} dengan USDC di ${client.chain.name} menggunakan https://faucet.circle.com, lalu coba lagi.`);
                setIsSending(false);
                return;
            }

            const paymasterAddress = paymasterData[chainId];
            const paymaster = {
                async getPaymasterData(parameters) {
                    const permitAmount = 100000n;
                    const permitSignature = await signPermit({
                        tokenAddress: usdcAddress,
                        account,
                        client,
                        spenderAddress: paymasterAddress,
                        permitAmount: permitAmount,
                    });

                    const paymasterData = encodePacked(
                        ["uint8", "address", "uint256", "bytes"],
                        [0, usdcAddress, permitAmount, permitSignature],
                    );

                    return {
                        paymaster: paymasterAddress,
                        paymasterData,
                        paymasterVerificationGasLimit: 200000n,
                        paymasterPostOpGasLimit: 15000n,
                        isFinal: true,
                    };
                },
            };

            const bundlerClient = createBundlerClient({
                account,
                client,
                paymaster,
                userOperation: {
                    estimateFeesPerGas: async ({ bundlerClient }) => {
                        const { standard: fees } = await bundlerClient.request({
                            method: "pimlico_getUserOperationGasPrice",
                        });
                        const maxFeePerGas = hexToBigInt(fees.maxFeePerGas);
                        const maxPriorityFeePerGas = hexToBigInt(fees.maxPriorityFeePerGas);
                        return { maxFeePerGas, maxPriorityFeePerGas };
                    },
                },
                transport: http(`https://public.pimlico.io/v2/${client.chain.id}/rpc`),
            });

            // Sign authorization for 7702 account
            const authorization = await owner.signAuthorization({
                chainId: chain.id,
                nonce: await client.getTransactionCount({ address: owner.address }),
                contractAddress: account.authorization.address,
            });
            const ValueTransfer = BigInt(ValueUsdc) * 10n ** 6n; // Konversi ke wei (6 desimal untuk USDC)

            const hash = await bundlerClient.sendUserOperation({
                account,
                calls: [
                    {
                        to: usdc.address,
                        abi: usdc.abi,
                        functionName: "transfer",
                        args: [targetAddress, ValueTransfer],
                    },
                ],
                authorization: authorization,
            });
            

            console.log("UserOperation hash", hash);
            const receipt = await bundlerClient.waitForUserOperationReceipt({ hash });
            setTxHash(receipt.receipt.transactionHash);
            console.log("Transaction hash", receipt.receipt.transactionHash);

        } catch (err) {
            console.error("Gagal mengirim UserOperation:", err);
            setError(`Gagal mengirim transaksi: ${err.message}`);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div>
            <button 
                onClick={handleTransfer} 
                disabled={isSending}
                className={styles.sendButton}
            
            >
                {isSending ? 'Mengirim...' : 'Kirim USDC'}
            </button>
            {isSending && <p>Tunggu sebentar, transaksi sedang diproses...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {txHash && (
                <p>
                    Berhasil!{' '}
                    <a 
                        href={`${chainData[chainId]?.blockExplorers?.default.url}/tx/${txHash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'blue', textDecoration: 'underline' }}
                    >
                        Lihat Transaksi
                    </a>
                </p>
            )}
        </div>
    );
}