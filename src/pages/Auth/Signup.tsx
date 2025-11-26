import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { useState, useEffect } from "react"
import { Eye, EyeOff, User } from "lucide-react"
import logo from "../../assets/Home/logosm.svg"
import Mail from "../../assets/Home/mail.svg"
import Lock from "../../assets/Home/lock.svg"
import { useRegister } from "../../api/hooks/Auth/useAuth"
import { toast } from "sonner"

let colorGreen = '#14E893'
let colorRed = '#FF0044'

export const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [userName, setUserName] = useState("")
    const { mutate: register, isPending, error } = useRegister()

    // Check if there's a stored subscription plan
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

    useEffect(() => {
        const storedPlan = sessionStorage.getItem('subscriptionPlan')
        if (storedPlan) {
            setSelectedPlan(storedPlan)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords don't match!")
            return
        }

        if (password.length < 6) {
            toast.error("Password too short!")
            return
        }

        if (!userName.trim()) {
            toast.error("Username required!")
            return
        }

        register({
            email,
            password,
            user_name: userName
        }, {
            onSuccess: () => {
                toast.success("Account created successfully!")
                // Plan will be handled in useRegister hook
            },
            onError: (error: any) => {
                toast.error(error?.message || "Please try again.")
            }
        })
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <div className="w-sm space-y-6 text-center mx-auto mt-10">
            <div className="flex flex-col items-center space-y-4">
                <img src={logo} alt="logo" className="w-14 h-14 mb-3" />
                <h2 className="text-3xl font-medium tracking-wide">
                    Join the smartest investment platform ever
                </h2>
                {selectedPlan && selectedPlan !== 'basic' && (
                    <div className="bg-[#14E893]/10 border border-[#14E893]/30 rounded-lg px-4 py-2">
                        <p className="text-sm text-[#14E893]">
                            Selected Plan: <span className="font-semibold capitalize">{selectedPlan}</span>
                        </p>
                    </div>
                )}
            </div>

            <div>
                <p className="text-sm text-muted-foreground mb-5 text-gray-300 tracking-wider">
                    Already have an account?{" "}
                    <a href="/auth/sign-in" className={`text-[${colorGreen}] font-medium hover:no-underline underline ml-1`}>Sign in</a>
                </p>
            </div>

            <form className="space-y-4 text-left mb-4" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className={`flex items-center px-4 glass !rounded-lg py-[2px]`}
                    style={{
                        background: 'rgba(20, 20, 20, 0.30)',
                    }}>
                    <img src={Mail} alt="" />
                    <Input
                        type="email"
                        placeholder="Enter email address"
                        className="mt-1 !bg-transparent focus:!outline-none focus:!ring-0 focus:!border-0 border-0 !outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* Username Input */}
                <div className={`flex items-center px-4 glass !rounded-lg py-[2px]`}
                    style={{
                        background: 'rgba(20, 20, 20, 0.30)',
                    }}>
                    <User />
                    <Input
                        type="text"
                        placeholder="Enter username"
                        className="mt-1 !bg-transparent focus:!outline-none focus:!ring-0 focus:!border-0 border-0 !outline-none"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>

                {/* Password Input */}
                <div className="flex items-center px-4 glass !rounded-lg py-[2px] relative"
                    style={{
                        background: 'rgba(20, 20, 20, 0.30)',
                    }}>
                    <img src={Lock} alt="" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        className="mt-1 !bg-transparent focus:!outline-none focus:!ring-0 focus:!border-0 border-0 !outline-none pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    {password && (
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                            onClick={togglePasswordVisibility}>
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div className="flex items-center px-4 glass !rounded-lg py-[2px] relative"
                    style={{
                        background: 'rgba(20, 20, 20, 0.30)',
                    }}>
                    <img src={Lock} alt="" />
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        className="mt-1 !bg-transparent focus:!outline-none focus:!ring-0 focus:!border-0 border-0 !outline-none pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                    {confirmPassword && (
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                            onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    )}
                </div>

                {/* Error Display */}
                {error && (
                    <div className={`text-[${colorRed}] text-sm text-center`}>
                        {(error as any).message || "Registration failed. Please try again."}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full special-btn font-semibold py-6 text-base tracking-wider mt-4"
                    disabled={isPending}
                >
                    {isPending ? "Creating account..." : "Sign up"}
                </Button>

            </form>
            <p className="text-gray-300 text-xs tracking-wide">
                By using TechTren, you agree to the <span className="border-b hover:border-0 border-gray-300 cursor-pointer">Terms of Use</span> and <span className="border-b hover:border-0 border-gray-300 cursor-pointer">Privacy Policy</span>
            </p>
        </div>
    )
}