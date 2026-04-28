import type { Appointment } from '@/types/appointment';

export const INITIAL_APPOINTMENTS: Appointment[] = [
  { 
    id: 1, 
    time: '09:00 AM', 
    duration: '45 min session', 
    patientName: 'Alice Mertens', 
    initials: 'AM', 
    initialsBg: 'bg-teal-100 text-teal-700', 
    therapist: 'Dr. Sarah Miller', 
    branch: 'Main branch', 
    sessionType: 'Initial Consult', 
    status: 'CONFIRMED',
    details: {
      phone: '9988776655',
      email: 'alice.m@example.com',
      lastVisit: 'Oct 12, 2023',
      condition: 'Lower Back Pain',
      nextSteps: 'Follow-up in 2 weeks'
    }
  },
  { 
    id: 2, 
    time: '10:30 AM', 
    duration: '60 min session', 
    patientName: 'Robert White', 
    initials: 'RW', 
    initialsBg: 'bg-slate-200 text-slate-700', 
    therapist: 'Dr. James Wilson', 
    branch: 'Other branch', 
    sessionType: 'Follow-up', 
    status: 'PENDING',
    details: {
      phone: '9123456789',
      email: 'robert.w@example.com',
      lastVisit: 'Oct 20, 2023',
      condition: 'Post-op Knee Rehab',
      nextSteps: 'Check-in on range of motion'
    }
  },
  { 
    id: 3, 
    time: '08:15 AM', 
    duration: '30 min session', 
    patientName: 'Elena Lopez', 
    initials: 'EL', 
    initialsBg: 'bg-teal-100 text-teal-700', 
    therapist: 'Dr. Elena Costa', 
    branch: 'Main branch', 
    sessionType: 'Diagnostic', 
    status: 'COMPLETED',
    details: {
      phone: '8877665544',
      email: 'elena.l@example.com',
      lastVisit: 'Oct 24, 2023',
      condition: 'Shoulder Impingement',
      nextSteps: 'Home exercise program review'
    }
  },
  { 
    id: 4, 
    time: '11:45 AM', 
    duration: 'Cancelled by patient', 
    patientName: 'Samuel Kim', 
    initials: 'SK', 
    initialsBg: 'bg-pink-100 text-pink-700', 
    therapist: 'Dr. Sarah Miller', 
    branch: 'Main branch', 
    sessionType: 'Therapy', 
    status: 'CANCELLED',
    details: {
      phone: '7654321098',
      email: 'sam.kim@example.com',
      lastVisit: 'Sep 30, 2023',
      condition: 'Ankle Sprain',
      nextSteps: 'Reschedule requested'
    }
  },
  { 
    id: 5, 
    time: '02:00 PM', 
    duration: '45 min session', 
    patientName: 'Mark Benson', 
    initials: 'MB', 
    initialsBg: 'bg-blue-100 text-blue-700', 
    therapist: 'Dr. James Wilson', 
    branch: 'Other branch', 
    sessionType: 'Follow-up', 
    status: 'CONFIRMED',
    details: {
      phone: '9876543210',
      email: 'mark.b@example.com',
      lastVisit: 'Oct 15, 2023',
      condition: 'Chronic Neck Pain',
      nextSteps: 'Next session focused on posture'
    }
  },
];
