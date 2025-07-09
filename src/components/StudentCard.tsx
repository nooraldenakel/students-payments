import React, { useState } from 'react';
import { Student } from '../types';
import { 
  History, 
  Edit, 
  Trash2, 
  MapPin,
  GraduationCap,
  Building,
  Home
} from 'lucide-react';
import PaymentHistoryModal from './PaymentHistoryModal';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onConfirmPayment: (studentId: string, paymentId: string) => void;
  onDeletePayment: (studentId: string, paymentId: string) => void;
  onPrintReceipt: (student: Student, paymentId: string) => void;
  // Add students array to get the most up-to-date student data
  students: Student[];
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onEdit,
  onDelete,
  onConfirmPayment,
  onDeletePayment,
  onPrintReceipt,
  students
}) => {
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  // Get the most up-to-date student data from the students array
  // If not found in students array, use the original student (fallback)
  const currentStudent = students.find(s => s.id === student.id) || student;

  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString();
  const currentYear = currentDate.getFullYear();
  
  const currentMonthPayment = currentStudent.payments.find(p => {
    const paymentMonth = parseInt(p.month);
    return paymentMonth === parseInt(currentMonth) && p.year === currentYear && p.confirmed;
  });
  
  const totalPaid = currentStudent.payments
    .filter(p => p.confirmed)
    .reduce((sum, p) => sum + p.amount, 0);
  
  const latestPayment = currentStudent.payments
    .filter(p => p.confirmed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const isActive = !!currentMonthPayment;

  const handleDelete = () => {
    onDelete(currentStudent);
  };

  return (
    <>
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20 transform hover:scale-105 animate-fade-in" dir="rtl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 text-right" dir="auto">
                {currentStudent.name}
              </h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-300 animate-pulse' 
                  : 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 text-red-800 dark:text-red-300'
              }`}>
                {isActive ? '✅ نشط' : '❌ غير نشط'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center group hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              <GraduationCap className="h-4 w-4 ml-2 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <span dir="auto" className="text-right">{currentStudent.department}</span>
            </div>
            <div className="flex items-center group hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
              <Building className="h-4 w-4 ml-2 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              <span dir="auto" className="text-right">{currentStudent.studyLevel}</span>
            </div>
            <div className="flex items-center group hover:text-green-600 dark:hover:text-green-400 transition-colors duration-300">
              <MapPin className="h-4 w-4 ml-2 text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" />
              <span dir="auto" className="text-right">{currentStudent.birthPlace}</span>
            </div>
            <div className="flex items-center group hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-300">
              <Home className="h-4 w-4 ml-2 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300" />
              <span>غرفة {currentStudent.roomNumber}، طابق {currentStudent.floorNumber}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/30 rounded-xl p-4 mb-4 transition-all duration-300 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">إجمالي المدفوع:</span>
              <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {totalPaid.toLocaleString()}
              </span>
            </div>
            {latestPayment && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-500">آخر دفعة:</span>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  {new Date(latestPayment.date).toLocaleDateString('en-GB')}
                </span>
              </div>
            )}
            {currentStudent.payments.length > 0 && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-500">عدد المدفوعات:</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {currentStudent.payments.length}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPaymentHistory(true)}
              className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-200 hover:to-indigo-200 dark:hover:from-blue-900/70 dark:hover:to-indigo-900/70 transition-all duration-300 text-sm transform hover:scale-105"
            >
              <History className="h-4 w-4 ml-1" />
              السجل
            </button>

            <button
              onClick={() => onEdit(currentStudent)}
              className="flex items-center px-3 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 text-yellow-700 dark:text-yellow-300 rounded-lg hover:from-yellow-200 hover:to-orange-200 dark:hover:from-yellow-900/70 dark:hover:to-orange-900/70 transition-all duration-300 text-sm transform hover:scale-105"
            >
              <Edit className="h-4 w-4 ml-1" />
              تعديل
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-2 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 text-red-700 dark:text-red-300 hover:from-red-200 hover:to-pink-200 dark:hover:from-red-900/70 dark:hover:to-pink-900/70 rounded-lg transition-all duration-300 text-sm transform hover:scale-105"
            >
              <Trash2 className="h-4 w-4 ml-1" />
              {currentStudent.deletedAt ? 'حذف نهائي' : 'حذف'}
            </button>
          </div>
        </div>
      </div>

      {showPaymentHistory && (
        <PaymentHistoryModal
          student={currentStudent}
          onClose={() => setShowPaymentHistory(false)}
          onConfirmPayment={onConfirmPayment}
          onDeletePayment={onDeletePayment}
          onPrintReceipt={onPrintReceipt}
        />
      )}
    </>
  );
};

export default StudentCard;