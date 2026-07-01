import type {
  Account,
  Bank,
  BillProvider,
  Currency,
  MobileMoneyProvider,
  RemittanceProvider,
  Transaction,
} from '../types';

// ─── Banks operating in Papua New Guinea ────────────────────────────────────

export const PNG_BANKS: Bank[] = [
  {
    id: 'bsp',
    name: 'Bank South Pacific',
    shortName: 'BSP',
    swiftCode: 'BOSPPGPM',
    logo: '🏦',
    color: '#003087',
  },
  {
    id: 'westpac',
    name: 'Westpac Bank PNG',
    shortName: 'Westpac',
    swiftCode: 'WPACPGPM',
    logo: '🏦',
    color: '#DA1710',
  },
  {
    id: 'anz',
    name: 'ANZ PNG',
    shortName: 'ANZ',
    swiftCode: 'ANZBPGPM',
    logo: '🏦',
    color: '#007DBA',
  },
  {
    id: 'kina',
    name: 'Kina Bank',
    shortName: 'Kina',
    swiftCode: 'KINBPGPM',
    logo: '🏦',
    color: '#E31837',
  },
  {
    id: 'mibank',
    name: 'MiBank (National Microfinance Bank)',
    shortName: 'MiBank',
    swiftCode: 'MIBKPGPM',
    logo: '🏦',
    color: '#00A651',
  },
  {
    id: 'ccf',
    name: 'Credit Corporation Finance',
    shortName: 'CCF',
    swiftCode: 'CCFNPGPM',
    logo: '🏦',
    color: '#F7941D',
  },
];

// ─── Mobile Money Providers ──────────────────────────────────────────────────

export const MOBILE_MONEY_PROVIDERS: MobileMoneyProvider[] = [
  {
    id: 'digicel',
    name: 'Digicel Mobile Money',
    shortName: 'Digicel',
    color: '#E30613',
    logo: '📱',
    prefixes: ['70', '71', '72', '73', '74', '75'],
  },
  {
    id: 'bsp_mobile',
    name: 'BSP Mobile Banking',
    shortName: 'BSP Mobile',
    color: '#003087',
    logo: '📲',
    prefixes: ['76', '77'],
  },
  {
    id: 'kina_mobile',
    name: 'Kina Mobile',
    shortName: 'Kina Mobile',
    color: '#E31837',
    logo: '📲',
    prefixes: ['78', '79'],
  },
  {
    id: 'mpaisa',
    name: 'Vodafone M-Paisa',
    shortName: 'M-Paisa',
    color: '#E60000',
    logo: '📱',
    prefixes: ['68', '69'],
  },
];

// ─── Bill Payment Providers ──────────────────────────────────────────────────

