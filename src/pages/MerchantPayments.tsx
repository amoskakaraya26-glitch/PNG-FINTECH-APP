import { useState, useRef } from 'react';
import { QrCode, Camera, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatPGK } from '../data/paymentData';
import type { Transaction } from '../types';
import Card from '../components/Card';
import SuccessModal from '../components/SuccessModal';
import { genRef } from '../utils/genRef';

// Simulated merchants for demo QR scanning
const DEMO_MERCHANTS = [
  { id: 'm1', name: 'Stop & Shop Supermarket', category: 'Retail', qrCode: 'QR-STOPSHOP-001' },
  { id: 'm2', name: "Brian Bell's Store", category: 'Electronics', qrCode: 'QR-BRIANBELL-001' },
  { id: 'm3', name: 'Steamships Trading', category: 'Retail', qrCode: 'QR-STEAMSHIPS-001' },
  { id: 'm4', name: 'Paradise Foods', category: 'Food & Beverage', qrCode: 'QR-PARADISE-001' },
  { id: 'm5', name: 'Hardware Haus', category: 'Hardware', qrCode: 'QR-HWHAUS-001' },
  { id: 'm6', name: 'Ela Motors', category: 'Automotive', qrCode: 'QR-ELAMOTORS-001' },
  { id: 'm7', name: 'BSP Bank ATM', category: 'Banking', qrCode: 'QR-BSP-ATM-001' },
  { id: 'm8', name: 'City Pharmacy', category: 'Health', qrCode: 'QR-CITYPHARM-001' },
];



export default function MerchantPayments() {
  const { primaryAccount, addTransaction } = useApp();
  const [selectedMerchant, setSelectedMerchant] = useState<typeof DEMO_MERCHANTS[0] | null>(null);
  const [manualQr, setManualQr] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ ref: string; amount: string; merchant: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [scanMode, setScanMode] = useState<'select' | 'manual'>('select');
  const qrInputRef = useRef<HTMLInputElement>(null);

  function validate() {
    const e: Record<string, string> = {};
    const merchant = selectedMerchant?.name ?? manualQr.trim();
    if (!merchant) e.merchant = 'Select or enter a merchant QR code';
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
    const merchantName = selectedMerchant?.name ?? manualQr.trim();
    const ref = genRef('MRC');
    setTimeout(() => {
      const tx: Transaction = {
        id: 'tx-' + Date.now(),
        type: 'merchant',
        description: merchantName,
        amount: -Number(amount),
        currency: 'PGK',
        status: 'completed',
        date: new Date().toISOString(),
        reference: ref,
        counterparty: merchantName,
      };
      addTransaction(tx);
      setLoading(false);
      setSuccess({ ref, amount: formatPGK(Number(amount)), merchant: merchantName });
    }, 1200);
  }

  function handleClose() {
    setSuccess(null);
    setAmount('');
    setNote('');
    setSelectedMerchant(null);
    setManualQr('');
    setErrors({});
  }

  const inputCls = (field: string) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Merchant Payments</h1>
        <p className="text-gray-500 text-sm mt-1">Scan QR codes or select a merchant to pay</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm text-blue-700 font-medium">Available Balance</span>
        <span className="text-lg font-bold text-blue-800">{formatPGK(primaryAccount.balance)}</span>
      </div>

      {/* Scan mode toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        <button
          onClick={() => { setScanMode('select'); setSelectedMerchant(null); setErrors({}); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            scanMode === 'select' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          <QrCode size={16} /> Select Merchant
        </button>
        <button
          onClick={() => { setScanMode('manual'); setSelectedMerchant(null); setErrors({}); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            scanMode === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
          }`}
        >
          <Camera size={16} /> Enter QR Code
        </button>
      </div>

      {/* Merchant selection */}
      {scanMode === 'select' && (
        <Card title="Select Merchant">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_MERCHANTS.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelectedMerchant(m); setErrors({}); }}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                  selectedMerchant?.id === m.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <QrCode size={18} className="text-gray-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.category}</p>
                </div>
                {selectedMerchant?.id === m.id && (
                  <CheckCircle2 size={18} className="text-blue-500 ml-auto flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
          {errors.merchant && (
            <p className="text-xs text-red-500 mt-2">{errors.merchant}</p>
          )}
        </Card>
      )}

      {/* Manual QR entry */}
      {scanMode === 'manual' && (
        <Card title="Enter QR Code">
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center gap-3 text-gray-400">
              <Camera size={40} />
              <p className="text-sm text-center">
                In a production app, this would activate your camera to scan a QR code.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or type QR code manually
              </label>
              <input
                ref={qrInputRef}
                type="text"
                placeholder="e.g. QR-MERCHANT-12345"
                value={manualQr}
                onChange={(e) => setManualQr(e.target.value)}
                className={inputCls('merchant')}
              />
              {errors.merchant && (
                <p className="text-xs text-red-500 mt-1">{errors.merchant}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Payment form */}
      {(selectedMerchant || (scanMode === 'manual' && manualQr.trim())) && (
        <Card title="Payment Details">
          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedMerchant && (
              <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-3">
                <QrCode size={20} className="text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">{selectedMerchant.name}</p>
                  <p className="text-xs text-blue-600">{selectedMerchant.category} · {selectedMerchant.qrCode}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (PGK)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">K</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`${inputCls('amount')} pl-7`}
                />
              </div>
              {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Lunch, Groceries"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Processing…' : 'Pay Now'}
            </button>
          </form>
        </Card>
      )}

      {success && (
        <SuccessModal
          title="Payment Successful!"
          message={`${success.amount} paid to ${success.merchant}.`}
          reference={success.ref}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
