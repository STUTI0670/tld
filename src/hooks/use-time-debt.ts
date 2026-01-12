'use client';

import { useContext } from 'react';
import { DebtContext } from '@/contexts/debt-context';

export const useTimeDebt = () => {
  const context = useContext(DebtContext);
  if (context === undefined) {
    throw new Error('useTimeDebt must be used within a DebtProvider');
  }
  return context;
};
