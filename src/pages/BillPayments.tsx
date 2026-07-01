import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BILL_PROVIDERS, formatPGK } from '../data/paymentData';
import type { BillCategory, BillProvider, Transaction } from '../types';
import Card from '../components/Card';
import SuccessModal from '../components/SuccessModal';
import { genRef } from '../utils/genRef';

const CATEGORIES: { id: BillCategory; label: string; emoji: string }[] = [
  { id: 'electricity', label: 'Electricity', emoji: '⚡' },
  { id: 'water', label: 'Water', emoji: '💧' },
  { id: 'telecom', label: 'Telecom', emoji: '📡' },
  { id: 'tax', label: 'Tax', emoji: '🏛️' },
  { id: 'government', label: 'Government', emoji: '🏢' },
  { id: 'insurance', label: 'Insurance', emoji: '🛡️' },
  { id: 'education', label: 'Education', emoji: '🎓' },
  { id: 'health', label: 'Health', emoji: '🏥' },
];

export default function BillPayments() {
  const { primaryAccount, addTransaction } = useApp();
  const [category, setCategory] = useState<BillCategory>('electricity');
  const [provider, setProvider] = useState<BillProvider | null>(null);
  const [accountField, setAccountField] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ ref: string; amount: string; provider: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredProviders = BILL_PROVIDERS.filter((p) => p.category === category);

  function handleCategoryChange(cat: BillCategory) {
    setCategory(cat);
    setProvider(null);
    setAccountField('');
    setAmount('');
    setErrors({});
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!provider) e.provider = 'Select a provider';
    if (!accountField.trim()) e.accountField = 'This field is required';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      e.amount = 'Enter a valid amount';
    if (Number(amount) > primaryAccount.balance)
      e.amount = 'Insufficient balance';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length || !provider) return;

    setLoading(true);
    const ref = genRef('BILL');
    setTimeout(() => {
      const tx: Transaction = {
        id: 'tx-' + Date.now(),
        type: 'bill_payment',
        description: `${provider.name} – ${accountField}`,
        amount: -Number(amount),
        currency: 'PGK',
        status: 'completed',
        date: new Date().toISOString(),
        reference: ref,
        counterparty: provider.name,
      };
      addTransaction(tx);
      setLoading(false);
      setSuccess({ ref, amount: formatPGK(Number(amount)), provider: provider.name });
    }, 1200);
  }

  function handleClose() {
    setSuccess(null);
    setAccountField('');
    setAmount('');
    setProvider(null);
  }

  const inputCls = (field: string) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bill Payments</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pay utility bills, taxes, insurance and more
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm text-blue-700 font-medium">Available Balance</span>
        <span className="text-lg font-bold text-blue-800">{formatPGK(primaryAccount.balance)}</span>
      </div>

      {/* Category selector */}
      <Card title="Category">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all ${
                category === cat.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Provider selector */}
      <Card title="Select Provider">
        {filteredProviders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No providers in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProviders.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProvider(p);
                  setAccountField('');
                  setErrors({});
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  provider?.id === p.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{p.logo}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 truncate">{p.accountFieldLabel}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Payment form */}
      {provider && (
        <Card title={`Pay ${provider.name}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {provider.accountFieldLabel}
              </label>
              <input
                type="text"
                placeholder={`Enter your ${provider.accountFieldLabel.toLowerCase()}`}
                value={accountField}
                onChange={(e) => setAccountField(e.target.value)}
                className={inputCls('accountField')}
              />
              {errors.accountField && (
                <p className="text-xs text-red-500 mt-1">{errors.accountField}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PGK)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">K</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`${inputCls('amount')} pl-7`}
                />
              </div>
              {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
            </div>

            {/* Quick amounts for utility bills */}
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 500].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(String(v))}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    amount === String(v)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  K {v}
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Provider</span>
                <span className="font-medium text-gray-800">{provider.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Processing Fee</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Processing…' : 'Pay Bill'}
            </button>
          </form>
        </Card>
      )}

      {success && (
        <SuccessModal
          title="Payment Successful!"
          message={`${success.amount} paid to ${success.provider}.`}
          reference={success.ref}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
