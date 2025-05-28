import { ExtendedUser } from './next-auth.d';
import NextAuth , { type DefaultSession , DefaultUser  } from "next-auth";

export const ExtendedUser = DefaultSession & {
    role: 'user' | 'admin' | 'superadmin'
}

declare module "next-auth" {
  interface Session {
    user: {
      role: ExtendedUser['role'];
      name: string;
    }
  }
}
