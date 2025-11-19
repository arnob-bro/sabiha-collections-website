import { Link } from "react-router-dom"
import SignupForm from "./SignupForm"
import Breadcrumbs from "../../Breadcrumbs"

export default function Signup() {
    return (
        <div className="px-72">
            <Breadcrumbs />
            <div className="py-20 min-h-[610px]">
                <div className="w-[400px] block mx-auto">
                    <h2 className="text-center text-3xl mb-5 font-semibold">
                        Register Account
                    </h2>
                    <SignupForm />

                    <div className="mt-4 text-center">
                        <span className="mr-2">Already a member?</span>
                        <Link
                            to="/account/login"
                            className="text-blue-500 hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
