import type { Doctor } from '../types/doctor';

export const INITIAL_DOCTORS: Doctor[] = [
  { 
    id: 'DOC-101', 
    name: 'Dr. Sarah Wilson', 
    specialization: 'Physiotherapist', 
    experience: '12 years', 
    email: 'sarah.w@physio.inc', 
    phone: '+91 98765 43210', 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71f153678e?auto=format&fit=crop&q=80&w=200'
  },
  { 
    id: 'DOC-102', 
    name: 'Dr. Michael Chen', 
    specialization: 'Orthopedic Surgeon', 
    experience: '15 years', 
    email: 'm.chen@physio.inc', 
    phone: '+91 98765 43211', 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200'
  },
  { 
    id: 'DOC-103', 
    name: 'Dr. Emily Brown', 
    specialization: 'Sports Medicine', 
    experience: '8 years', 
    email: 'e.brown@physio.inc', 
    phone: '+91 98765 43212', 
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200'
  },
];
