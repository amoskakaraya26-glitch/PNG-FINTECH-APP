import React, { createContext, useContext, useState } from 'react';
import type { Account, Transaction } from '../types';
import { DEMO_ACCOUNTS, DEMO_TRANSACTIONS } from '../data/paymentData';

interface AppContextValue {
  accounts: Account[];
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  primaryAccount: Account;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accounts] = useState<Account[]>(DEMO_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(DEMO_TRANSACTIONS);

  const primaryAccount = accounts.find((a) => a.isPrimary) ?? accounts[0];

  function addTransaction(tx: Transaction) {
    setTransactions((prev) => [tx, ...prev]);
  }

  return (
    <AppContext.Provider value={{ accounts, transactions, addTransaction, primaryAccount }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
