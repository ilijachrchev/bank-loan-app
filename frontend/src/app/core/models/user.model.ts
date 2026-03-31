export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Customer' | 'Banker';
}
