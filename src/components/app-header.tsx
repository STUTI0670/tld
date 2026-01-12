import { Hourglass } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center">
        <div className="flex items-center gap-2">
          <Hourglass className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Time Debt Ledger</h1>
        </div>
      </div>
    </header>
  );
}
