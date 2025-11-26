import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import logo from "../../assets/Home/logosm.svg"
import Lock from "../../assets/Home/lock.svg"
import { useResetPassword } from "@/api/hooks/Auth/useAuth"
import { toast } from "sonner"
import { useSearchParams } from "react-router-dom"

export const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [searchParams] = useSearchParams()
    const token = searchParams.get('token') || ''

    const { mutate: resetPassword, isPending } = useResetPassword()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!newPassword || !confirmPassword) {
            toast.error("Please fill in all fields!")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!")
            return
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long!")
            return
        }

        if (!token) {
            toast.error("Invalid reset token!")
            return
        }

        resetPassword({
            token,
            newPassword: newPassword
        }, {
            onSuccess: (data) => {
                toast.success(data.message || "Password reset successfully!")
            },
            onError: (error: any) => {
                toast.error(error?.message || "Failed to reset password. Please try again.")
            }
        })
    }

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <div className="w-md space-y-4 text-center mx-auto mt-10">
            <div className="flex flex-col items-center space-y-4">
                <img src={logo} alt="logo" className="w-14 h-14 mb-3" />
                <h2 className="text-xl font-medium tracking-wide">
                    Reset password
                </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3 text-gray-300 tracking-wider w-[280px] mx-auto">
                Please create a strong password with at least 8 characters.
            </p>

            <form className="space-y-4 text-left !pt-4 w-sm mx-auto" onSubmit={handleSubmit}>
                {/* New Password Input */}
                <div className={`flex items-center px-4 glass !rounded-lg py-[2px]`}
                    style={{
                        background: 'rgba(20, 20, 20, 0.30)',
                    }}>
                    <img src={Lock} alt="" />
                    <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="mt-1 !bg-transparent focus:!outline-none focus:!ring-0 focus:!border-0 border-0 !outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                    {newPassword && (
                        <button
                            type="button"
                            onClick={toggleNewPasswordVisibility}
                            className="ml-2 text-gray-400 hover:text-gray-300 transition-colors">
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div className={`flex items-center px-4 glass !rounded-lg py-[2px]`}
                    style={{
                        background: 'rgba(20, 20, 20, 0.30)',
                    }}>
                    <img src={Lock} alt="" />
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="mt-1 !bg-transparent focus:!outline-none focus:!ring-0 focus:!border-0 border-0 !outline-none"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                    {confirmPassword && (
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="ml-2 text-gray-400 hover:text-gray-300 transition-colors">
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full special-btn font-semibold py-6 text-base tracking-wider mt-4"
                    disabled={isPending}
                >
                    {isPending ? "Updating..." : "Update password"}
                </Button>
            </form>
        </div>
    )
}