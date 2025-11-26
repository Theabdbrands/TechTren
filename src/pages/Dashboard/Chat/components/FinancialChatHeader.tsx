// FinancialChatHeader.tsx
import logo from "../../../../assets/Home/logosm.svg"



export default function FinancialChatHeader() {
    return (
        <div className="">
            <div className="flex items-center gap-5 px-8">
                <img src={logo} alt="logo" />
                <div>
                    <p className="text-3xl font-semibold">Ask Financial GPT</p>
                    <p className="text-sm text-gray-400">Your AI-powered investor and communicator all in one platform.</p>
                </div>
            </div>
        </div>
    )
}
