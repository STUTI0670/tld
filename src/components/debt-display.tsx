'use client';

import { useTimeDebt } from '@/hooks/use-time-debt';
import { formatMinutesToHM } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DebtDisplay() {
  const { debtInMinutes } = useTimeDebt();

  return (
    <Card className="text-center bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Time Debt</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold tracking-tighter text-destructive">
          {formatMinutesToHM(debtInMinutes)}
        </div>
        <CardDescription className="mt-2">
          This is the total amount of time you need to repay.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
