import { useState } from "react"
import { FaEye, FaEyeSlash, FaUser, FaLock, FaPhone } from "react-icons/fa"
import { MdOutlineMail } from "react-icons/md"

import { Roles, type User } from "../types/user"

interface SignupFormProps {
    onSubmit: (data: User) => void
    isLoading: boolean
    isSuccess: boolean
}

// Error is called localError for now

export default function SignupForm({
    onSubmit,
    isLoading,
    isSuccess,
}: SignupFormProps) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false)

    // const [isLoading, setIsLoading] = useState(false);
    // const [role, setRole] = useState<Role>(Roles.user); // default role

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const payload: User = {
            first_name: firstName,
            last_name: lastName,
            phone,
            role: Roles.user,
            email,
            password,
        }
        onSubmit(payload)

        if (isSuccess) {
            setFirstName("")
            setLastName("")
            setPhone("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
        }

        // error checking lagbe na. server handles errors.
        // if (!firstName || !lastName) {
        // 	setError("Please provide both first name and last name.");
        // 	return;
        // }

        if (password !== confirmPassword) {
            setPasswordMismatch(!passwordMismatch)
            return
        }
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-2">
                {/* First name */}
                <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition disabled:bg-gray-100"
                    />
                </div>

                {/* Last name */}
                <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition disabled:bg-gray-100"
                    />
                </div>
            </div>

            {/* Phone */}
            <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition disabled:bg-gray-100"
                />
            </div>

            {/* Email */}
            <div className="relative">
                <MdOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition disabled:bg-gray-100"
                />
            </div>

            {/* Password */}
            <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition disabled:bg-gray-100"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            {/* Confirm password */}
            <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition disabled:bg-gray-100"
                />
                <p className="text-red-500">Password doesn't match</p>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-black to-gray-800 cursor-pointer transition">
                {isLoading ? "Signing up..." : "Sign Up"}
            </button>

            {/* {localError && (
				<div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm'>
					⚠ {localError}
				</div>
			)} */}
        </form>
    )
}
