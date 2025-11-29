import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Profile from "@/components/Profile/Profile"

export default function ProfilePage() {
    return (
        <div>
            <Header />
            {/* //TODO: need to add tab navigation later */}
            <div className="px-5 sm:px-10 md:px-32 min-h-[650px]">
                <Profile />
            </div>
            <Footer />
        </div>
    )
}
