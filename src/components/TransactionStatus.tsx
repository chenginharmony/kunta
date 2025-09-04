import { Hash } from 'viem';
import { useTransactionMonitor } from '../hooks/useTransactionMonitor';

interface TransactionStatusProps {
  hash?: Hash;
  onSuccess?: () => void;
}

export function TransactionStatus({ hash }: TransactionStatusProps) {
  const status = useTransactionMonitor(hash);

  if (!status) return null;

  const statusColors = {
    pending: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    failed: 'bg-red-100 border-red-500 text-red-700',
  };

  const statusMessages = {
    pending: 'Transaction Pending',
    success: 'Transaction Confirmed',
    failed: 'Transaction Failed',
  };

  const color = statusColors[status.status];
  const message = statusMessages[status.status];

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border ${color} shadow-lg`}>
      <div className="flex items-center gap-2">
        {status.status === 'pending' && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {status.status === 'success' && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {status.status === 'failed' && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        <span className="font-medium">{message}</span>
      </div>
      {status.status === 'pending' && (
        <div className="mt-2 text-sm">
          Waiting for confirmations ({status.confirmations})
        </div>
      )}
      {status.error && (
        <div className="mt-2 text-sm">{status.error.message}</div>
      )}
      <div className="mt-2 text-xs opacity-75">
        <a
          href={`https://etherscan.io/tx/${status.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          View on Etherscan
        </a>
      </div>
    </div>
  );
}
