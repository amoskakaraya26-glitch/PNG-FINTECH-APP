import type { Transaction } from '../types';
import { formatPGK } from '../data/paymentData';
import { ArrowUpRight, ArrowDownLeft, Receipt, Smartphone, QrCode, Globe } from 'lucide-react';

const STATUS_STYLES: Record<Transaction['status'], string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
};

const TYPE_ICONS: Record<Transaction['type'], React.ComponentType<{ size?: number; className?: string }>> = {
  send: ArrowUpRight,
  receive: ArrowDownLeft,
  bill_payment: Receipt,
  mobile_money: Smartphone,
  merchant: QrCode,
  remittance: Globe,
  airtime: Smartphone,
};

const TYPE_COLORS: Record<Transaction['type'], string> = {
  send: 'bg-red-100 text-red-600',
  receive: 'bg-green-100 text-green-600',
  bill_payment: 'bg-blue-100 text-blue-600',
  mobile_money: 'bg-purple-100 text-purple-600',
  merchant: 'bg-orange-100 text-orange-600',
  remittance: 'bg-teal-100 text-teal-600',
  airtime: 'bg-indigo-100 text-indigo-600',
};

interface Props {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: Props) {
  const Icon = TYPE_ICONS[transaction.type];
  const isDebit = transaction.amount < 0;
  const date = new Date(transaction.date).toLocaleDateString('en-PG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`flex-shrink-0 p-2 rounded-full ${TYPE_COLORS[transaction.type]}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{transaction.description}</p>
        <p className="text-xs text-gray-500">{date} · {transaction.reference}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-semibold ${isDebit ? 'text-red-600' : 'text-green-600'}`}>
          {isDebit ? '−' : '+'}{formatPGK(transaction.amount)}
        </p>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[transaction.status]}`}>
          {transaction.status}
        </span>
      </div>
    </div>
  );
}
