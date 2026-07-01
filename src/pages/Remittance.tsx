import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REMITTANCE_PROVIDERS, EXCHANGE_RATES, formatPGK } from '../data/paymentData';
import type { Currency, RemittanceProvider, Transaction } from '../types';
import Card from '../components/Card';
import SuccessModal from '../components/SuccessModal';
import { genRef } from '../utils/genRef';

type Direction = 'send' | 'receive';

export default function Remittance() {
  const { primaryAccount, addTransaction } = useApp();
  const [direction, setDirection] = useState<Direction>('send');
  const [provider, setProvider] = useState<RemittanceProvider>(REMITTANCE_PROVIDERS[0]);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [foreignAmount, setForeignAmount] = useState('');
  const [pgkAmount, setPgkAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientCountry, setRecipientCountry] = useState('Australia');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ ref: string; amount: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Derived calculations
  const foreignNum = parseFloat(foreignAmount) || 0;
  const pgkEquivalent = foreignNum > 0 ? foreignNum / EXCHANGE_RATES[currency] : 0;
  const totalCost = direction === 'send' ? pgkEquivalent + provider.fee : 0;

  function handleForeignChange(val: string) {
    setForeignAmount(val);
    const num = parseFloat(val) || 0;
    setPgkAmount(num > 0 ? (num / EXCHANGE_RATES[currency]).toFixed(2) : '');
  }

  function handlePgkChange(val: string) {
    setPgkAmount(val);
    const num = parseFloat(val) || 0;
    setForeignAmount(num > 0 ? (num * EXCHANGE_RATES[currency]).toFixed(2) : '');
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!recipientName.trim()) e.recipientName = 'Enter recipient name';
    if (!recipientAccount.trim()) e.recipientAccount = 'Enter recipient account / reference';
    const pgkVal = parseFloat(pgkAmount) || 0;
    if (pgkVal <= 0) e.amount = 'Enter a valid amount';
    if (direction === 'send' && totalCost > primaryAccount.balance)
      e.amount = `Insufficient balance (need ${formatPGK(totalCost)})`;
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const ref = genRef('REM');
    const pgkVal = parseFloat(pgkAmount);
    setTimeout(() => {
      const tx: Transaction = {
        id: 'tx-' + Date.now(),
        type: 'remittance',
        description: `${provider.name} – ${direction === 'send' ? 'Send to' : 'Receive from'} ${recipientCountry}`,
        amount: direction === 'send' ? -(pgkVal + provider.fee) : pgkVal,
        currency: 'PGK',
        status: 'completed',
        date: new Date().toISOString(),
        reference: ref,
        counterparty: provider.name,
      };
      addTransaction(tx);
      setLoading(false);
      setSuccess({ ref, amount: formatPGK(pgkVal) });
    }, 1500);
  }

  function handleClose() {
    setSuccess(null);
    setForeignAmount('');
    setPgkAmount('');
    setRecipientName('');
    setRecipientAccount('');
    setErrors({});
  }

  const inputCls = (field: string) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  const DESTINATION_COUNTRIES = ['Australia', 'New Zealand', 'United States', 'United Kingdom', 'Fiji', 'Vanuatu', 'Solomon Islands'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">International Remittance</h1>
        <p className="text-gray-500 text-sm mt-1">
          Send or receive money internationally using trusted providers
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm text-blue-700 font-medium">Available Balance</span>
        <span className="text-lg font-bold text-blue-800">{formatPGK(primaryAccount.balance)}</span>
      </div>

      {/* Direction toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {(['send', 'receive'] as Direction[]).map((d) => (
          <button
            key={d}
            onClick={() => { setDirection(d); setErrors({}); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors capitalize ${
              direction === d ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            {d === 'send' ? '📤 Send Abroad' : '📥 Receive from Abroad'}
          </button>
        ))}
      </div>

      {/* Provider selector */}
      <Card title="Select Provider">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {REMITTANCE_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p)}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                provider.id === p.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{p.logo}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                <p className="text-xs text-gray-500">
                    Fee: {formatPGK(p.fee)} · Rate: {p.fxRate} PGK/{currency}
                  </p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Currency and amount */}
      <Card title="Amount & Currency">
        <div className="space-y-4">
          {/* Currency selection */}
          <div className="flex gap-2">
            {(['USD', 'AUD'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => { setCurrency(c); setForeignAmount(''); setPgkAmount(''); }}
                className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors ${
                  currency === c
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {c === 'USD' ? '🇺🇸 USD' : '🇦🇺 AUD'}
              </button>
            ))}
          </div>

          {/* Exchange rate display */}
          <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center gap-2 text-sm">
            <span className="font-mono font-bold">1 {currency}</span>
            <ArrowRight size={14} className="text-gray-400" />
            <span className="font-mono font-bold text-blue-700">
              {(1 / EXCHANGE_RATES[currency]).toFixed(2)} PGK
            </span>
            <span className="text-gray-400 text-xs ml-1">via {provider.name}</span>
          </div>

          {/* Amount inputs */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Amount ({currency})</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{currency}</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={foreignAmount}
                  onChange={(e) => handleForeignChange(e.target.value)}
                  className={`${inputCls('amount')} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Amount (PGK)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">K</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={pgkAmount}
                  onChange={(e) => handlePgkChange(e.target.value)}
                  className={`${inputCls('amount')} pl-7`}
                />
              </div>
            </div>
          </div>
          {errors.amount && <p className="text-xs text-red-500">{errors.amount}</p>}
        </div>
      </Card>

      {/* Recipient details */}
      <Card title={direction === 'send' ? 'Recipient Details' : 'Sender Details'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Recipient's full name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className={inputCls('recipientName')}
            />
            {errors.recipientName && <p className="text-xs text-red-500 mt-1">{errors.recipientName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={recipientCountry}
              onChange={(e) => setRecipientCountry(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DESTINATION_COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {direction === 'send' ? 'Bank Account / Wallet Number' : 'Reference / MTCN'}
            </label>
            <input
              type="text"
              placeholder={direction === 'send' ? 'Recipient bank account' : 'Transfer reference number'}
              value={recipientAccount}
              onChange={(e) => setRecipientAccount(e.target.value)}
              className={inputCls('recipientAccount')}
            />
            {errors.recipientAccount && <p className="text-xs text-red-500 mt-1">{errors.recipientAccount}</p>}
          </div>

          {/* Summary */}
          {pgkAmount && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transfer Amount</span>
                <span className="font-medium text-gray-800">{formatPGK(parseFloat(pgkAmount) || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Provider Fee</span>
                <span className="font-medium text-gray-800">{formatPGK(provider.fee)}</span>
              </div>
              {direction === 'send' && (
                <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-1.5">
                  <span className="text-gray-700">Total Deducted (PGK)</span>
                  <span className="text-blue-700">{formatPGK(totalCost)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  {direction === 'send' ? 'Recipient receives' : 'You receive'}
                </span>
                <span className="font-medium text-green-600">
                  {foreignAmount || '—'} {currency}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Processing…' : direction === 'send' ? 'Send Money Abroad' : 'Confirm Receipt'}
          </button>
        </form>
      </Card>

      {success && (
        <SuccessModal
          title={direction === 'send' ? 'Transfer Initiated!' : 'Receipt Confirmed!'}
          message={`${success.amount} processed via ${provider.name}.`}
          reference={success.ref}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
