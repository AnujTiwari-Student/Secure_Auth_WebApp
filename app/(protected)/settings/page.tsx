"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";

const SettingPage = () => {

    const user = useCurrentUser();
    
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
            <p className="text-gray-600">{JSON.stringify(user)}</p>
        </div>
    );
}

export default SettingPage;