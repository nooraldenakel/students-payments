import { useState, useEffect, useCallback } from 'react';
import { reportsApi, ApiError } from '../services/api';

export interface ReportsData {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalPayments: number;
  monthlyPayments: number;
  monthlyActiveCount: number;
}

export const useReports = () => {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await reportsApi.getSummary();
      setReportsData(data);
    } catch (error) {
      console.error('Failed to load reports:', error);
      const errorMessage = error instanceof ApiError 
        ? `خطأ في تحميل التقارير (${error.status}): ${error.message}`
        : 'فشل في تحميل التقارير. تحقق من الاتصال بالإنترنت.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const refreshReports = useCallback(async () => {
    await loadReports();
  }, [loadReports]);

  return {
    reportsData,
    loading,
    error,
    refreshReports,
  };
};