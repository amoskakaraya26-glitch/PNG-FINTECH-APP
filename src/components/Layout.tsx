import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Send,
  Smartphone,
  Receipt,
  QrCode,
  Globe,
  History,
  X,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/send', label: 'Send Money', icon: Send },
  { to: '/mobile-money', label: 'Mobile Money', icon: Smartphone },
  { to: '/bill-payments', label: 'Bill Payments', icon: Receipt },
  { to: '/merchant', label: 'Merchant Pay', icon: QrCode },
  { to: '/remittance', label: 'Remittance', icon: Globe },
  { to: '/history', label: 'History', icon: History },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar – desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-900 text-white shrink-0">
        <div className="px-6 py-5 border-b border-blue-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇵🇬</span>
            <div>
              <p className="font-bold text-lg leading-tight">PNG FinPay</p>
              <p className="text-xs text-blue-300">Papua New Guinea</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-blue-800 text-xs text-blue-400">
          © 2026 PNG FinPay · PGK
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-blue-900 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🇵🇬</span>
          <p className="font-bold text-base">PNG FinPay</p>
        </div>
        <button onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-10 bg-black/50"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute top-14 left-0 bottom-0 w-64 bg-blue-900 text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        <div className="max-w-5xl mx-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
