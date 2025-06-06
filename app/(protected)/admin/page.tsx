"use client";

import { RoleGate } from "@/components/roleGate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FormSuccess } from "@/components/ui/form-success";
import { UserRole } from "@prisma/client";

const AdminPage = () => {

  const onApiRouteClick = () => {
    fetch('/api/admin', {method: 'GET'})
      .then((res)=>{
        if (res.ok) {
          console.log("Success")
        }else{
          console.log("Error")
        }
      })
}

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.admin}>
          <FormSuccess message="You are authorized" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p>
              Admin-only API ROUTE
            </p>
            <Button onClick={onApiRouteClick}>
              Click to test!
            </Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p>
              Admin-only Server Action
            </p>
            <Button>
              Click to test!
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminPage;