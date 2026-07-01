import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import MobileMoney from './pages/MobileMoney';
import BillPayments from './pages/BillPayments';
import MerchantPayments from './pages/MerchantPayments';
import Remittance from './pages/Remittance';
import TransactionHistory from './pages/TransactionHistory';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/send" element={<SendMoney />} />
            <Route path="/mobile-money" element={<MobileMoney />} />
            <Route path="/bill-payments" element={<BillPayments />} />
            <Route path="/merchant" element={<MerchantPayments />} />
            <Route path="/remittance" element={<Remittance />} />
            <Route path="/history" element={<TransactionHistory />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
