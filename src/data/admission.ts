import type { AdmittedPatient, Room } from '@/types/admission';

export const INITIAL_ADMITTED_PATIENTS: AdmittedPatient[] = [
  {
    id: 'ADM-001',
    patientId: 'PT-101',
    patientName: 'John Michael',
    roomNumber: '302',
    admissionDate: '2023-10-15',
    department: 'Orthopedics',
    attendingDoctor: 'Dr. Sarah Connor',
    status: 'ADMITTED',
    totalFees: 45000,
    paidFees: 15000
  },
  {
    id: 'ADM-002',
    patientId: 'PT-105',
    patientName: 'Emma Watson',
    roomNumber: '105',
    admissionDate: '2023-10-20',
    department: 'Physiotherapy',
    attendingDoctor: 'Dr. Julian Vance',
    status: 'ADMITTED',
    totalFees: 12000,
    paidFees: 12000
  }
];

export const INITIAL_ROOMS: Room[] = [
  { id: 'RM-101', number: '101', type: 'GENERAL', status: 'AVAILABLE', pricePerDay: 1500, department: 'Physiotherapy' },
  { id: 'RM-102', number: '102', type: 'GENERAL', status: 'OCCUPIED', pricePerDay: 1500, department: 'Physiotherapy' },
  { id: 'RM-105', number: '105', type: 'PRIVATE', status: 'OCCUPIED', pricePerDay: 5000, department: 'Physiotherapy' },
  { id: 'RM-302', number: '302', type: 'PRIVATE', status: 'OCCUPIED', pricePerDay: 5000, department: 'Orthopedics' },
  { id: 'RM-305', number: '305', type: 'ICU', status: 'AVAILABLE', pricePerDay: 12000, department: 'Emergency' }
];
