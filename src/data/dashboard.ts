import type { UpcomingAppointment } from '@/types/dashboard';

// Stats for the top of the dashboard
// Note: In a real app, icons would be mapped in the component based on the stat type
export const DASHBOARD_STATS: any[] = [
  {
    title: 'TOTAL PATIENTS',
    value: '2,840',
    change: '+12%',
    trend: 'up',
    iconName: 'Users',
    iconBg: 'bg-[#ddf2fb]',
    trendBg: 'bg-green-100 text-green-700'
  },
  {
    title: 'APPOINTMENTS',
    value: '42',
    change: '+5%',
    trend: 'up',
    iconName: 'Calendar',
    iconBg: 'bg-[#ddf2fb]',
    trendBg: 'bg-green-100 text-green-700'
  },
  {
    title: 'REVENUE (MO)',
    value: '₹8,45,200',
    change: '-2%',
    trend: 'down',
    iconName: 'Banknote',
    iconBg: 'bg-[#ddf2fb]',
    trendBg: 'bg-red-100 text-red-700'
  },
  {
    title: 'PENDING',
    value: '₹1,12,000',
    change: 'Stable',
    trend: 'neutral',
    iconName: 'ClipboardClock',
    iconBg: 'bg-[#ddf2fb]',
    trendBg: 'bg-slate-200 text-slate-700'
  },
  {
    title: 'ACTIVE STAFF',
    value: '18/20',
    change: '100%',
    trend: 'up',
    iconName: 'BriefcaseMedical',
    iconBg: 'bg-[#ddf2fb]',
    trendBg: 'bg-green-100 text-green-700'
  }
];

export const UPCOMING_APPOINTMENTS: UpcomingAppointment[] = [
  {
    time: '14:30',
    period: 'PM',
    name: 'Aravind Iyer',
    therapist: 'Dr. Sarah Jain',
    status: 'CONFIRMED',
    statusColor: 'bg-teal-100 text-teal-700',
  },
  {
    time: '15:15',
    period: 'PM',
    name: 'Linda Peters',
    therapist: 'Dr. John Doe',
    status: 'PENDING',
    statusColor: 'bg-slate-100 text-slate-700',
  },
  {
    time: '16:00',
    period: 'PM',
    name: 'Vikram Seth',
    therapist: 'Dr. Sarah Jain',
    status: 'CONFIRMED',
    statusColor: 'bg-teal-100 text-teal-700',
  },
];

export const RECENT_PATIENTS = [
  {
    initials: 'MS',
    name: 'Meera Sharma',
    pid: 'PHY-10492',
    lastVisit: '24 Oct, 2023',
    status: 'ACTIVE',
    statusColor: 'bg-green-100 text-green-700',
    initialsBg: 'bg-yellow-100 text-yellow-600',
  },
  {
    initials: 'RK',
    name: 'Rajesh Kumar',
    pid: 'CHI-09821',
    lastVisit: '22 Oct, 2023',
    status: 'INACTIVE',
    statusColor: 'bg-red-100 text-red-700',
    initialsBg: 'bg-green-100 text-green-600',
  },
  {
    initials: 'AS',
    name: 'Anita Singh',
    pid: 'PHY-11204',
    lastVisit: '20 Oct, 2023',
    status: 'ACTIVE',
    statusColor: 'bg-green-100 text-green-700',
    initialsBg: 'bg-blue-100 text-blue-600',
  },
];
