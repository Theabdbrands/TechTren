import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import gradientGraph from '../../../assets/Home/gradient-graph.png'
import currencyEht from '../../../assets/Home/currency-ethereum.svg'
import lightBulb from '../../../assets/Home/lightbulb-02.svg'
import sheild from '../../../assets/Home/shield-tick.svg'
import marketSvg from '../../../assets/Home/bar-line-chart.svg'
import marketchartGraph from '../../../assets/Home/chart-breakout-square.svg'
import singleBox from '../../../assets/Home/singlebox.png';
import arrowUp from '../../../assets/Home/arrow-up.svg';

export default function RevolutionPage() {
    return (
        <div className="relative pt-0 sm:pt-32 pb-5 mx-auto px-5 sm:px-6 max-w-6xl">
            <h1 className="mx-auto max-w-3xl text-center text-balance text-4xl md:text-6xl tracking-wide leading-16 font-light sm:pb-14 pb-8">Revolutionizing the Investment worldwide</h1>

            <div className="">
                <img src={singleBox} alt="box" className="absolute  sm:-right-[450px] top-10 object-contain sm:w-1/2  right-0 w-full" />
                <div className="purple-shadow blur-[150px] !saturate-[1] sm:w-1/2 sm:h-96 top-10 sm:-right-[400px] right-0 w-full h-1/4"></div>
            </div>

            <Card className="relative rounded-4xl bg-[#0B0B0E] text-white shadow-lg sm:pr-1 pt-1 pr-0">

                <CardContent className="flex flex-col justify-between h-full pr-0 sm:pb-6 pb-2 sm:pl-6  pl-0">
                    <div className="flex items-end justify-between sm:flex-row flex-col">
                        <p className="text-sm text-gray-400 mb-2 sm:flex items-center gap-2 hidden">
                            <span className="inline-block size-5">
                                <img src={marketchartGraph} alt="graph" className="opacity-50" />
                            </span>
                            Ask anything
                        </p>
                        <div className="relative inset-0 sm:w-3/4 -mt-1 sm:-mr-1 sm:overflow-visible w-full overflow-hidden mr-0">
                            <img
                                src={gradientGraph}
                                alt="Financial Graph Background"
                                className="w-full sm:h-full object-cover ml-auto opacity-70 rounded-tr-4xl h-44"
                            />
                            <div className="absolute sm:top-20 sm:-left-30 -left-6 top-28">
                                <Tag label="Trading strategies" imgVal={lightBulb} />
                            </div>
                            <div className="absolute sm:-bottom-5 sm:left-30">
                                <Tag label="Risk management" imgVal={sheild} />
                            </div>
                            <div className="absolute sm:-top-4 sm:right-30 bottom-0 -right-24">
                                <Tag label="Stock and crypto insights" imgVal={currencyEht} />
                            </div>
                            <div className="absolute -right-10 bottom-10 sm:block hidden">
                                <Tag label="Market analysis and trends" imgVal={marketSvg} />
                            </div>
                            <div className="absolute sm:right-2/6 sm:top-25 sm:w-2/5 w-[60%] top-15 right-[15%]">
                                <Input label="What can i help you with?" />
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-8 flex items-center gap-2 sm:hidden justify-center sm:mt-0 -mt-6">
                        <span className="inline-block size-5">
                            <img src={marketchartGraph} alt="graph" className="opacity-50" />
                        </span>
                        Ask anything
                    </p>
                    <div className="sm:text-left sm:px-0 px-8 text-center">
                        <h2 className="sm:text-3xl sm:font-semibold text-2xl font-light">Financial GPT <ArrowRight className="inline sm:w-6 sm:h-6 ml-1 w-4 h-4" /></h2>
                        <p className="text-gray-400 sm:leading-6 mt-3 max-w-3xl sm:text-base text-sm leading-[23px]">
                            Ask me anything about financial markets, trading strategies, stock analysis, economic trends, or investment insights.
                            I’m here to help you make informed financial decisions.
                        </p>
                    </div>

                </CardContent>
            </Card>



        </div>
    )
}


export function Tag({ label, imgVal }: { label: string, imgVal: string }) {
    return (
        <div className="sm:px-8 sm:py-2 bg-[#141418]/70 rounded-full sm:text-sm flex items-center gap-2 border border-white/20 hover:bg-[#1a1a1f]/70 transition-all backdrop-blur-md backdrop-saturate-150 text-xs px-4 py-1">
            <span className="inline-block">
                <img src={imgVal} alt="" className="sm:w-5 sm:h-5 w-4 h-4" />
            </span>
            {label}
            <span>
                <img src={arrowUp} alt="arrow" className="w-2 h-2 sm:ml-3 ml-1" />
            </span>
        </div>
    )
}


export function Input({ label }: { label: string }) {
    return (
        <div className="glass text-white sm:px-4 py-2 flex items-center justify-between rounded-full px-4">
            <input
                type="text"
                name="revolution-inp"
                id="revolution-inp"
                placeholder={label}
                className="outline-0 bg-transparent opacity-70 w-full sm:text-base text-sm"
                disabled
            />
        </div>
    )
}

