export interface AppointmentDetails {
  phone: string;
  email: string;
  lastVisit: string;
  condition: string;
  nextSteps: string;
}

export interface Appointment {
  id: number;
  time: string;
  duration: string;
  appointmentDate?: string;
  patientName: string;
  pid?: string;
  initials: string;
  initialsBg: string;
  therapist: string;
  branch: string;
  sessionType: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  details: AppointmentDetails;
}
