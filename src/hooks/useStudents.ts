import { useState, useEffect, useCallback } from 'react';
import { Student, Payment } from '../types';
import { studentsApi, paymentsApi, receiptsApi, ApiError } from '../services/api';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [deletedStudents, setDeletedStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate unique receipt number
  const generateReceiptNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = date.getTime().toString().slice(-3);
    return `REC-${dateStr}${timeStr}`;
  };

  // Convert API student to internal Student type
  const convertApiStudentToStudent = async (apiStudent: any): Promise<Student> => {
    try {
      // Get payments for this student
      const payments = await paymentsApi.getByStudentId(apiStudent.id);
      
      return {
        id: apiStudent.id,
        name: apiStudent.name,
        department: apiStudent.department,
        studyLevel: apiStudent.studyLevel,
        birthPlace: apiStudent.birthPlace,
        roomNumber: apiStudent.roomNumber,
        floorNumber: apiStudent.floorNumber,
        dateAdded: apiStudent.dateAdded || new Date().toISOString().split('T')[0],
        deletedAt: apiStudent.deletedAt,
        payments: payments.map(p => ({
          id: p.id,
          amount: p.amount,
          date: p.date,
          month: p.month,
          year: p.year,
          confirmed: p.confirmed
        }))
      };
    } catch (error) {
      // If payments fetch fails, return student without payments
      console.warn(`Failed to fetch payments for student ${apiStudent.id}:`, error);
      return {
        id: apiStudent.id,
        name: apiStudent.name,
        department: apiStudent.department,
        studyLevel: apiStudent.studyLevel,
        birthPlace: apiStudent.birthPlace,
        roomNumber: apiStudent.roomNumber,
        floorNumber: apiStudent.floorNumber,
        dateAdded: apiStudent.dateAdded || new Date().toISOString().split('T')[0],
        deletedAt: apiStudent.deletedAt,
        payments: []
      };
    }
  };

  // Load active students and deleted students separately
  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load active students (without deletedAt)
      const activeApiStudents = await studentsApi.getAll();
      const activeStudentsWithPayments = await Promise.all(
        activeApiStudents.map(convertApiStudentToStudent)
      );
      
      // Load deleted students (with deletedAt)
      let deletedStudentsWithPayments: Student[] = [];
      try {
        const deletedApiStudents = await studentsApi.getDeleted();
        deletedStudentsWithPayments = await Promise.all(
          deletedApiStudents.map(convertApiStudentToStudent)
        );
      } catch (error) {
        console.warn('Failed to load deleted students:', error);
        // Continue without deleted students if endpoint fails
      }
      
      setStudents(activeStudentsWithPayments);
      setDeletedStudents(deletedStudentsWithPayments);
    } catch (error) {
      console.error('Failed to load students:', error);
      const errorMessage = error instanceof ApiError 
        ? `خطأ في الخادم (${error.status}): ${error.message}`
        : 'فشل في تحميل بيانات الطلاب. تحقق من الاتصال بالإنترنت.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize students data
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Add new student
  const addStudent = useCallback(async (studentData: Omit<Student, 'id' | 'payments' | 'dateAdded' | 'deletedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiStudent = await studentsApi.create(studentData);
      const newStudent = await convertApiStudentToStudent(apiStudent);
      
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (error) {
      console.error('Failed to add student:', error);
      const errorMessage = error instanceof ApiError 
        ? `فشل في إضافة الطالب (${error.status}): ${error.message}`
        : 'فشل في إضافة الطالب. يرجى المحاولة مرة أخرى.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update student
  const updateStudent = useCallback(async (updatedStudent: Student) => {
    try {
      setLoading(true);
      setError(null);
      
      const { id, payments, dateAdded, deletedAt, ...studentData } = updatedStudent;
      const apiStudent = await studentsApi.update(id, studentData);
      const student = await convertApiStudentToStudent(apiStudent);
      
      // Update in the appropriate list based on deletedAt status
      if (student.deletedAt) {
        setDeletedStudents(prev => 
          prev.map(s => s.id === student.id ? student : s)
        );
      } else {
        setStudents(prev => 
          prev.map(s => s.id === student.id ? student : s)
        );
      }
    } catch (error) {
      console.error('Failed to update student:', error);
      const errorMessage = error instanceof ApiError 
        ? `فشل في تحديث بيانات الطالب (${error.status}): ${error.message}`
        : 'فشل في تحديث بيانات الطالب. يرجى المحاولة مرة أخرى.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete student - now uses proper soft delete with API endpoints
  const deleteStudent = useCallback(async (student: Student) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if student is in deleted list (permanent delete)
      const isInDeletedList = deletedStudents.some(s => s.id === student.id);
      
      if (isInDeletedList) {
        // Permanent delete - check if student has payments
        if (student.payments && student.payments.length > 0) {
          throw new Error('لا يمكن حذف الطالب نهائياً لأنه يحتوي على مدفوعات. يجب حذف جميع المدفوعات أولاً.');
        }
        
        // Delete permanently from API
        await studentsApi.delete(student.id);
        
        // Remove from deleted list
        setDeletedStudents(prev => prev.filter(s => s.id !== student.id));
      } else {
        // First step: soft delete using API
        await studentsApi.softDelete(student.id);
        
        // Move from active to deleted list
        setStudents(prev => prev.filter(s => s.id !== student.id));
        setDeletedStudents(prev => {
          const isAlreadyDeleted = prev.some(s => s.id === student.id);
          if (isAlreadyDeleted) {
            return prev;
          }
          return [...prev, { ...student, deletedAt: new Date().toISOString() }];
        });
      }
    } catch (error) {
      console.error('Failed to delete student:', error);
      const errorMessage = error instanceof ApiError 
        ? `فشل في حذف الطالب (${error.status}): ${error.message}`
        : error instanceof Error 
        ? error.message
        : 'فشل في حذف الطالب. يرجى المحاولة مرة أخرى.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [deletedStudents]);

  // Restore student - now uses proper API call
  const restoreStudent = useCallback(async (student: Student) => {
    try {
      setLoading(true);
      setError(null);
      
      // Restore using API
      await studentsApi.restore(student.id);
      
      // Move from deleted to active list
      setDeletedStudents(prev => prev.filter(s => s.id !== student.id));
      setStudents(prev => {
        const isAlreadyActive = prev.some(s => s.id === student.id);
        if (isAlreadyActive) {
          return prev;
        }
        return [...prev, { ...student, deletedAt: undefined }];
      });
    } catch (error) {
      console.error('Failed to restore student:', error);
      const errorMessage = error instanceof ApiError 
        ? `فشل في استعادة الطالب (${error.status}): ${error.message}`
        : 'فشل في استعادة الطالب. يرجى المحاولة مرة أخرى.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add payment (NO automatic receipt creation)
  const addPayment = useCallback(async (studentId: string, amount: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentDate = new Date();
      const paymentData = {
        studentId,
        amount,
        date: currentDate.toISOString().split('T')[0],
        month: (currentDate.getMonth() + 1).toString(),
        year: currentDate.getFullYear(),
        confirmed: false,
      };

      const newPayment = await paymentsApi.create(paymentData);
      
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId
            ? {
                ...student,
                payments: [...student.payments, {
                  id: newPayment.id,
                  amount: newPayment.amount,
                  date: newPayment.date,
                  month: newPayment.month,
                  year: newPayment.year,
                  confirmed: newPayment.confirmed
                }]
              }
            : student
        )
      );
    } catch (error) {
      console.error('Failed to add payment:', error);
      const errorMessage = error instanceof ApiError 
        ? `فشل في إضافة الدفعة (${error.status}): ${error.message}`
        : 'فشل في إضافة الدفعة. يرجى المحاولة مرة أخرى.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Confirm payment and automatically create receipt
  const confirmPayment = useCallback(async (studentId: string, paymentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await paymentsApi.confirm(paymentId);
      
      // Create receipt only when payment is confirmed
      try {
        const receiptData = {
          paymentId: paymentId,
          receiptNo: generateReceiptNumber(),
          copyType: 'student'
        };
        await receiptsApi.create(receiptData);
      } catch (receiptError) {
        console.warn('Failed to create receipt for confirmed payment:', receiptError);
        // Don't throw error here, payment confirmation was successful
      }
      
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId
            ? {
                ...student,
                payments: student.payments.map(payment =>
                  payment.id === paymentId
                    ? { ...payment, confirmed: true }
                    : payment
                )
              }
            : student
        )
      );
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      const errorMessage = error instanceof ApiError 
        ? `فشل في تأكيد الدفعة (${error.status}): ${error.message}`
        : 'فشل في تأكيد الدفعة. يرجى المحاولة مرة أخرى.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete payment and its associated receipt (only if payment is confirmed)
  const deletePayment = useCallback(async (studentId: string, paymentId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the payment to check if it's confirmed
      const student = students.find(s => s.id === studentId) || deletedStudents.find(s => s.id === studentId);
      const payment = student?.payments.find(p => p.id === paymentId);
      
      // Only try to delete receipt if payment is confirmed (receipts only exist for confirmed payments)
      if (payment?.confirmed) {
        try {
          const receipt = await receiptsApi.getByPaymentId(paymentId);
          if (receipt && receipt.id) {
            await receiptsApi.delete(receipt.id);
          }
        } catch (error) {
          // If receipt not found (404), continue with payment deletion
          if (error instanceof ApiError && error.status === 404) {
            console.warn('No receipt found for payment, continuing with payment deletion');
          } else {
            // For other errors (like 500), throw error to prevent payment deletion
            console.error('Failed to delete receipt for payment:', error);
            const errorMessage = error instanceof ApiError 
              ? `فشل في حذف الإيصال (${error.status}): ${error.message}`
              : 'فشل في حذف الإيصال. يجب حذف الإيصال أولاً قبل حذف الدفعة.';
            throw new Error(errorMessage);
          }
        }
      }
      
      // Delete the payment
      await paymentsApi.delete(paymentId);
      
      // Update both active and deleted students lists
      setStudents(prev =>
        prev.map(student =>
          student.id === studentId
            ? {
                ...student,
                payments: student.payments.filter(payment => payment.id !== paymentId)
              }
            : student
        )
      );
      
      setDeletedStudents(prev =>
        prev.map(student =>
          student.id === studentId
            ? {
                ...student,
                payments: student.payments.filter(payment => payment.id !== paymentId)
              }
            : student
        )
      );
    } catch (error) {
      console.error('Failed to delete payment:', error);
      const errorMessage = error instanceof ApiError 
        ? `فشل في حذف الدفعة (${error.status}): ${error.message}`
        : 'فشل في حذف الدفعة. يرجى المحاولة مرة أخرى.';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [students, deletedStudents]);

  // Get receipt for payment (for printing)
  const getReceiptByPaymentId = useCallback(async (paymentId: string) => {
    try {
      const receipt = await receiptsApi.getByPaymentId(paymentId);
      return receipt;
    } catch (error) {
      console.error('Failed to get receipt:', error);
      const errorMessage = error instanceof ApiError 
        ? `فشل في جلب الإيصال (${error.status}): ${error.message}`
        : 'فشل في جلب الإيصال. يرجى المحاولة مرة أخرى.';
      throw new Error(errorMessage);
    }
  }, []);

  // Refresh function
  const refreshStudents = useCallback(async () => {
    await loadStudents();
  }, [loadStudents]);

  return {
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
  };
};