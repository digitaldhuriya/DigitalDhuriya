import { Role } from '@digital-dhuriya/database';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}

