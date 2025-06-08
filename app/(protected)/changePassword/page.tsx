
"use client"

import { ChangePasswordForm } from '@/components/ChangePasswordForm'
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { redirect } from 'next/navigation';
import React from 'react'

function page() {

  const user = useCurrentUser();

  if(user.isOAuth){
    redirect("/home");
  }

  return (
    <ChangePasswordForm />
  )
}

export default page
