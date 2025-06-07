"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/roleGate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { FormSuccess } from "@/components/ui/form-success";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {

  const onServerRouteClick = () => {
    admin()
      .then((res)=>{
        if (res.success) {
          toast.success(res.success);
          console.log("Success")
        }else{
          toast.error(res.error);
          console.log("Error")
        }
      })
  }

  const onApiRouteClick = () => {
    fetch('/api/admin', {method: 'GET'})
      .then((res)=>{
        if (res.ok) {
          toast.success("Success");
          console.log("Success")
        }else{
          toast.error("Error");
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
            <Button onClick={onServerRouteClick}>
              Click to test!
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminPage;