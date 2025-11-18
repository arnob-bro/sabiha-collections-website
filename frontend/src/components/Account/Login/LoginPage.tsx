import LoginForm from "./LoginForm"

export default function LoginPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-amber-300 to-indigo-600 relative overflow-hidden">
            {/* Background color */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-10 -left-10 w-52 h-52 rounded-full bg-white/10 blur"></div>
                <div className="absolute top-1/3 right-10 w-72 h-72 rounded-full bg-white/10 blur"></div>
                <div className="absolute bottom-10 left-1/4 w-24 h-24 rounded-full bg-white/10 blur"></div>
            </div>

            {/* Form */}
            <div>
                <div className="p-8 bg-white/50 rounded-lg">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
