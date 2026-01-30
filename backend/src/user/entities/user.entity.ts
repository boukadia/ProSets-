import { Role } from '@prisma/client';

export class User {
  id: number;
  auth0Id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
