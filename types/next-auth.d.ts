import { ExtendedUser } from './next-auth.d';
import NextAuth , { type DefaultSession , DefaultUser  } from "next-auth";

export const ExtendedUser = DefaultSession & {
    role: 'user' | 'admin' | 'superadmin',
    isTwoFacorEnabled: boolean
}

declare module "next-auth" {
  interface Session {
    user: {
      role: ExtendedUser['role'];
      isTwoFactorEnabled: ExtendedUser['isTwoFactorEnabled'];
      name: string;
      email: string;
      image: string;
      id: string;
    }
  }
}
