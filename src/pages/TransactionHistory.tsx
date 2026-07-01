import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Transaction, TransactionType } from '../types';
import TransactionItem from '../components/TransactionItem';
import Card from '../components/Card';

const TYPE_LABELS: Record<TransactionType | 'all', string> = {
  all: 'All',
  send: 'Send',
  receive: 'Receive',
  bill_payment: 'Bills',
  mobile_money: 'Mobile',
  merchant: 'Merchant',
  remittance: 'Remittance',
  airtime: 'Airtime',
};

const STATUS_OPTIONS = ['all', 'completed', 'pending', 'failed'] as const;

export default function TransactionHistory() {
  const { transactions } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Transaction['status'] | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          tx.description.toLowerCase().includes(q) ||
          tx.reference.toLowerCase().includes(q) ||
          (tx.counterparty?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [transactions, typeFilter, statusFilter, search]);

  const totalIn = filtered
    .filter((t) => t.amount > 0 && t.status === 'completed')
    .reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered
    .filter((t) => t.amount < 0 && t.status === 'completed')
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  function formatPGK(n: number) {
    return `K ${n.toLocaleString('en-PG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-500 text-sm mt-1">
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Total In</p>
          <p className="text-base font-bold text-green-600">+{formatPGK(totalIn)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Total Out</p>
          <p className="text-base font-bold text-red-600">−{formatPGK(totalOut)}</p>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by description, reference, or counterparty…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          onClick={() => setShowFilters((f) => !f)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
            showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Filter size={16} />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card title="Filters">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Transaction Type</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(TYPE_LABELS) as (TransactionType | 'all')[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      typeFilter === t
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors capitalize ${
                      statusFilter === s
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setTypeFilter('all'); setStatusFilter('all'); setSearch(''); }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Clear all filters
            </button>
          </div>
        </Card>
      )}

      {/* Transaction list */}
      <Card title={`Transactions (${filtered.length})`}>
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Search size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No transactions match your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 -mx-1">
            {filtered.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
