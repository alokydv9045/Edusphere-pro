import useSWR, { mutate } from 'swr';
import { dashboardAPI, type DashboardStats, type RecentActivity, type UpcomingExam, type FeeCollectionSummary } from '@/lib/api';
import { useEffect } from 'react';
import { useSocket } from './useSocket';

const fetcher = (key: string) => {
  switch (key) {
    case 'dashboard/stats': return dashboardAPI.getStats();
    case 'dashboard/activities': return dashboardAPI.getRecentActivities(8);
    case 'dashboard/exams': return dashboardAPI.getUpcomingExams(5);
    case 'dashboard/fees': return dashboardAPI.getFeeCollectionSummary();
    case 'dashboard/accountant': return dashboardAPI.getAccountantStats();
    case 'dashboard/library': return dashboardAPI.getLibraryStats();
    case 'dashboard/hr': return dashboardAPI.getHRStats();
    case 'dashboard/finance': return dashboardAPI.getFinanceStats();
    case 'dashboard/inventory': return dashboardAPI.getInventoryStats();
    default: return Promise.reject('Unknown key');
  }
};

export function useDashboardData(role: string) {
  const { socket } = useSocket();

  const { data: statsData, error: statsError, isValidating: statsValidating, isLoading: statsLoading } = useSWR('dashboard/stats', fetcher, { revalidateOnFocus: false, revalidateIfStale: false });
  const { data: activitiesData, error: activitiesError, isValidating: activitiesValidating, isLoading: activitiesLoading } = useSWR('dashboard/activities', fetcher, { revalidateOnFocus: false, revalidateIfStale: false });
  const { data: examsData, error: examsError, isValidating: examsValidating, isLoading: examsLoading } = useSWR('dashboard/exams', fetcher, { revalidateOnFocus: false, revalidateIfStale: false });
  const { data: feesData, error: feesError, isValidating: feesValidating, isLoading: feesLoading } = useSWR('dashboard/fees', fetcher, { revalidateOnFocus: false, revalidateIfStale: false });

  // Role-specific data
  const isAccountant = role === 'ACCOUNTANT';
  const { data: accountantData, isValidating: accountantValidating, isLoading: accountantLoading } = useSWR(isAccountant ? 'dashboard/accountant' : null, fetcher, { revalidateOnFocus: false, revalidateIfStale: false });

  const mutateAll = () => {
    mutate('dashboard/stats');
    mutate('dashboard/activities');
    mutate('dashboard/exams');
    mutate('dashboard/fees');
    if (isAccountant) mutate('dashboard/accountant');
  };

  useEffect(() => {
    if (!socket) return;

    // Use a small delay for socket multi-events to prevent request storms
    let timeout: NodeJS.Timeout;
    const debouncedMutate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(mutateAll, 500);
    };

    socket.on('ATTENDANCE_MARKED', debouncedMutate);
    socket.on('STUDENT_REGISTERED', debouncedMutate);
    socket.on('FINANCE_UPDATE', debouncedMutate);
    socket.on('INVENTORY_STOCK_MOVEMENT', debouncedMutate);
    socket.on('PAYROLL_GENERATED', debouncedMutate);
    socket.on('PAYROLL_PAID', debouncedMutate);
    socket.on('LIBRARY_BOOK_ISSUED', debouncedMutate);
    socket.on('LIBRARY_BOOK_RETURNED', debouncedMutate);
    socket.on('ANNOUNCEMENT_CREATED', debouncedMutate);

    return () => {
      socket.off('ATTENDANCE_MARKED', debouncedMutate);
      socket.off('STUDENT_REGISTERED', debouncedMutate);
      socket.off('FINANCE_UPDATE', debouncedMutate);
      socket.off('INVENTORY_STOCK_MOVEMENT', debouncedMutate);
      socket.off('PAYROLL_GENERATED', debouncedMutate);
      socket.off('PAYROLL_PAID', debouncedMutate);
      socket.off('LIBRARY_BOOK_ISSUED', debouncedMutate);
      socket.off('LIBRARY_BOOK_RETURNED', debouncedMutate);
      socket.off('ANNOUNCEMENT_CREATED', debouncedMutate);
      clearTimeout(timeout);
    };
  }, [socket, isAccountant]);

  // isInitialLoading is true ONLY when we have no data and are fetching
  const isInitialLoading = 
    (!statsData && statsLoading) || 
    (!activitiesData && activitiesLoading) || 
    (!examsData && examsLoading) || 
    (!feesData && feesLoading) || 
    (isAccountant && !accountantData && accountantLoading);

  return {
    stats: statsData?.stats,
    activities: activitiesData?.activities || [],
    exams: examsData?.exams || [],
    feeSummary: feesData?.summary || { totalExpected: 0, collected: 0, pending: 0, collectionRate: 0 },
    accountantData,
    isLoading: isInitialLoading,
    isValidating: statsValidating || activitiesValidating || examsValidating || feesValidating || accountantValidating,
    isError: statsError || activitiesError || examsError || feesError,
    refresh: mutateAll
  };
}
