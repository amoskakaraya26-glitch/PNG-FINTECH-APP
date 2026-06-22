import { Link } from 'react-router-dom';
import {
  Send,
  Smartphone,
  Receipt,
  QrCode,
  Globe,
  TrendingUp,
  TrendingDown,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPGK } from '../data/paymentData';
import TransactionItem from '../components/TransactionItem';
import Card from '../components/Card';

const QUICK_ACTIONS = [
  { to: '/send', label: 'Send Money', icon: Send, color: 'bg-blue-500' },
  { to: '/mobile-money', label: 'Mobile Money', icon: Smartphone, color: 'bg-purple-500' },
  { to: '/bill-payments', label: 'Pay Bills', icon: Receipt, color: 'bg-orange-500' },
  { to: '/merchant', label: 'Merchant Pay', icon: QrCode, color: 'bg-green-500' },
  { to: '/remittance', label: 'Remittance', icon: Globe, color: 'bg-teal-500' },
];

export default function Dashboard() {
  const { accounts, transactions, primaryAccount } = useApp();

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const recentTx = transactions.slice(0, 5);

  const monthlyIn = transactions
    .filter((t) => t.amount > 0 && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0);
  const monthlyOut = transactions
    .filter((t) => t.amount < 0 && t.status === 'completed')
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good Morning 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back to PNG FinPay</p>
      </div>

      {/* Primary account hero */}
      <div className="relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 text-white overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-blue-600/30" />
        <div className="absolute -bottom-12 -left-8 w-52 h-52 rounded-full bg-blue-800/30" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={16} className="opacity-70" />
            <span className="text-sm opacity-70">{primaryAccount.bank}</span>
          </div>
          <p className="text-sm opacity-70 mb-1">{primaryAccount.accountNumber}</p>
          <p className="text-4xl font-bold tracking-tight">{formatPGK(primaryAccount.balance)}</p>
          <p className="text-sm opacity-70 mt-1">{primaryAccount.name}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-xs text-gray-500 font-medium">Money In</span>
          </div>
          <p className="text-lg font-bold text-green-600">+{formatPGK(monthlyIn)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-red-500" />
            <span className="text-xs text-gray-500 font-medium">Money Out</span>
          </div>
          <p className="text-lg font-bold text-red-600">−{formatPGK(monthlyOut)}</p>
        </div>
      </div>

      {/* All accounts */}
      <Card title="My Accounts">
        <div className="space-y-3">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{acc.name}</p>
                <p className="text-xs text-gray-500">{acc.bank} · {acc.accountNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{formatPGK(acc.balance)}</p>
                {acc.isPrimary && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">
                    Primary
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold text-gray-800 pt-2 border-t border-gray-100 px-3">
            <span>Total Balance</span>
            <span>{formatPGK(totalBalance)}</span>
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {QUICK_ACTIONS.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className={`${color} text-white p-3 rounded-xl group-hover:scale-105 transition-transform`}>
                <Icon size={20} />
              </div>
              <span className="text-xs text-gray-600 text-center font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent transactions */}
      <Card
        title="Recent Transactions"
        action={
          <Link to="/history" className="text-xs text-blue-600 hover:underline font-medium">
            View all
          </Link>
        }
      >
        <div className="divide-y divide-gray-50 -mx-1">
          {recentTx.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      </Card>
    </div>
  );
}
