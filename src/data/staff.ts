import type { StaffMember, AttendanceRecord, ScheduleRecord, PayrollRecord } from '../types/staff';

export const STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'STF-001',
    name: 'Dr. Elias Thorne',
    email: 'elias.thorne@serenity.com',
    role: 'Senior Specialist',
    department: 'Cardiology',
    branch: 'Main branch',
    mobile: '9876543210',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'STF-002',
    name: 'Sarah Jenkins',
    email: 's.jenkins@serenity.com',
    role: 'Head Nurse',
    department: 'Pediatrics',
    branch: 'Main branch',
    mobile: '9123456789',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'STF-003',
    name: 'Marcus Webb',
    email: 'm.webb@serenity.com',
    role: 'Admin Support',
    department: 'Operations',
    branch: 'Other branch',
    mobile: '8877665544',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'STF-004',
    name: 'Dr. Lena Voss',
    email: 'l.voss@serenity.com',
    role: 'Specialist',
    department: 'Orthodontics',
    branch: 'Other branch',
    mobile: '7654321098',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=100'
  }
];

export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'ATT-001',
    staffId: 'STF-005',
    staffName: 'Dr. Sarah Mitchell',
    role: 'Senior Surgeon',
    date: 'Oct 27, 2023',
    status: 'Present',
    checkInTime: '08:45 AM',
    remarks: 'On time for rounds',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ATT-002',
    staffId: 'STF-006',
    staffName: 'Marcus Chen',
    role: 'Lab Technician',
    date: 'Oct 27, 2023',
    status: 'Late',
    checkInTime: '09:12 AM',
    remarks: 'Traffic incident reported',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ATT-003',
    staffId: 'STF-007',
    staffName: 'Elena Rodriguez',
    role: 'Charge Nurse',
    date: 'Oct 27, 2023',
    status: 'Leave',
    checkInTime: '--:--',
    remarks: 'Scheduled PTO',
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ATT-004',
    staffId: 'STF-008',
    staffName: 'James Kim',
    role: 'Front Desk Lead',
    date: 'Oct 27, 2023',
    status: 'Present',
    checkInTime: '08:02 AM',
    remarks: 'Early arrival',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'ATT-005',
    staffId: 'STF-009',
    staffName: 'Linda Wu',
    role: 'Radiologist',
    date: 'Oct 27, 2023',
    status: 'Absent',
    checkInTime: '--:--',
    remarks: 'Medical emergency',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
  }
];

export const STAFF_SCHEDULES: ScheduleRecord[] = [
  {
    id: 'SCH-001',
    staffId: 'STF-010',
    staffName: 'Dr. Julianna Dorne',
    role: 'Senior Cardiologist',
    shift: 'Morning',
    workingHours: '08:00 AM - 04:00 PM',
    assignedBranch: 'Central Clinic, Wing A',
    days: ['M', 'T', 'W', 'T', 'F', 'S'],
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'SCH-002',
    staffId: 'STF-011',
    staffName: 'Marcus Wright',
    role: 'Head Nurse',
    shift: 'Night',
    workingHours: '10:00 PM - 06:00 AM',
    assignedBranch: 'North Branch, ER',
    days: ['M', 'T', 'W', 'T', 'F', 'S'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'SCH-003',
    staffId: 'STF-012',
    staffName: 'Sarah Chen',
    role: 'Lab Technician',
    shift: 'Evening',
    workingHours: '02:00 PM - 10:00 PM',
    assignedBranch: 'Central Clinic, Lab B',
    days: ['M', 'T', 'W', 'T', 'F', 'S'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
  }
];

export const PAYROLL_RECORDS: PayrollRecord[] = [
  {
    id: 'PAY-001',
    staffId: 'STF-013',
    staffName: 'Dr. Sarah Alston',
    role: 'Senior Cardiologist',
    daysPresent: '22/22',
    salary: 1250000,
    deductions: 45000,
    bonus: 120000,
    netPay: 1325000,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'PAY-002',
    staffId: 'STF-014',
    staffName: 'Markus Weber',
    role: 'Head Nurse',
    daysPresent: '21/22',
    salary: 680000,
    deductions: 12000,
    bonus: 40000,
    netPay: 708000,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'PAY-003',
    staffId: 'STF-015',
    staffName: 'Elena Lopez',
    role: 'Lab Technician',
    daysPresent: '22/22',
    salary: 520000,
    deductions: 0,
    bonus: 15000,
    netPay: 535000,
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 'PAY-004',
    staffId: 'STF-016',
    staffName: 'Julianne Moore',
    role: 'Clinic Administrator',
    daysPresent: '20/22',
    salary: 450000,
    deductions: 38000,
    bonus: 0,
    netPay: 412000,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100'
  }
];
