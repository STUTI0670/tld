'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';

const DEBT_STORAGE_KEY = 'timeDebt';
const TIMESTAMP_STORAGE_KEY = 'lastRecordedTimestamp';

interface DebtContextType {
  debtInMinutes: number;
  lastRecordedTimestamp: number;
  isInitialized: boolean;
  addDebt: (minutes: number) => void;
  repayDebt: (minutes: number) => void;
  reconcileTime: () => void;
}

const defaultState: DebtContextType = {
  debtInMinutes: 125,
  lastRecordedTimestamp: Date.now(),
  isInitialized: false,
  addDebt: () => {},
  repayDebt: () => {},
  reconcileTime: () => {},
};

export const DebtContext = createContext<DebtContextType>(defaultState);

export const DebtProvider = ({ children }: { children: React.ReactNode }) => {
  const [debtInMinutes, setDebtInMinutes] = useState(defaultState.debtInMinutes);
  const [lastRecordedTimestamp, setLastRecordedTimestamp] = useState(defaultState.lastRecordedTimestamp);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedDebt = window.localStorage.getItem(DEBT_STORAGE_KEY);
      const savedTimestamp = window.localStorage.getItem(TIMESTAMP_STORAGE_KEY);

      if (savedDebt !== null) {
        setDebtInMinutes(JSON.parse(savedDebt));
      } else {
        window.localStorage.setItem(DEBT_STORAGE_KEY, JSON.stringify(defaultState.debtInMinutes));
      }

      if (savedTimestamp !== null) {
        setLastRecordedTimestamp(JSON.parse(savedTimestamp));
      } else {
        const now = Date.now();
        setLastRecordedTimestamp(now);
        window.localStorage.setItem(TIMESTAMP_STORAGE_KEY, JSON.stringify(now));
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
      // Set default values if localStorage fails
      window.localStorage.setItem(DEBT_STORAGE_KEY, JSON.stringify(defaultState.debtInMinutes));
      const now = Date.now();
      window.localStorage.setItem(TIMESTAMP_STORAGE_KEY, JSON.stringify(now));
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const addDebt = useCallback((minutes: number) => {
    setDebtInMinutes(prevDebt => {
      const newDebt = prevDebt + minutes;
      try {
        window.localStorage.setItem(DEBT_STORAGE_KEY, JSON.stringify(newDebt));
      } catch (error) {
        console.error("Failed to write to localStorage", error);
      }
      return newDebt;
    });
  }, []);

  const repayDebt = useCallback((minutes: number) => {
    setDebtInMinutes(prevDebt => {
      const newDebt = Math.max(0, prevDebt - minutes);
      try {
        window.localStorage.setItem(DEBT_STORAGE_KEY, JSON.stringify(newDebt));
      } catch (error) {
        console.error("Failed to write to localStorage", error);
      }
      return newDebt;
    });
  }, []);

  const reconcileTime = useCallback(() => {
    const now = Date.now();
    setLastRecordedTimestamp(now);
    try {
      window.localStorage.setItem(TIMESTAMP_STORAGE_KEY, JSON.stringify(now));
    } catch (error) {
      console.error("Failed to write to localStorage", error);
    }
  }, []);

  const value = {
    debtInMinutes,
    lastRecordedTimestamp,
    isInitialized,
    addDebt,
    repayDebt,
    reconcileTime,
  };

  return <DebtContext.Provider value={value}>{children}</DebtContext.Provider>;
};
