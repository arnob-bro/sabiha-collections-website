import { Outlet } from "react-router-dom"
import { AdminSidebar } from "@/components/Admin/AdminSidebar"
import Header from "@/components/Header/Header"
import Footer from "@/components/Footer"

export default function AdminPage() {
    return (
        <>
            <Header />
            <div className="min-h-[60vh] bg-gray-50">
                <div className=" py-8 px-5 md:px-10 lg:px-32">
                    <div className="flex rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        <AdminSidebar />
                        <main className="flex-1 p-6 bg-gray-50 min-h-[60vh]">
                            <Outlet />
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
