import { CheckCircle2, X } from 'lucide-react';

interface Props {
  title: string;
  message: string;
  reference: string;
  onClose: () => void;
}

export default function SuccessModal({ title, message, reference, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={56} className="text-green-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        <div className="bg-gray-50 rounded-lg p-3 mb-6">
          <p className="text-xs text-gray-500">Reference Number</p>
          <p className="text-sm font-mono font-bold text-gray-800 mt-0.5">{reference}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
}
