// Home.tsx
import { useEffect, useRef, Suspense, lazy } from 'react'
import { useLocation } from 'react-router-dom'
import { Landing } from './components/LandingPage'
import { useAuthStore } from '@/api/stores/auth-store'
import { SEO } from '@/SEO/SEO'
import { seoConfig } from '@/SEO/seo.config'

// Eager load first 2 sections (above fold)
import RevolutionPage from './components/RevolutionPage'
import { CardSkeleton, SectionSkeleton } from '@/components/Skeletons'

// Lazy load below-the-fold sections
const RevolutionBullCard = lazy(() => import('./components/RevolutionBullCard'))
const RevolutionSlider = lazy(() => import('./components/RevolutionSlider'))
const OurInvestorCard = lazy(() => import('./components/OurInvestorCard'))
const AiStrategies = lazy(() => import('./components/AiStrategies'))
const HowItWorksSection = lazy(() => import('./components/HowItWorksPage'))
const PricingPage = lazy(() => import('./components/PricingPage'))
const SocialFeeds = lazy(() => import('./components/SocialFeeds'))
const PreFooter = lazy(() => import('./components/PreFooter'))

export default function Home() {
    const pricingRef = useRef<HTMLElement>(null)
    const { user } = useAuthStore()
    const location = useLocation()

    useEffect(() => {
        const showPricing = sessionStorage.getItem('showPricingAfterSignup')
        if (showPricing === 'true') {
            sessionStorage.removeItem('showPricingAfterSignup')
            setTimeout(() => {
                pricingRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }, 500)
        }
    }, [])

    useEffect(() => {
        if (location.hash === '#pricing') {
            setTimeout(() => {
                const section = document.querySelector('#pricing')
                if (section) {
                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    })
                }
            }, 100)
        }
    }, [location.hash, location.pathname])

    return (
        <>
            <SEO
                title={seoConfig.home.title}
                description={seoConfig.home.description}
                keywords={seoConfig.home.keywords}
                canonical={seoConfig.home.canonical}
            />

            {/* Critical sections - load immediately */}
            <div className='mx-auto overflow-hidden'>
                <Landing />
                <RevolutionPage />

                {/* Below-the-fold with progressive loading */}
                <Suspense fallback={<div className="min-h-[400px]"><CardSkeleton /></div>}>
                    <RevolutionBullCard />
                </Suspense>

                <Suspense fallback={<div className="min-h-[300px]"><SectionSkeleton height="h-72" /></div>}>
                    <RevolutionSlider />
                </Suspense>

                <Suspense fallback={<div className="min-h-[500px]"><SectionSkeleton /></div>}>
                    <OurInvestorCard />
                </Suspense>

                <Suspense fallback={<div className="min-h-[600px]"><SectionSkeleton /></div>}>
                    <AiStrategies />
                </Suspense>

                <Suspense fallback={<div className="min-h-[500px]"><SectionSkeleton /></div>}>
                    <HowItWorksSection />
                </Suspense>
            </div>

            {!user && (
                <section id="pricing" ref={pricingRef} className="scroll-mt-20">
                    <Suspense fallback={<div className="min-h-[600px]"><SectionSkeleton /></div>}>
                        <PricingPage />
                    </Suspense>
                </section>
            )}

            <div className='mx-auto overflow-hidden'>
                <Suspense fallback={<div className="min-h-[400px]"><SectionSkeleton height="h-80" /></div>}>
                    <SocialFeeds />
                </Suspense>

                <Suspense fallback={<div className="min-h-[300px]"><SectionSkeleton height="h-60" /></div>}>
                    <PreFooter />
                </Suspense>
            </div>
        </>
    )
}