import { useState, useEffect } from 'react';
import { Address, Hash } from 'viem';
import { usePublicClient } from 'wagmi';

export interface TransactionStatus {
  status: 'pending' | 'success' | 'failed';
  confirmations: number;
  hash: Hash;
  error?: Error;
}

export function useTransactionMonitor(hash?: Hash) {
  const [status, setStatus] = useState<TransactionStatus | null>(null);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!hash) {
      setStatus(null);
      return;
    }

    setStatus({ status: 'pending', confirmations: 0, hash });

    const unwatch = publicClient.watchTransaction({
      hash,
      onReplaced: (replacement) => {
        // Handle transaction replacement (e.g., speedup)
        setStatus({
          status: 'pending',
          confirmations: 0,
          hash: replacement.transactionHash,
        });
      },
      async onError(error) {
        setStatus(prev => prev ? { ...prev, status: 'failed', error } : null);
      },
      async onConfirm(transaction) {
        const receipt = await publicClient.getTransactionReceipt({ hash });
        setStatus(prev => prev ? {
          ...prev,
          status: 'success',
          confirmations: receipt.confirmations || 1,
        } : null);
      },
    });

    return () => {
      unwatch?.();
    };
  }, [hash, publicClient]);

  return status;
}
