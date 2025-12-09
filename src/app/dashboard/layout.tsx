
import { Suspense } from "react";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";

export const runtime = 'edge';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex font-raleway">
            <Suspense fallback={<div className="w-64 bg-das-dark h-full hidden md:block" />}>
                <DashboardSidebar />
            </Suspense>

            <div className="flex-1 md:ml-64">
                <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
                    <DashboardHeader />
                </Suspense>

                <main className="p-4 md:p-6 max-w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
