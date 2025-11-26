import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import logo from "../../assets/Home/logosm.svg"
import Mail from "../../assets/Home/mail.svg"
import { useForgotPassword, useResendVerification } from "@/api/hooks/Auth/useAuth"
import { toast } from "sonner"

let colorGreen = '#14E893'

export const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [isEmailSent, setIsEmailSent] = useState(false)

    const { mutate: forgotPassword, isPending: isSending } = useForgotPassword()
    const { mutate: resendVerification, isPending: isResending } = useResendVerification()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isEmailSent) {
            forgotPassword({ email }, {
                onSuccess: () => {
                    toast.success("Password reset email sent successfully!")
                    setIsEmailSent(true)
                },
                onError: (error: any) => {
                    toast.error(error?.message || "Failed to send reset email. Please try again.")
                }
            })
        } else {
            handleResendCode()
        }
    }

    const handleResendCode = () => {
        if (!email) {
            toast.error("Please enter your email first")
            return
        }

        resendVerification({ email }, {
            onSuccess: () => {
                toast.success("Reset email resent successfully!")
            },
            onError: (error: any) => {
                toast.error(error?.message || "Failed to resend email. Please try again.")
            }
        })
    }

    return (
        <div className="w-md space-y-4 text-center mx-auto mt-10">
            <div className="flex flex-col items-center space-y-4">
                <img src={logo} alt="logo" className="w-14 h-14 mb-3" />
                <h2 className="text-xl font-medium tracking-wide">
                    Forgot password
                </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-3 text-gray-300 tracking-wider">
                {!isEmailSent
                    ? "Enter your email below, you will receive an email with instructions on how to reset your password in a few minutes. You can also set a new password if you've never set one before."
                    : "Reset email sent! Check your inbox for the password reset link. Didn't receive it?"
                }
            </p>

            <form className="space-y-4 text-left !pt-6 w-sm mx-auto" onSubmit={handleSubmit}>
                <div
                    className="flex items-center px-4 glass !rounded-lg py-[2px]"
                    style={{
                        background: 'rgba(20, 20, 20, 0.30)',
                    }}
                >
                    <img src={Mail} alt="Email icon" />
                    <Input
                        type="email"
                        placeholder="Enter email address"
                        className="mt-1 !bg-transparent focus:!outline-none focus:!ring-0 focus:!border-0 border-0 !outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {isEmailSent && (
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={isResending}
                            className={`text-[${colorGreen}] text-xs text-nowrap cursor-pointer disabled:opacity-50`}
                        >
                            {isResending ? "Sending..." : "Resend email"}
                        </button>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full special-btn font-semibold py-6 text-base tracking-wider mt-4"
                    disabled={isSending || isResending}
                >
                    {isSending
                        ? "Sending..."
                        : !isEmailSent
                            ? "Send Reset Email"
                            : "Resend Email"
                    }
                </Button>
            </form>

            {isEmailSent && (
                <p className="text-xs text-muted-foreground mt-4">
                    Check your spam folder if you don't see the email in your inbox.
                </p>
            )}
        </div>
    )
}