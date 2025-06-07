import { ExtendedUser } from './next-auth.d';
import NextAuth , { type DefaultSession , DefaultUser  } from "next-auth";

export const ExtendedUser = DefaultSession["user"] & {
    role: 'user' | 'admin' | 'superadmin',
    isTwoFacorEnabled: boolean,
    isOAuth: boolean
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}
