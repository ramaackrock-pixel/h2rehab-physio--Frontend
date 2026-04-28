import type { Patient } from '@/types/patient';

export const INITIAL_PATIENTS: Patient[] = [
  { 
    initials: 'JM', name: 'Julianne Moore', demographics: 'Female • 42 yrs', id: 'PID-8829-X', branch: 'Main branch', contact: '9876543210', lastVisit: '10/24/2023', status: 'ACTIVE', statusColor: 'bg-green-100 text-green-700', consultedBy: 'Dr. Elias Thorne', 
    diseases: ['Chronic Hypertension', 'Type 2 Diabetes'], conditions: ['Lower Back Pain', 'Sciatica'], assignments: ['Daily Physiotherapy', 'Mobility Training'], assignedDoctor: 'Dr. Elias Thorne',
    initialsBg: 'bg-teal-100 text-teal-700', address: '123 Main St, Chennai'
  },
  { 
    initials: 'AI', name: 'Aravind Iyer', demographics: 'Male • 35 yrs', id: 'PID-9012-Y', branch: 'Other branch', contact: '9123456789', lastVisit: '11/02/2023', status: 'CRITICAL', statusColor: 'bg-red-100 text-red-700', consultedBy: 'Dr. Sarah Mitchell', 
    diseases: ['Acute Spondylitis'], conditions: ['Severe Neck Stiffness', 'Migraine'], assignments: ['Emergency Cervical Traction'], assignedDoctor: 'Dr. Sarah Mitchell',
    initialsBg: 'bg-orange-100 text-orange-700' 
  },
  { 
    initials: 'EM', name: 'Elena Mitskova', demographics: 'Female • 29 yrs', id: 'PID-7761-A', branch: 'Main branch', contact: '8877665544', lastVisit: '10/30/2023', status: 'DISCHARGED', statusColor: 'bg-slate-200 text-slate-600', consultedBy: 'Dr. Lena Voss', 
    diseases: ['Post-Op Knee Rehab'], conditions: ['ACL Tear Recovery'], assignments: ['Home Exercise Program'], assignedDoctor: 'Dr. Lena Voss',
    initialsBg: 'bg-slate-200 text-slate-700' 
  },
  { 
    initials: 'CW', name: 'Chen Wei', demographics: 'Male • 58 yrs', id: 'PID-1104-M', branch: 'Other branch', contact: '7654321098', lastVisit: '11/05/2023', status: 'ACTIVE', statusColor: 'bg-green-100 text-green-700', consultedBy: 'Dr. Julianna Dorne', 
    diseases: ['Osteoarthritis'], conditions: ['Hip Pain', 'Reduced Mobility'], assignments: ['Hydrotherapy', 'Joint Mobilization'], assignedDoctor: 'Dr. Julianna Dorne',
    initialsBg: 'bg-teal-100 text-teal-700', address: '123 Main St, Chennai'
  },
  { 
    initials: 'SH', name: 'Sarah Hyland', demographics: 'Female • 31 yrs', id: 'PID-4420-L', branch: 'Main branch', contact: '9988776655', lastVisit: '11/03/2023', status: 'PENDING', statusColor: 'bg-teal-100 text-teal-700', consultedBy: 'Dr. Elias Thorne', 
    diseases: ['Asthma'], conditions: ['Ankle Sprain (Grade II)'], assignments: ['Balance Training', 'Manual Therapy'], assignedDoctor: 'Dr. Sarah Mitchell',
    initialsBg: 'bg-orange-100 text-orange-700' 
  },
  { 
    initials: 'JD', name: 'John Doe', demographics: 'Male • 45 yrs', id: 'PID-1234-A', branch: 'Other branch', contact: '9000012345', lastVisit: '10/15/2023', status: 'ACTIVE', statusColor: 'bg-green-100 text-green-700', consultedBy: 'Dr. Sarah Mitchell', 
    diseases: ['Herniated Disc'], conditions: ['Lumbar Pain'], assignments: ['Core Strengthening', 'Postural Correction'], assignedDoctor: 'Dr. Sarah Mitchell',
    initialsBg: 'bg-blue-100 text-blue-700' 
  },
  { 
    initials: 'JS', name: 'Jane Smith', demographics: 'Female • 38 yrs', id: 'PID-5678-B', branch: 'Main branch', contact: '9111122222', lastVisit: '11/10/2023', status: 'PENDING', statusColor: 'bg-teal-100 text-teal-700', consultedBy: 'Dr. Lena Voss', 
    diseases: ['Carpal Tunnel Syndrome'], conditions: ['Wrist Pain'], assignments: ['Ultrasound Therapy', 'Splinting'], assignedDoctor: 'Dr. Lena Voss',
    initialsBg: 'bg-pink-100 text-pink-700' 
  },
  { 
    initials: 'MW', name: 'Michael Wong', demographics: 'Male • 52 yrs', id: 'PID-9101-C', branch: 'Other branch', contact: '9222233333', lastVisit: '10/20/2023', status: 'ACTIVE', statusColor: 'bg-green-100 text-green-700', consultedBy: 'Dr. Julianna Dorne', 
    diseases: ['Frozen Shoulder'], conditions: ['Stiff Joint'], assignments: ['Range of Motion Exercises'], assignedDoctor: 'Dr. Julianna Dorne',
    initialsBg: 'bg-indigo-100 text-indigo-700' 
  },
  { 
    initials: 'LG', name: 'Linda Garcia', demographics: 'Female • 31 yrs', id: 'PID-1213-D', branch: 'Main branch', contact: '9333344444', lastVisit: '11/01/2023', status: 'CRITICAL', statusColor: 'bg-red-100 text-red-700', consultedBy: 'Dr. Elias Thorne', 
    diseases: ['Rheumatoid Arthritis'], conditions: ['Swollen Joints', 'Fatigue'], assignments: ['Consultation with Rheumatologist'], assignedDoctor: 'Dr. Elias Thorne',
    initialsBg: 'bg-red-100 text-red-700' 
  },
  { 
    initials: 'RB', name: 'Robert Brown', demographics: 'Male • 60 yrs', id: 'PID-1415-E', branch: 'Other branch', contact: '9444455555', lastVisit: '10/25/2023', status: 'DISCHARGED', statusColor: 'bg-slate-200 text-slate-600', consultedBy: 'Dr. Sarah Mitchell', 
    diseases: ['Post-Stroke Rehab'], conditions: ['Left Side Weakness'], assignments: ['Gait Training'], assignedDoctor: 'Dr. Sarah Mitchell',
    initialsBg: 'bg-gray-100 text-gray-700' 
  },
  { 
    initials: 'AM', name: 'Alice Miller', demographics: 'Female • 27 yrs', id: 'PID-1617-F', branch: 'Main branch', contact: '9555566666', lastVisit: '11/08/2023', status: 'ACTIVE', statusColor: 'bg-green-100 text-green-700', consultedBy: 'Dr. Lena Voss', 
    diseases: ['Scoliosis'], conditions: ['Back Pain'], assignments: ['Schroth Method Exercises'], assignedDoctor: 'Dr. Lena Voss',
    initialsBg: 'bg-green-100 text-green-700' 
  },
  { 
    initials: 'DK', name: 'David Kim', demographics: 'Male • 33 yrs', id: 'PID-1819-G', branch: 'Other branch', contact: '9666677777', lastVisit: '10/12/2023', status: 'PENDING', statusColor: 'bg-teal-100 text-teal-700', consultedBy: 'Dr. Julianna Dorne', 
    initialsBg: 'bg-yellow-100 text-yellow-700', diseases: ['Spondylitis'], conditions: ['Neck Pain'], assignments: ['Traction'], assignedDoctor: 'Dr. Julianna Dorne'
  },
  { 
    initials: 'SN', name: 'Susan Nelson', demographics: 'Female • 50 yrs', id: 'PID-2021-H', branch: 'Main branch', contact: '9777788888', lastVisit: '11/12/2023', status: 'ACTIVE', statusColor: 'bg-green-100 text-green-700', consultedBy: 'Dr. Elias Thorne', 
    initialsBg: 'bg-purple-100 text-purple-700', diseases: ['Hypertension'], conditions: ['Knee Pain'], assignments: ['Weight Management'], assignedDoctor: 'Dr. Elias Thorne'
  },
  { 
    initials: 'TP', name: 'Thomas Parker', demographics: 'Male • 41 yrs', id: 'PID-2223-I', branch: 'Other branch', contact: '9888899999', lastVisit: '10/30/2023', status: 'CRITICAL', statusColor: 'bg-red-100 text-red-700', consultedBy: 'Dr. Sarah Mitchell', 
    initialsBg: 'bg-cyan-100 text-cyan-700', diseases: ['Diabetes'], conditions: ['Neuropathy'], assignments: ['Foot Care'], assignedDoctor: 'Dr. Sarah Mitchell'
  },
  { 
    initials: 'EC', name: 'Emily Clark', demographics: 'Female • 22 yrs', id: 'PID-2425-J', branch: 'Main branch', contact: '9999900000', lastVisit: '11/15/2023', status: 'DISCHARGED', statusColor: 'bg-slate-200 text-slate-600', consultedBy: 'Dr. Lena Voss', 
    initialsBg: 'bg-rose-100 text-rose-700', diseases: ['Migraine'], conditions: ['Neck Tension'], assignments: ['Relaxation Techniques'], assignedDoctor: 'Dr. Lena Voss'
  },
  { 
    initials: 'KA', name: 'Kevin Adams', demographics: 'Male • 29 yrs', id: 'PID-2627-K', branch: 'Other branch', contact: '9012345678', lastVisit: '10/05/2023', status: 'ACTIVE', statusColor: 'bg-green-100 text-green-700', consultedBy: 'Dr. Julianna Dorne', 
    initialsBg: 'bg-emerald-100 text-emerald-700', diseases: ['Anxiety'], conditions: ['Shoulder Pain'], assignments: ['Mindfulness'], assignedDoctor: 'Dr. Julianna Dorne'
  },
  { 
    initials: 'ML', name: 'Maria Lopez', demographics: 'Female • 47 yrs', id: 'PID-2829-L', branch: 'Main branch', contact: '9234567890', lastVisit: '11/04/2023', status: 'PENDING', statusColor: 'bg-teal-100 text-teal-700', consultedBy: 'Dr. Elias Thorne', 
    initialsBg: 'bg-amber-100 text-amber-700', diseases: ['Obesity'], conditions: ['Back Pain'], assignments: ['Exercise Plan'], assignedDoctor: 'Dr. Elias Thorne'
  },
  { 
    initials: 'SR', name: 'Steven Reed', demographics: 'Male • 36 yrs', id: 'PID-3031-M', branch: 'Other branch', contact: '9345678901', lastVisit: '10/18/2023', status: 'ACTIVE', statusColor: 'bg-green-100 text-green-700', consultedBy: 'Dr. Sarah Mitchell', 
    initialsBg: 'bg-slate-100 text-slate-700', diseases: ['Asthma'], conditions: ['Joint Stiffness'], assignments: ['Cardio'], assignedDoctor: 'Dr. Sarah Mitchell'
  },
  { 
    initials: 'BA', name: 'Barbara Allen', demographics: 'Female • 55 yrs', id: 'PID-3233-N', branch: 'Main branch', contact: '9456789012', lastVisit: '11/02/2023', status: 'CRITICAL', statusColor: 'bg-red-100 text-red-700', consultedBy: 'Dr. Lena Voss', 
    initialsBg: 'bg-orange-100 text-orange-700', diseases: ['Arthritis'], conditions: ['Hip Pain'], assignments: ['Physical Therapy'], assignedDoctor: 'Dr. Lena Voss'
  },
  { 
    initials: 'CH', name: 'Christopher Hill', demographics: 'Male • 42 yrs', id: 'PID-3435-O', branch: 'Other branch', contact: '9567890123', lastVisit: '10/22/2023', status: 'DISCHARGED', statusColor: 'bg-slate-200 text-slate-600', consultedBy: 'Dr. Julianna Dorne', 
    initialsBg: 'bg-blue-100 text-blue-700', diseases: ['Depression'], conditions: ['Chronic Fatigue'], assignments: ['Counseling'], assignedDoctor: 'Dr. Julianna Dorne'
  },
];
