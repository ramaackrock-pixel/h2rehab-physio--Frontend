export type InvoiceStatus = 'PAID' | 'OVERDUE' | 'PENDING' | 'PARTIALLY PAID';

export interface Invoice {
  id: string;
  patientName: string;
  pid?: string;
  patientId?: string;
  initials: string;
  initialsBg: string; // Tailwind class, e.g., 'bg-teal-100 text-teal-700'
  date: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  branch?: string;
}

export interface BillingStat {
  title: string;
  value: string;
  trend?: string;
  subtext?: string;
  iconName: 'Banknote' | 'ClipboardCheck' | 'AlertCircle';
  variant: 'primary' | 'secondary' | 'accent' | 'destructive';
}
