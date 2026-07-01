// Core domain types for PNG Fintech App

export type Currency = 'PGK' | 'USD' | 'AUD';

export type TransactionType =
  | 'send'
  | 'receive'
  | 'bill_payment'
  | 'mobile_money'
  | 'merchant'
  | 'remittance'
  | 'airtime';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  date: string; // ISO string
  reference: string;
  counterparty?: string;
}

export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  bank: string;
  balance: number;
  currency: Currency;
  isPrimary: boolean;
}

export interface Bank {
  id: string;
  name: string;
  shortName: string;
  swiftCode: string;
  logo: string;
  color: string;
}

export interface MobileMoneyProvider {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logo: string;
  prefixes: string[]; // mobile number prefixes
}

export interface BillProvider {
  id: string;
  name: string;
  category: BillCategory;
  color: string;
  logo: string;
  accountFieldLabel: string; // e.g. "Customer Number", "Meter Number"
}

export type BillCategory =
  | 'electricity'
  | 'water'
  | 'telecom'
  | 'tax'
  | 'insurance'
  | 'government'
  | 'education'
  | 'health';

export interface RemittanceProvider {
  id: string;
  name: string;
  color: string;
  logo: string;
  fee: number; // flat fee in PGK
  fxRate: number; // PGK per 1 USD
  supportedCurrencies: Currency[];
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  qrCode: string;
}

export interface PaymentFormState {
  amount: string;
  recipient: string;
  reference: string;
  bank?: string;
  provider?: string;
  accountNumber?: string;
  currency?: Currency;
}