export const BILL_PROVIDERS: BillProvider[] = [
  // Electricity
  {
    id: 'png_power',
    name: 'PNG Power Limited',
    category: 'electricity',
    color: '#FFB800',
    logo: '⚡',
    accountFieldLabel: 'Meter Number',
  },
  // Water & Sewage
  {
    id: 'waterpng',
    name: 'Water PNG',
    category: 'water',
    color: '#0EA5E9',
    logo: '💧',
    accountFieldLabel: 'Customer Account Number',
  },
  // Telecommunications
  {
    id: 'telikom',
    name: 'Telikom PNG',
    category: 'telecom',
    color: '#005BAA',
    logo: '📞',
    accountFieldLabel: 'Account Number',
  },
  {
    id: 'digicel_bill',
    name: 'Digicel PNG',
    category: 'telecom',
    color: '#E30613',
    logo: '📡',
    accountFieldLabel: 'Mobile Number',
  },
  {
    id: 'bmobile',
    name: 'bmobile-Vodafone PNG',
    category: 'telecom',
    color: '#E60000',
    logo: '📡',
    accountFieldLabel: 'Mobile Number',
  },
  // Airtime Top-Up
  {
    id: 'digicel_airtime',
    name: 'Digicel Airtime',
    category: 'telecom',
    color: '#E30613',
    logo: '📶',
    accountFieldLabel: 'Mobile Number',
  },
  {
    id: 'bmobile_airtime',
    name: 'bmobile Airtime',
    category: 'telecom',
    color: '#E60000',
    logo: '📶',
    accountFieldLabel: 'Mobile Number',
  },
  // Tax & Government
  {
    id: 'irc',
    name: 'Internal Revenue Commission (IRC)',
    category: 'tax',
    color: '#1D4ED8',
    logo: '🏛️',
    accountFieldLabel: 'TIN (Taxpayer Identification Number)',
  },
  {
    id: 'customs',
    name: 'PNG Customs Service',
    category: 'government',
    color: '#15803D',
    logo: '🛃',
    accountFieldLabel: 'Assessment Reference',
  },
  {
    id: 'lands',
    name: 'Department of Lands',
    category: 'government',
    color: '#92400E',
    logo: '🗺️',
    accountFieldLabel: 'Title Reference',
  },
  {
    id: 'transport',
    name: 'PNG Road Transport Authority',
    category: 'government',
    color: '#0F766E',
    logo: '🚗',
    accountFieldLabel: 'Vehicle Registration Number',
  },
  // Insurance
  {
    id: 'mvit',
    name: 'Motor Vehicle Insurance Trust (MVIT)',
    category: 'insurance',
    color: '#7C3AED',
    logo: '🛡️',
    accountFieldLabel: 'Policy Number',
  },
  {
    id: 'ncd_insurance',
    name: 'Pacific MMI Insurance',
    category: 'insurance',
    color: '#2563EB',
    logo: '🛡️',
    accountFieldLabel: 'Policy Number',
  },
  // Education
  {
    id: 'unitech',
    name: 'PNG University of Technology',
    category: 'education',
    color: '#1E40AF',
    logo: '🎓',
    accountFieldLabel: 'Student ID',
  },
  {
    id: 'upng',
    name: 'University of Papua New Guinea',
    category: 'education',
    color: '#065F46',
    logo: '🎓',
    accountFieldLabel: 'Student ID',
  },
  // Health
  {
    id: 'pngh',
    name: 'Port Moresby General Hospital',
    category: 'health',
    color: '#DC2626',
    logo: '🏥',
    accountFieldLabel: 'Patient Number',
  },
];

// ─── International Remittance Providers ─────────────────────────────────────

export const REMITTANCE_PROVIDERS: RemittanceProvider[] = [
  {
    id: 'western_union',
    name: 'Western Union',
    color: '#FFDD00',
    logo: '🌐',
    fee: 25,
    fxRate: 3.7,
    supportedCurrencies: ['USD', 'AUD'],
  },
  {
    id: 'moneygram',
    name: 'MoneyGram',
    color: '#E31837',
    logo: '🌍',
    fee: 20,
    fxRate: 3.68,
    supportedCurrencies: ['USD', 'AUD'],
  },
  {
    id: 'ria',
    name: 'Ria Money Transfer',
    color: '#FF6B35',
    logo: '💸',
    fee: 15,
    fxRate: 3.65,
    supportedCurrencies: ['USD', 'AUD'],
  },
  {
    id: 'bsp_swift',
    name: 'BSP International Wire',
    color: '#003087',
    logo: '🏦',
    fee: 35,
    fxRate: 3.72,
    supportedCurrencies: ['USD', 'AUD'],
  },
  {
    id: 'anz_wire',
    name: 'ANZ International Transfer',
    color: '#007DBA',
    logo: '🏦',
    fee: 40,
    fxRate: 3.71,
    supportedCurrencies: ['USD', 'AUD'],
  },
];

// ─── Demo accounts ───────────────────────────────────────────────────────────

export const DEMO_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'BSP Everyday Account',
    accountNumber: '1000-****-4521',
    bank: 'Bank South Pacific',
    balance: 4_250.75,
    currency: 'PGK',
    isPrimary: true,
  },
  {
    id: 'acc-2',
    name: 'BSP Savings Account',
    accountNumber: '1000-****-8832',
    bank: 'Bank South Pacific',
    balance: 12_800.00,
    currency: 'PGK',
    isPrimary: false,
  },
  {
    id: 'acc-3',
    name: 'Kina Everyday Account',
    accountNumber: '2001-****-3377',
    bank: 'Kina Bank',
    balance: 1_540.30,
    currency: 'PGK',
    isPrimary: false,
  },
];

