'use client';

import { useEffect, useState } from 'react';
import { useTimeDebt } from '@/hooks/use-time-debt';
import DebtDisplay from '@/components/debt-display';
import RepaymentOptions from '@/components/repayment-options';
import ReconciliationModal from '@/components/reconciliation-modal';
import { Skeleton } from '@/components/ui/skeleton';
import ActiveTimers from '@/components/active-timers';

const RECONCILIATION_THRESHOLD_MINUTES = 10;

export default function Home() {
  const { lastRecordedTimestamp, isInitialized } = useTimeDebt();
  const [showReconciliation, setShowReconciliation] = useState(false);
  const [timeGap, setTimeGap] = useState(0);

  useEffect(() => {
    if (!isInitialized) return;

    const now = Date.now();
    const gapInMinutes = (now - lastRecordedTimestamp) / (1000 * 60);

    if (gapInMinutes > RECONCILIATION_THRESHOLD_MINUTES) {
      setTimeGap(Math.round(gapInMinutes));
      setShowReconciliation(true);
    }
  }, [lastRecordedTimestamp, isInitialized]);

  if (!isInitialized) {
    return (
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-2xl w-full flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto max-w-2xl w-full flex flex-col gap-8">
          <DebtDisplay />
          <ActiveTimers />
          <RepaymentOptions />
        </div>
      </main>
      <ReconciliationModal
        open={showReconciliation}
        setOpen={setShowReconciliation}
        timeGap={timeGap}
      />
    </>
  );
}
