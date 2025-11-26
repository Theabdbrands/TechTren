import LogoSm from '../../../assets/Home/logosm.svg';
import AiStrategiesGIF from '../../../assets/Home/aiStrategiesGIT.gif';
import { Input, Tag } from './RevolutionPage';

import currencyEht from '../../../assets/Home/currency-ethereum.svg'
import lightBulb from '../../../assets/Home/lightbulb-02.svg'
import sheild from '../../../assets/Home/shield-tick.svg'
import marketSvg from '../../../assets/Home/bar-line-chart.svg'
import singleBox from '../../../assets/Home/singlebox.png';
import AiStrategyVd from '../../../assets/Home/HOMEPAGE_HEADER_WEB.mp4';

export default function AiStrategies() {
    return (
        <section className='relative py-28 sm:pt-12 mx-auto pt-6'>
            <div className='relative max-w-6xl mx-auto'>
                <div className='flex items-center justify-between sm:gap-8 sm:mb-20 sm:flex-row sm:text-left flex-col text-center gap-6 mb-16'>
                    <h1 className='sm:text-5xl sm:font-semi-bold sm:leading-12 sm:px-0 px-4 leading-9 font-light text-[34px]'>AI Says: 65% chance of upward trend.</h1>
                    <p className='max-w-xl sm:text-sm sm:px-0 text-gray-300 text-xs px-6'>Tech Tren operate with full transparency, directly passing your investment to the market, ensuring fair pricing and execution. With a commitment to regulatory compliance, they provide a secure environment that protects your investments.</p>
                </div>

                <div className='!bg-black relative ai-strategies-main sm:w-4/5 mx-auto !overflow-visible sm:text-left text-center w-[85%] rounded-2xl sizin box-border' style={{
                    background: 'background: rgba(255, 255, 255, 0.06)'
                }}>
                    <div className='flex items-center justify-center flex-col p-4 gap-4 sm:py-20 py-8'>
                        <img src={LogoSm} alt="logo" className='sm:w-12 w-16' />
                        <h3 className='sm:text-4xl text-3xl'>Welcome to Financial GPT</h3>
                        <p className='max-w-xl sm:text-base text-gray-400 text-center text-xs'>Ask me anything about financial markets, trading strategies, stock analysis, economic trends, or investment insights. I'm here to help you make informed financial decisions.</p>

                        {/* GIF Blend Mode */}
                        <div className='w-full h-full relative flex justify-center'>
                            <div className='relative sm:w-2/5 sm:h-40 mx-auto w-3/4 h-24'>
                                <img
                                    src={AiStrategiesGIF}
                                    alt="gif"
                                    className='w-full h-full object-cover rounded-lg'
                                />
                                <div
                                    className='absolute inset-0 rounded-lg mix-blend-color'
                                    style={{
                                        background: 'linear-gradient(275.19deg, #14E893 -15.5%, #5131AD 98.25%)',
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="sm:w-2/5 w-3/4">
                            <Input label="What can i help you with?" />
                        </div>
                    </div>

                    {/* Tag components */}
                    <div className="!absolute -right-20 top-[58%] w-72 z-[1] sm:block hidden">
                        <Tag label="Market analysis and trends" imgVal={marketSvg} />
                    </div>
                    <div className="!absolute top-20 -left-30 z-[1] sm:block hidden">
                        <Tag label="Trading strategies" imgVal={lightBulb} />
                    </div>
                    <div className="!absolute top-68 left-10 z-[1] sm:block hidden">
                        <Tag label="Risk management" imgVal={sheild} />
                    </div>
                    <div className="!absolute top-10 right-10 z-[1] sm:block hidden">
                        <Tag label="Stock and crypto insights" imgVal={currencyEht} />
                    </div>
                </div>

                {/* Side Shades */}
                <div className="">
                    <img src={singleBox} alt="box" className="absolute -left-[200px] -bottom-40 object-contain w-[60%] sm:block hidden" />
                    <div className="ai-strategy-shade-purple -bottom-60 -left-[300px] sm:block hidden"></div>
                </div>

                <div className="">
                    <img src={singleBox} alt="box" className="absolute -right-[200px] top-32 object-contain w-[60%] sm:block hidden" />
                    <div className="ai-strategy-shade-green top-60 -right-[400px] sm:block hidden"></div>
                </div>
            </div>

            {/* Background video */}
            <div className="absolute top-40 h-full w-full -z-10 overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-[660px] object-cover opacity-20"
                >
                    <source src={AiStrategyVd} />
                </video>

                <div
                    className="absolute top-0 left-0 w-full h-48"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, transparent 100%)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                />

                <div
                    className="absolute bottom-16 left-0 w-full h-48"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, transparent 100%)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                />
            </div>
            <div className="">
                <img src={singleBox} alt="box" className="absolute  sm:-right-[450px] -top-40 object-contain sm:w-1/2  right-0 w-full sm:hidden block" />
                <div className="purple-shadow sm:w-1/2 sm:h-96 bottom-16 sm:-right-[400px] right-0 w-full h-1/4 sm:hidden block" style={{ filter: 'blur(100px) saturate(65%)' }}></div>
            </div>
        </section>
    )
}