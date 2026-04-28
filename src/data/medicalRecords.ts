import type { MedicalRecord, MedicalRecordStat } from '@/types/medicalRecord';

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: '1',
    patientName: 'Elena Lockwood',
    pid: '#PA-99231',
    recordType: 'X-RAY',
    fileName: 'chest_xray_final.dicom',
    uploadedDate: 'Oct 24, 2023',
    doctor: 'Dr. Julian Vance',
    initials: 'EL',
    initialsBg: 'bg-teal-100 text-teal-700'
  },
  {
    id: '2',
    patientName: 'Arthur Morgan',
    pid: '#PA-10442',
    recordType: 'MRI',
    fileName: 'lumbar_spine_scan.pdf',
    uploadedDate: 'Oct 22, 2023',
    doctor: 'Dr. Sarah Chen',
    initials: 'AM',
    initialsBg: 'bg-blue-100 text-blue-700'
  },
  {
    id: '3',
    patientName: 'Sienna Knight',
    pid: '#PA-88210',
    recordType: 'PRESCRIPTION',
    fileName: 'rx_diabetic_mgmt.pdf',
    uploadedDate: 'Oct 21, 2023',
    doctor: 'Dr. Julian Vance',
    initials: 'SK',
    initialsBg: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: '4',
    patientName: 'Thomas Reed',
    pid: '#PA-44201',
    recordType: 'REPORT',
    fileName: 'annual_health_summary.pdf',
    uploadedDate: 'Oct 19, 2023',
    doctor: 'Dr. Michael Ross',
    initials: 'TR',
    initialsBg: 'bg-slate-200 text-slate-700'
  }
];

export const MEDICAL_RECORDS_STATS: MedicalRecordStat[] = [
  {
    label: 'STORAGE USED',
    value: '42.8 GB',
    subtext: 'of 100 GB institutional limit',
    icon: 'storage'
  },
  {
    label: 'CERTIFIED RECORDS',
    value: '98.4%',
    subtext: '+0.2% improvement this month',
    icon: 'certified'
  },
  {
    label: 'RECENT ACTIVITY',
    value: '12 New',
    subtext: 'Records uploaded in last 24h',
    icon: 'activity'
  }
];
