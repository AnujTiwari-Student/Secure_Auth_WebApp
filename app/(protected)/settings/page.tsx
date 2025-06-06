import { auth } from "@/lib/auth";

const SettingPage = async () => {

    const session = await auth();
    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
                <p className="text-gray-600">You are not logged in.</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
            <p className="text-gray-600">This is the settings page.</p>
        </div>
    );
}

export default SettingPage;