import Link from "next/link";
import Register from "./signUp";


export default function SignIn() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-card text-center p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
                <div className="text-black">
                    <h1 className="font-bold text-xl sm:text-2xl">Register</h1>
                    <Register />
                    <p className="text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <Link href="/logIn" className="text-blue-500 hover:underline">
                            LogIn
                        </Link>
                    </p>
                </div>
            </div>
        </div>

    )
}