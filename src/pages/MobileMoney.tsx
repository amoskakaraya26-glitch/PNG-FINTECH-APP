import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOBILE_MONEY_PROVIDERS, formatPGK } from '../data/paymentData';
import type { MobileMoneyProvider, Transaction } from '../types';
import Card from '../components/Card';
import SuccessModal from '../components/SuccessModal';
import { genRef } from '../utils/genRef';

type ServiceType = 'transfer' | 'cash_in' | 'cash_out' | 'airtime';

const SERVICES: { id: ServiceType; label: string; desc: string }[] = [
  { id: 'transfer', label: 'Transfer', desc: 'Send to mobile wallet' },
  { id: 'cash_in', label: 'Cash In', desc: 'Bank → Mobile Wallet' },
  { id: 'cash_out', label: 'Cash Out', desc: 'Wallet → Bank Account' },
  { id: 'airtime', label: 'Buy Airtime', desc: 'Top-up mobile credit' },
];

export default function MobileMoney() {
  const { primaryAccount, addTransaction } = useApp();
  const [provider, setProvider] = useState<MobileMoneyProvider>(MOBILE_MONEY_PROVIDERS[0]);
  const [service, setService] = useState<ServiceType>('transfer');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ ref: string; amount: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    const cleanMobile = mobile.replace(/\s/g, '');
    if (!/^[0-9]{8,10}$/.test(cleanMobile)) {
      e.mobile = 'Enter a valid PNG mobile number (8–10 digits)';
    } else {
      const matchesPrefix = provider.prefixes.some((p) => cleanMobile.startsWith(p));
      if (!matchesPrefix) {
        e.mobile = `This number doesn't match ${provider.shortName} prefixes (${provider.prefixes.join(', ')})`;
      }
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      e.amount = 'Enter a valid amount';
    if (Number(amount) > primaryAccount.balance)
      e.amount = 'Insufficient balance';
    if (pin.length < 4) e.pin = 'PIN must be at least 4 digits';
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const ref = genRef('MM');
    setTimeout(() => {
      const descriptions: Record<ServiceType, string> = {
        transfer: `${provider.shortName} Transfer – ${mobile}`,
        cash_in: `${provider.shortName} Cash In – ${mobile}`,
        cash_out: `${provider.shortName} Cash Out – ${mobile}`,
        airtime: `${provider.shortName} Airtime – ${mobile}`,
      };
      const tx: Transaction = {
        id: 'tx-' + Date.now(),
        type: service === 'airtime' ? 'airtime' : 'mobile_money',
        description: descriptions[service],
        amount: -Number(amount),
        currency: 'PGK',
        status: 'completed',
        date: new Date().toISOString(),
        reference: ref,
        counterparty: provider.name,
      };
      addTransaction(tx);
      setLoading(false);
      setSuccess({ ref, amount: formatPGK(Number(amount)) });
    }, 1200);
  }

  function handleClose() {
    setSuccess(null);
    setMobile('');
    setAmount('');
    setPin('');
  }

  const inputCls = (field: string) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mobile Money</h1>
        <p className="text-gray-500 text-sm mt-1">
          Transfer, top-up, and manage mobile wallets
        </p>
      </div>

      {/* Provider selector */}
      <Card title="Select Provider">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MOBILE_MONEY_PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                provider.id === p.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{p.logo}</span>
              <span className="text-xs font-semibold text-gray-700 text-center">{p.shortName}</span>
              <span className="text-xs text-gray-400 text-center">{p.prefixes.join(', ')}…</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Service type */}
      <Card title="Service Type">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setService(s.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                service === s.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-semibold text-gray-800">{s.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Form */}
      <Card title="Transaction Details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              placeholder="e.g. 7012 3456"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className={inputCls('mobile')}
            />
            {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
            <p className="text-xs text-gray-400 mt-1">
              {provider.shortName} prefixes: {provider.prefixes.join(', ')}
            </p>
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

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2">
            {[5, 10, 20, 50, 100].map((v) => (
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction PIN</label>
            <input
              type="password"
              maxLength={6}
              placeholder="Enter your PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={inputCls('pin')}
            />
            {errors.pin && <p className="text-xs text-red-500 mt-1">{errors.pin}</p>}
          </div>

          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Provider</span>
              <span className="font-medium text-gray-800">{provider.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Service</span>
              <span className="font-medium text-gray-800 capitalize">{service.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transaction Fee</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Processing…' : 'Confirm Transaction'}
          </button>
        </form>
      </Card>

      {success && (
        <SuccessModal
          title="Transaction Successful!"
          message={`${success.amount} processed via ${provider.name}.`}
          reference={success.ref}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
