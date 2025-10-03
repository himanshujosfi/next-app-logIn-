import ResetPasswordUi from "./resetPage";


export default function LogInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-card text-center p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
                <div className="text-black">
                    <h1 className="font-bold text-xl sm:text-2xl">Password Reset </h1>
                    <ResetPasswordUi />
                </div>
            </div>
        </div>

    )
}