"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {UserButton} from '../../../components/UserButton';

type Props = {
  user: {
    name?: string;
    email?: string;
    image?: string;
    id?: string;
    role?: string
  } | null;
};

function Navbar({user}: Props) {

    // console.log("User in Navbar", user);
    
    const pathname = usePathname();

  return (
    <nav className='bg-secondary text-secondary-foreground flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm'>
      <div className='flex gap-x-2 items-center'>
        <Button asChild variant={pathname === "/home" ? "default" : "link"} size="sm" className='flex items-center justify-center p-4'>
            <Link href="/home">Home</Link>
        </Button>
        {user?.role === "admin" && (
          <Button asChild variant={pathname === "/admin" ? "default" : "link"} size="sm" className='flex items-center justify-center p-4'>
            <Link href="/admin">Admin</Link>
          </Button>
        )}
        <Button asChild variant={pathname === "/settings" ? "default" : "link"} size="sm" className='flex items-center justify-center p-4'>
            <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <UserButton user={user} />
    </nav>
  )
}

export default Navbar
