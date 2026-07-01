import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PNG_BANKS, formatPGK } from '../data/paymentData';
import type { Transaction } from '../types';
import Card from '../components/Card';
import SuccessModal from '../components/SuccessModal';
import { genRef } from '../utils/genRef';

export default function SendMoney() {
  const { primaryAccount, addTransaction } = useApp();
  const [fromBank, setFromBank] = useState(PNG_BANKS[0].id);
  const [toBank, setToBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ ref: string; amount: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!toBank) e.toBank = 'Select destination bank';
    if (!accountNumber.trim()) e.accountNumber = 'Enter account number';
    if (!recipientName.trim()) e.recipientName = 'Enter recipient name';
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
    if (Object.keys(errs).length) return;

    setLoading(true);
    const bankName = PNG_BANKS.find((b) => b.id === toBank)?.name ?? toBank;
    const ref = genRef('REF');

    setTimeout(() => {
      const tx: Transaction = {
        id: 'tx-' + Date.now(),
        type: 'send',
        description: `Transfer to ${recipientName}`,
        amount: -Number(amount),
        currency: 'PGK',
        status: 'completed',
        date: new Date().toISOString(),
        reference: ref,
        counterparty: `${recipientName} – ${bankName}`,
      };
      addTransaction(tx);
      setLoading(false);
      setSuccess({ ref, amount: formatPGK(Number(amount)) });
    }, 1200);
  }

  function handleClose() {
    setSuccess(null);
    setAmount('');
    setAccountNumber('');
    setRecipientName('');
    setReference('');
    setToBank('');
  }

  const inputCls = (field: string) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
        <p className="text-gray-500 text-sm mt-1">
          Transfer funds between accounts at PNG banks
        </p>
      </div>

      {/* Available balance */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm text-blue-700 font-medium">Available Balance</span>
        <span className="text-lg font-bold text-blue-800">{formatPGK(primaryAccount.balance)}</span>
      </div>

      <Card title="Transfer Details">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From bank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Bank</label>
            <select
              value={fromBank}
              onChange={(e) => setFromBank(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PNG_BANKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.shortName})
                </option>
              ))}
            </select>
          </div>

          {/* To bank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Bank</label>
            <select
              value={toBank}
              onChange={(e) => setToBank(e.target.value)}
              className={inputCls('toBank')}
            >
              <option value="">— Select bank —</option>
              {PNG_BANKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.shortName})
                </option>
              ))}
            </select>
            {errors.toBank && <p className="text-xs text-red-500 mt-1">{errors.toBank}</p>}
          </div>

          {/* Account number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Account Number</label>
            <input
              type="text"
              placeholder="e.g. 1000-1234-5678"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className={inputCls('accountNumber')}
            />
            {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>}
          </div>

          {/* Recipient name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
            <input
              type="text"
              placeholder="Full name as on account"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className={inputCls('recipientName')}
            />
            {errors.recipientName && <p className="text-xs text-red-500 mt-1">{errors.recipientName}</p>}
          </div>

          {/* Amount */}
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

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Reference <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. School fees, Rent"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Supported banks info */}
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500 font-medium mb-2">Supported Banks</p>
            <div className="flex flex-wrap gap-2">
              {PNG_BANKS.map((b) => (
                <span
                  key={b.id}
                  className="text-xs px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600"
                >
                  {b.shortName}
                </span>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Processing…' : 'Send Money'}
          </button>
        </form>
      </Card>

      {success && (
        <SuccessModal
          title="Transfer Successful!"
          message={`${success.amount} has been sent successfully.`}
          reference={success.ref}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
