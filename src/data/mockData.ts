import { Student } from '../types';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    department: 'كلية الطب',
    studyLevel: 'السنة الثالثة',
    birthPlace: 'الرياض',
    roomNumber: '101',
    floorNumber: '1',
    dateAdded: '2024-01-15',
    payments: [
      {
        id: 'p1',
        amount: 1500,
        date: '2024-01-15',
        month: 'January',
        year: 2024,
        confirmed: true
      },
      {
        id: 'p2',
        amount: 1500,
        date: '2024-02-15',
        month: 'February',
        year: 2024,
        confirmed: true
      },
      {
        id: 'p3',
        amount: 1500,
        date: '2024-03-15',
        month: 'March',
        year: 2024,
        confirmed: false
      }
    ]
  },
  {
    id: '2',
    name: 'فاطمة عبدالله السالم',
    department: 'كلية الهندسة',
    studyLevel: 'السنة الثانية',
    birthPlace: 'جدة',
    roomNumber: '205',
    floorNumber: '2',
    dateAdded: '2024-01-20',
    payments: [
      {
        id: 'p4',
        amount: 1200,
        date: '2024-01-20',
        month: 'January',
        year: 2024,
        confirmed: true
      },
      {
        id: 'p5',
        amount: 1200,
        date: '2024-02-20',
        month: 'February',
        year: 2024,
        confirmed: true
      }
    ]
  },
  {
    id: '3',
    name: 'خالد عبدالعزيز النصر',
    department: 'كلية العلوم',
    studyLevel: 'السنة الأولى',
    birthPlace: 'الدمام',
    roomNumber: '312',
    floorNumber: '3',
    dateAdded: '2024-02-01',
    payments: [
      {
        id: 'p6',
        amount: 1000,
        date: '2024-02-01',
        month: 'February',
        year: 2024,
        confirmed: true
      }
    ]
  },
  {
    id: '4',
    name: 'نورا سعد الغامدي',
    department: 'كلية الآداب',
    studyLevel: 'السنة الرابعة',
    birthPlace: 'مكة المكرمة',
    roomNumber: '418',
    floorNumber: '4',
    dateAdded: '2024-02-10',
    payments: [
      {
        id: 'p7',
        amount: 800,
        date: '2024-02-10',
        month: 'February',
        year: 2024,
        confirmed: false
      }
    ]
  },
  {
    id: '5',
    name: 'عبدالرحمن محمد القحطاني',
    department: 'كلية إدارة الأعمال',
    studyLevel: 'السنة الثالثة',
    birthPlace: 'أبها',
    roomNumber: '523',
    floorNumber: '5',
    dateAdded: '2024-02-15',
    payments: [
      {
        id: 'p8',
        amount: 1300,
        date: '2024-02-15',
        month: 'February',
        year: 2024,
        confirmed: true
      },
      {
        id: 'p9',
        amount: 1300,
        date: '2024-03-15',
        month: 'March',
        year: 2024,
        confirmed: true
      }
    ]
  }
];