// ─── Demo transactions ───────────────────────────────────────────────────────

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    type: 'send',
    description: 'Transfer to Peter Kari',
    amount: -500.00,
    currency: 'PGK',
    status: 'completed',
    date: '2026-06-21T14:30:00Z',
    reference: 'REF20260621001',
    counterparty: 'Peter Kari',
  },
  {
    id: 'tx-002',
    type: 'bill_payment',
    description: 'PNG Power Limited – Meter 04821',
    amount: -185.50,
    currency: 'PGK',
    status: 'completed',
    date: '2026-06-20T10:15:00Z',
    reference: 'BILL20260620001',
    counterparty: 'PNG Power Limited',
  },
  {
    id: 'tx-003',
    type: 'receive',
    description: 'Salary – Govt of PNG',
    amount: 3_200.00,
    currency: 'PGK',
    status: 'completed',
    date: '2026-06-20T08:00:00Z',
    reference: 'SAL20260620001',
    counterparty: 'Government of PNG',
  },
  {
    id: 'tx-004',
    type: 'mobile_money',
    description: 'Digicel Airtime Top-Up – 7012 3456',
    amount: -20.00,
    currency: 'PGK',
    status: 'completed',
    date: '2026-06-19T16:45:00Z',
    reference: 'AIR20260619001',
    counterparty: 'Digicel PNG',
  },
  {
    id: 'tx-005',
    type: 'bill_payment',
    description: 'IRC Tax Payment – TIN 123456789',
    amount: -450.00,
    currency: 'PGK',
    status: 'completed',
    date: '2026-06-18T11:00:00Z',
    reference: 'IRC20260618001',
    counterparty: 'Internal Revenue Commission',
  },
  {
    id: 'tx-006',
    type: 'remittance',
    description: 'Western Union – Receive from Australia',
    amount: 740.00,
    currency: 'PGK',
    status: 'completed',
    date: '2026-06-17T09:30:00Z',
    reference: 'WU20260617001',
    counterparty: 'Western Union',
  },
  {
    id: 'tx-007',
    type: 'merchant',
    description: 'Stop & Shop Supermarket',
    amount: -125.80,
    currency: 'PGK',
    status: 'completed',
    date: '2026-06-16T18:20:00Z',
    reference: 'MRC20260616001',
    counterparty: 'Stop & Shop PNG',
  },
  {
    id: 'tx-008',
    type: 'bill_payment',
    description: 'MVIT Premium – Policy MV-4421',
    amount: -320.00,
    currency: 'PGK',
    status: 'pending',
    date: '2026-06-15T13:00:00Z',
    reference: 'MVIT20260615001',
    counterparty: 'Motor Vehicle Insurance Trust',
  },
  {
    id: 'tx-009',
    type: 'send',
    description: 'Transfer to Maria Wali',
    amount: -200.00,
    currency: 'PGK',
    status: 'failed',
    date: '2026-06-14T17:00:00Z',
    reference: 'REF20260614001',
    counterparty: 'Maria Wali',
  },
  {
    id: 'tx-010',
    type: 'bill_payment',
    description: 'Telikom PNG – Account TLK-009823',
    amount: -95.00,
    currency: 'PGK',
    status: 'completed',
    date: '2026-06-13T14:00:00Z',
    reference: 'BILL20260613002',
    counterparty: 'Telikom PNG',
  },
];

// ─── Exchange rates (PGK base) ────────────────────────────────────────────────

export const EXCHANGE_RATES: Record<Currency, number> = {
  PGK: 1,
  USD: 0.27,  // 1 PGK ≈ 0.27 USD
  AUD: 0.42,  // 1 PGK ≈ 0.42 AUD
};

// ─── Helper ───────────────────────────────────────────────────────────────────

export function formatPGK(amount: number): string {
  return `K ${Math.abs(amount).toLocaleString('en-PG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
