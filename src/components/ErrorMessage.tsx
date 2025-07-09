import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-red-50/50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-800/50" dir="rtl">
      <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          حدث خطأ
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 mx-auto"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;