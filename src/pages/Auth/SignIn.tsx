import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import { Input } from "../../components/ui/input"
import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import logo from "../../assets/Home/logosm.svg"
import Mail from "../../assets/Home/mail.svg"
import Lock from "../../assets/Home/lock.svg"
import { useLogin } from "../../api/hooks/Auth/useAuth"
import { toast } from "sonner"

let colorGreen = '#14E893'

const secureStorage = {
    set: (key: string, value: string) => {
        try {
            const encrypted = btoa(unescape(encodeURIComponent(value)))
            localStorage.setItem(key, encrypted)
        } catch (error) {
            console.error('Error saving to storage:', error)
        }
    },
    get: (key: string): string | null => {
        try {
            const encrypted = localStorage.getItem(key)
            if (!encrypted) return null
            return decodeURIComponent(escape(atob(encrypted)))
        } catch (error) {
            console.error('Error reading from storage:', error)
            return null
        }
    },
    remove: (key: string) => {
        localStorage.removeItem(key)
    }
}

export const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

    const { mutate: login, isPending, error } = useLogin()

    useEffect(() => {
        const savedEmail = secureStorage.get('rememberedEmail')
        const savedPassword = secureStorage.get('rememberedPassword')

        if (savedEmail && savedPassword) {
            setEmail(savedEmail)
            setPassword(savedPassword)
            setRememberMe(true)
        }
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error("Please fill in all fields!")
            return
        }

        if (rememberMe) {
            secureStorage.set('rememberedEmail', email)
            secureStorage.set('rememberedPassword', password)
        } else {
            secureStorage.remove('rememberedEmail')
            secureStorage.remove('rememberedPassword')
        }

        login({
            email,
            password
        }, {
            onSuccess: () => {
                toast.success("Login successful!")
            },
            onError: (error: any) => {
                toast.error(error?.message || "Login failed. Please try again.")
            }
        })
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="w-sm space-y-6 text-center mx-auto mt-10">
            <div className="flex flex-col items-center space-y-4">
                <img src={logo} alt="logo" className="w-14 h-14 mb-3" />
                <h2 className="text-xl font-medium tracking-wide">
                    Welcome to Tech Tren
                </h2>
            </div>

            <div>
                <p className="text-sm text-muted-foreground mb-5 text-gray-300 tracking-wider">
                    Don't have an account?{" "}
                    <a href="/auth/sign-up" className={`text-[${colorGreen}] font-medium hover:no-underline underline  ml-1`}>Sign up</a>
                </p>
            </div>

            <form className="space-y-4 text-left" onSubmit={handleLogin}>
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

                <div className="flex items-center justify-between text-sm mb-6">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="remember"
                            className="!rounded-[5px] glass"
                            style={{
                                background: 'rgba(20, 20, 20, 0.30)',
                            }}
                            checked={rememberMe}
                            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                        />
                        <label htmlFor="remember" className="text-gray-400 cursor-pointer">
                            Remember me
                        </label>
                    </div>

                    <a href="/auth/forgot-password" className="hover:no-underline underline">
                        Forgot Password
                    </a>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="text-red-500 text-sm text-center mb-4">
                        {(error as any).message || "Login failed. Please check your credentials and try again."}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full special-btn font-semibold py-6 text-base tracking-wider"
                    disabled={isPending}
                >
                    {isPending ? "Signing in..." : "Login"}
                </Button>
            </form>
        </div>
    )
}