import React, { useState } from 'react';
import { Student } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import { useStudents } from './hooks/useStudents';
import LoginPage from './components/LoginPage';
import StudentsPage from './components/StudentsPage';
import ReportsPage from './components/ReportsPage';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { BarChart3, Users, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';

type Page = 'login' | 'students' | 'reports';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const {
    students,
    deletedStudents,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    restoreStudent,
    addPayment,
    confirmPayment,
    deletePayment,
    getReceiptByPaymentId,
    refreshStudents,
  } = useStudents();

  const handleLogin = (username: string, password: string) => {
    // Simple authentication - in production, this would be more secure
    if (username === 'admin' && password === '123456') {
      setIsAuthenticated(true);
      setCurrentPage('students');
    } else {
      alert('بيانات غير صحيحة. استخدم "admin" / "123456"');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      await updateStudent(updatedStudent);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    try {
      await deleteStudent(student);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    }
  };

  const handleRestoreStudent = async (student: Student) => {
    try {
      await restoreStudent(student);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    }
  };

  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'payments' | 'dateAdded'>) => {
    try {
      await addStudent(studentData);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    }
  };

  const handleAddPayment = async (studentId: string, amount: number) => {
    try {
      await addPayment(studentId, amount);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    }
  };

  const handleConfirmPayment = async (studentId: string, paymentId: string) => {
    try {
      await confirmPayment(studentId, paymentId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    }
  };

  const handleDeletePayment = async (studentId: string, paymentId: string) => {
    try {
      await deletePayment(studentId, paymentId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show loading spinner while processing operations
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner message="جاري تحميل بيانات الطلاب..." size="lg" />
      </div>
    );
  }

  // Show error message if operation failed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <ErrorMessage message={error} onRetry={refreshStudents} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Shapes */}
        <div className="absolute top-10 right-10 w-12 h-12 bg-blue-400/5 dark:bg-blue-600/5 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}></div>
        <div className="absolute top-32 left-20 w-8 h-8 bg-purple-400/5 dark:bg-purple-600/5 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
        <div className="absolute bottom-20 right-32 w-16 h-16 bg-indigo-400/5 dark:bg-indigo-600/5 rounded-full animate-bounce" style={{ animationDelay: '4s', animationDuration: '10s' }}></div>
        <div className="absolute bottom-32 left-10 w-6 h-6 bg-pink-400/5 dark:bg-pink-600/5 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
        
        {/* Animated Waves */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-transparent dark:from-blue-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-transparent dark:from-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '8s' }}></div>
        </div>

        {/* Geometric Patterns */}
        <div className="absolute top-20 left-1/4 w-4 h-4 border border-blue-400/10 dark:border-blue-600/10 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-3 h-3 border border-purple-400/10 dark:border-purple-600/10 rotate-45 animate-spin" style={{ animationDelay: '5s', animationDuration: '25s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-8 space-x-reverse">
              <button
                onClick={() => setCurrentPage('students')}
                className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  currentPage === 'students'
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Users className="h-5 w-5 ml-2" />
                الطلاب
              </button>
              <button
                onClick={() => setCurrentPage('reports')}
                className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  currentPage === 'reports'
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <BarChart3 className="h-5 w-5 ml-2" />
                التقارير
              </button>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <button
                onClick={toggleTheme}
                className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:scale-110"
                title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 animate-spin" style={{ animationDuration: '8s' }} />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <LogOut className="h-5 w-5 ml-2" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="relative z-10">
        {currentPage === 'students' && (
          <StudentsPage
            students={students}
            deletedStudents={deletedStudents}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onRestoreStudent={handleRestoreStudent}
            onAddPayment={handleAddPayment}
            onAddStudent={handleAddStudent}
            onConfirmPayment={handleConfirmPayment}
            onDeletePayment={handleDeletePayment}
            getReceiptByPaymentId={getReceiptByPaymentId}
          />
        )}

        {currentPage === 'reports' && (
          <ReportsPage
            students={students}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;