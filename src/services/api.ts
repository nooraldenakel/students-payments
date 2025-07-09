const API_BASE_URL = 'https://student-payment-app-production.up.railway.app';

// Types for API responses
export interface ApiStudent {
  id: string;
  name: string;
  department: string;
  studyLevel: string;
  birthPlace: string;
  roomNumber: string;
  floorNumber: string;
  dateAdded?: string;
  deletedAt?: string; // Add deletedAt field for soft deletion
}

export interface ApiPayment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  month: string;
  year: number;
  confirmed: boolean;
}

export interface ApiReceipt {
  id: string;
  paymentId: string;
  receiptNo: string;
  copyType: string;
}

export interface ApiReportsSummary {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalPayments: number;
  monthlyPayments: number;
  monthlyActiveCount: number;
}

// API Error handling
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }
      
      throw new ApiError(response.status, errorMessage);
    }

    // Handle empty responses (like DELETE operations)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    // Check if the response is JSON before attempting to parse
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // For non-JSON responses (like plain text success messages), return empty object
      return {} as T;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(0, `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Students API
export const studentsApi = {
  // Get all active students (without deletedAt field)
  getAll: (): Promise<ApiStudent[]> => 
    apiRequest<ApiStudent[]>('/students'),

  // Get all deleted students (with deletedAt field)
  getDeleted: (): Promise<ApiStudent[]> => 
    apiRequest<ApiStudent[]>('/students/deleted'),

  // Get student by ID
  getById: (studentId: string): Promise<ApiStudent> => 
    apiRequest<ApiStudent>(`/students/${studentId}`),

  // Add new student
  create: (studentData: Omit<ApiStudent, 'id' | 'dateAdded' | 'deletedAt'>): Promise<ApiStudent> => 
    apiRequest<ApiStudent>('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),

  // Update student
  update: (studentId: string, studentData: Omit<ApiStudent, 'id' | 'dateAdded' | 'deletedAt'>): Promise<ApiStudent> => 
    apiRequest<ApiStudent>(`/students/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(studentData),
    }),

  // Soft delete student (set deletedAt timestamp)
  softDelete: (studentId: string): Promise<ApiStudent> => 
    apiRequest<ApiStudent>(`/students/${studentId}/deleted-at`, {
      method: 'PATCH',
    }),

  // Restore student (remove deletedAt)
  restore: (studentId: string): Promise<ApiStudent> => 
    apiRequest<ApiStudent>(`/students/${studentId}/restore`, {
      method: 'PATCH',
    }),

  // Hard delete student - returns void since API returns plain text success message
  delete: (studentId: string): Promise<void> => 
    apiRequest<void>(`/students/${studentId}`, {
      method: 'DELETE',
    }),
};

// Payments API
export const paymentsApi = {
  // Get payments by student ID
  getByStudentId: (studentId: string): Promise<ApiPayment[]> => 
    apiRequest<ApiPayment[]>(`/students/${studentId}/payments`),

  // Add new payment
  create: (paymentData: {
    studentId: string;
    amount: number;
    date: string;
    month: string;
    year: number;
    confirmed: boolean;
  }): Promise<ApiPayment> => 
    apiRequest<ApiPayment>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    }),

  // Confirm payment - returns void since API returns plain text success message
  confirm: (paymentId: string): Promise<void> => 
    apiRequest<void>(`/payments/${paymentId}/confirm`, {
      method: 'PATCH',
    }),

  // Delete payment - returns void since API returns plain text success message
  delete: (paymentId: string): Promise<void> => 
    apiRequest<void>(`/payments/${paymentId}`, {
      method: 'DELETE',
    }),
};

// Receipts API
export const receiptsApi = {
  // Add new receipt
  create: (receiptData: {
    paymentId: string;
    receiptNo: string;
    copyType: string;
  }): Promise<ApiReceipt> => 
    apiRequest<ApiReceipt>('/receipts', {
      method: 'POST',
      body: JSON.stringify(receiptData),
    }),

  // Get receipt by payment ID
  getByPaymentId: (paymentId: string): Promise<ApiReceipt> => 
    apiRequest<ApiReceipt>(`/payments/${paymentId}/receipt`),

  // Get receipt by receipt ID
  getById: (receiptId: string): Promise<ApiReceipt> => 
    apiRequest<ApiReceipt>(`/receipts/${receiptId}`),

  // Delete receipt - returns void since API returns plain text success message
  delete: (receiptId: string): Promise<void> => 
    apiRequest<void>(`/receipts/${receiptId}`, {
      method: 'DELETE',
    }),
};

// Reports API
export const reportsApi = {
  // Get reports summary
  getSummary: (): Promise<ApiReportsSummary> => 
    apiRequest<ApiReportsSummary>('/reports/summary'),
};