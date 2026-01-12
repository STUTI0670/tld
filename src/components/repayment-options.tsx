'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GithubRepaymentForm } from '@/components/github-repayment-form';
import { VideoRepaymentForm } from '@/components/video-repayment-form';

export default function RepaymentOptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repay Your Debt</CardTitle>
        <CardDescription>
          Choose a method to submit your proof of work and reduce your time debt.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GithubRepaymentForm />
        <VideoRepaymentForm />
      </CardContent>
    </Card>
  );
}
