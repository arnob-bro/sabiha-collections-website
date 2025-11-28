import Header from "../components/Header"
import Footer from "../components/Footer"
import Signup from "../components/Signup"

export default function SignupPage() {
    return (
        <div>
            <Header />
            <div className="px-5 sm:px-10 md:px-32 min-h-[650px]">
                <Signup />
            </div>
            <Footer />
        </div>
    )
}

