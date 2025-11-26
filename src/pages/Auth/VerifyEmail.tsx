import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useVerifyEmail } from "../../api/hooks/Auth/useAuth"
import { toast } from "sonner"
import logo from "../../assets/Home/logosm.svg"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

let colorGreen = '#14E893'
let colorRed = '#FF0044'

export const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')

    const { mutate: verifyEmail } = useVerifyEmail()

    useEffect(() => {
        if (!token) {
            setVerificationStatus('error')
            toast.error("Invalid verification link!")
            return
        }

        // Automatically verify email when component mounts
        verifyEmail({
            token
        }, {
            onSuccess: () => {
                setVerificationStatus('success')
                toast.success("Email verified successfully! Redirecting to dashboard...")
            },
            onError: (error: any) => {
                setVerificationStatus('error')
                toast.error(error?.message || "Email verification failed. Please try again.")
            }
        })
    }, [token, verifyEmail])

    return (
        <div className="w-sm space-y-6 text-center mx-auto mt-10">
            <div className="flex flex-col items-center space-y-4">
                <img src={logo} alt="logo" className="w-14 h-14 mb-3" />
                <h2 className="text-3xl font-medium tracking-wide">
                    Email Verification
                </h2>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 py-12">
                {verificationStatus === 'loading' && (
                    <>
                        <Loader2 className="w-16 h-16 animate-spin" style={{ color: colorGreen }} />
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-200">
                                Verifying your email...
                            </p>
                            <p className="text-sm text-gray-400">
                                Please wait while we verify your email address
                            </p>
                        </div>
                    </>
                )}

                {verificationStatus === 'success' && (
                    <>
                        <CheckCircle2 className="w-16 h-16" style={{ color: colorGreen }} />
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-200">
                                Email Verified Successfully!
                            </p>
                            <p className="text-sm text-gray-400">
                                Your account has been verified. Redirecting you to the dashboard...
                            </p>
                        </div>
                    </>
                )}

                {verificationStatus === 'error' && (
                    <>
                        <XCircle className="w-16 h-16" style={{ color: colorRed }} />
                        <div className="space-y-2">
                            <p className="text-lg font-medium text-gray-200">
                                Verification Failed
                            </p>
                            <p className="text-sm text-gray-400">
                                {!token
                                    ? "Invalid verification link. Please check your email and try again."
                                    : "The verification link may have expired or is invalid."}
                            </p>
                        </div>
                        <div className="space-y-3 pt-4">
                            <a
                                href="/auth/sign-in"
                                className={`inline-block text-[${colorGreen}] font-medium hover:no-underline underline`}
                            >
                                Go to Sign In
                            </a>
                            <span className="text-gray-400 mx-2">or</span>
                            <a
                                href="/auth/sign-up"
                                className={`inline-block text-[${colorGreen}] font-medium hover:no-underline underline`}
                            >
                                Create New Account
                            </a>
                        </div>
                    </>
                )}
            </div>

            <p className="text-gray-300 text-xs tracking-wide pt-8">
                Having trouble? <a href="mailto:support@techtren.com" className="border-b hover:border-0 border-gray-300 cursor-pointer">Contact Support</a>
            </p>
        </div>
    )
}