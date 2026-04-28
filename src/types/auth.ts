export type Role = 'superadmin' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
