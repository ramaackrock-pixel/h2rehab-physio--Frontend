import type { Invoice, BillingStat } from '../types/billing';

export const BILLING_STATS: BillingStat[] = [
  {
    title: 'TOTAL REVENUE',
    value: '₹1,42,850.00',
    trend: '+12% from last month',
    iconName: 'Banknote',
    variant: 'primary'
  },
  {
    title: 'PENDING COLLECTIONS',
    value: '₹12,420.50',
    subtext: '14 invoices pending',
    iconName: 'ClipboardCheck',
    variant: 'secondary'
  },
  {
    title: 'OVERDUE INVOICES',
    value: '₹3,150.00',
    subtext: 'Action required',
    iconName: 'AlertCircle',
    variant: 'destructive'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-9402',
    patientName: 'Alice Moore',
    initials: 'AM',
    initialsBg: 'bg-teal-100 text-teal-700',
    date: 'Oct 24, 2023',
    totalAmount: 450.00,
    paidAmount: 450.00,
    dueAmount: 0.00,
    status: 'PAID'
  },
  {
    id: 'INV-9405',
    patientName: 'James Bennett',
    initials: 'JB',
    initialsBg: 'bg-orange-100 text-orange-700',
    date: 'Oct 12, 2023',
    totalAmount: 1200.00,
    paidAmount: 0.00,
    dueAmount: 1200.00,
    status: 'OVERDUE'
  },
  {
    id: 'INV-9410',
    patientName: 'Sarah Reed',
    initials: 'SR',
    initialsBg: 'bg-blue-100 text-blue-700',
    date: 'Oct 26, 2023',
    totalAmount: 220.00,
    paidAmount: 0.00,
    dueAmount: 220.00,
    status: 'PENDING'
  },
  {
    id: 'INV-9412',
    patientName: 'Kevin Tsai',
    initials: 'KT',
    initialsBg: 'bg-purple-100 text-purple-700',
    date: 'Oct 20, 2023',
    totalAmount: 800.00,
    paidAmount: 300.00,
    dueAmount: 500.00,
    status: 'PARTIALLY PAID'
  },
  {
    id: 'INV-9398',
    patientName: 'David Lee',
    initials: 'DL',
    initialsBg: 'bg-teal-100 text-teal-700',
    date: 'Oct 18, 2023',
    totalAmount: 150.00,
    paidAmount: 150.00,
    dueAmount: 0.00,
    status: 'PAID'
  }
];
