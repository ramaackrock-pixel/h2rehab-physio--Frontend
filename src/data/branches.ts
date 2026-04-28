import type { ClinicBranch } from '../types/branches';

export const CLINIC_BRANCHES: ClinicBranch[] = [
  {
    id: 'BR-101',
    name: 'Main branch',
    address: 'No 15/4b kellys road ,Kilpauk ,Chennai 10',
    manager: 'Dr. Elias Thorne',
    phone: '9123456789',
    staffCount: 18,
    patientCount: 1450,
    totalRevenue: 2854000,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
    performance: {
      weeklyRevenue: [40000, 45000, 42000, 48000, 46000, 50000, 52000],
      revenueGrowth: 12.5
    }
  },
  {
    id: 'BR-102',
    name: 'Other branch',
    address: 'No 52/83 Bazulaah road,T nagar,Chennai 17',
    manager: 'Dr. Lena Voss',
    phone: '9876543210',
    staffCount: 12,
    patientCount: 890,
    totalRevenue: 1240500,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1586773860418-d373a56635bd?auto=format&fit=crop&q=80&w=600',
    performance: {
      weeklyRevenue: [20000, 22000, 21000, 19000, 23000, 25000, 24000],
      revenueGrowth: 8.2
    }
  }
];
