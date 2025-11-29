import Header from "../components/Header"
import Footer from "../components/Footer"
import Login from "../components/Login"

export default function LoginPage() {
    return (
        <div>
            <Header />
            <div className="px-5 sm:px-10 md:px-32 min-h-[650px]">
                <Login />
            </div>
            <Footer />
        </div>
    )
}

