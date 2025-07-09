import React, { useMemo } from 'react';
import { Student } from '../types';
import { useReports } from '../hooks/useReports';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { 
  Users, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Download,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';

interface ReportsPageProps {
  students: Student[];
  onLogout: () => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ students, onLogout }) => {
  const { reportsData, loading, error, refreshReports } = useReports();

  // Fallback to local calculation if API fails
  const localReports = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    const currentYear = currentDate.getFullYear();

    const totalStudents = students.length;
    const activeStudents = students.filter(student => 
      student.payments.some(p => 
        p.month === currentMonth && 
        p.year === currentYear && 
        p.confirmed
      )
    ).length;
    const inactiveStudents = totalStudents - activeStudents;
    
    const totalPayments = students.reduce((total, student) => 
      total + student.payments.filter(p => p.confirmed).reduce((sum, p) => sum + p.amount, 0), 0
    );

    const monthlyPayments = students.reduce((total, student) => {
      const monthPayment = student.payments.find(p => 
        p.month === currentMonth && 
        p.year === currentYear && 
        p.confirmed
      );
      return total + (monthPayment?.amount || 0);
    }, 0);

    return {
      totalStudents,
      activeStudents,
      inactiveStudents,
      totalPayments,
      monthlyPayments,
      monthlyActiveCount: activeStudents
    };
  }, [students]);

  // Use API data if available, otherwise use local calculation
  const reports = reportsData || localReports;

  const exportDetailedReport = () => {
    const reportData = [
      ['تقرير شامل عن الطلاب'],
      ['تم إنشاؤه في:', new Date().toLocaleDateString('en-GB')],
      [''],
      ['إحصائيات موجزة'],
      ['إجمالي الطلاب:', reports.totalStudents],
      ['الطلاب النشطون (الشهر الحالي):', reports.activeStudents],
      ['الطلاب غير النشطين:', reports.inactiveStudents],
      [''],
      ['الملخص المالي'],
      ['إجمالي المبلغ المحصل:', reports.totalPayments.toLocaleString()],
      ['إجمالي المبلغ (الشهر الحالي):', reports.monthlyPayments.toLocaleString()],
      ['عدد الطلاب النشطين (الشهر الحالي):', reports.monthlyActiveCount],
    ];

    const csvContent = reportData.map(row => row.join(',')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تقرير_مفصل_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner message="جاري تحميل التقارير..." size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Shapes */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-blue-400/10 dark:bg-blue-600/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-32 left-20 w-12 h-12 bg-green-400/10 dark:bg-green-600/10 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 right-32 w-20 h-20 bg-purple-400/10 dark:bg-purple-600/10 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
        <div className="absolute bottom-32 left-10 w-8 h-8 bg-yellow-400/10 dark:bg-yellow-600/10 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        
        {/* Animated Waves */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-transparent dark:from-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-transparent dark:from-green-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '6s' }}></div>
        </div>

        {/* Geometric Patterns */}
        <div className="absolute top-20 left-1/4 w-6 h-6 border-2 border-blue-400/20 dark:border-blue-600/20 rotate-45 animate-spin" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-4 h-4 border-2 border-green-400/20 dark:border-green-600/20 rotate-45 animate-spin" style={{ animationDelay: '3s', animationDuration: '15s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg mr-3 animate-pulse">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                التقارير والإحصائيات
              </h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              {error && (
                <button
                  onClick={refreshReports}
                  className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  title="إعادة تحميل التقارير"
                >
                  <RefreshCw className="h-4 w-4 ml-2" />
                  إعادة تحميل
                </button>
              )}
              <button
                onClick={exportDetailedReport}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Download className="h-5 w-5 ml-2" />
                تصدير التقرير
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage 
              message={`${error} (يتم عرض البيانات المحلية)`} 
              onRetry={refreshReports} 
            />
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg animate-pulse">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الطلاب</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{reports.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}>
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الطلاب النشطون</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{reports.activeStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '1s' }}>
                <UserX className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">الطلاب غير النشطين</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{reports.inactiveStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '1.5s' }}>
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">النشطون هذا الشهر</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{reports.monthlyActiveCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '2s' }}>
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي المحصل</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.totalPayments.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg animate-pulse" style={{ animationDelay: '2.5s' }}>
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">هذا الشهر</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.monthlyPayments.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Indicator */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          {error ? (
            <span className="text-orange-600 dark:text-orange-400">
              📊 البيانات المعروضة محسوبة محلياً بسبب خطأ في الخادم
            </span>
          ) : (
            <span className="text-green-600 dark:text-green-400">
              🌐 البيانات محدثة من الخادم
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;