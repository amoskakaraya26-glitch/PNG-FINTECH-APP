interface Props {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, action, className = '' }: Props) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
