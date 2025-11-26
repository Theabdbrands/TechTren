import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../../api/hooks/blog/useBlogs';
import { ArrowLeft, Calendar, User, Tag, Share2, Bookmark, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { useState } from 'react';
import { FALLBACK_IMAGES } from '@/types/blog';
import singleBox from '../../assets/Home/singlebox.png';

export default function BlogDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: blogResponse, isLoading, error } = useBlog(id!);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const blog = blogResponse?.data;

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoToBlogs = () => {
        navigate('/blog');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32 pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Skeleton loader */}
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>
                            <div className="h-96 bg-gray-800 rounded-xl mb-8"></div>
                            <div className="h-12 bg-gray-800 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-800 rounded w-2/3 mb-8"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-32 pb-24 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Blog Not Found</h2>
                    <p className="text-gray-400 mb-8">The blog you're looking for doesn't exist or may have been removed.</p>
                    <Button onClick={handleGoToBlogs} className="bg-blue-600 hover:bg-blue-700">
                        Back to Blogs
                    </Button>
                </div>
            </div>
        );
    }

    const featuredImage = blog.assets?.[0];
    const formattedDate = format(new Date(blog.createdAt), 'MMMM dd, yyyy');

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.subtitle || '',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden">

            {/* Main Back Button in Content Area */}
            <section className="pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button Row */}
                        <div className="flex items-center justify-between mb-8">
                            <Button
                                onClick={handleGoBack}
                                variant="ghost"
                                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group cursor-pointer"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span>Go Back</span>
                            </Button>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className={`text-white/70 hover:text-white ${isBookmarked ? 'text-yellow-400' : ''
                                        }`}
                                >
                                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleShare}
                                    className="text-white/70 hover:text-white"
                                >
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formattedDate}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>TechTren Desk</span>
                            </div>

                            {blog.communityId && (
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    <span className="capitalize">{blog.communityId.replace(/-/g, ' ')}</span>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Subtitle */}
                        {blog.subtitle && (
                            <p className="text-xl text-white/70 mb-8 leading-relaxed">
                                {blog.subtitle}
                            </p>
                        )}

                        {/* Tickers */}
                        {blog.tickers && blog.tickers.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-8">
                                {blog.tickers.map((ticker) => (
                                    <span
                                        key={ticker}
                                        className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30"
                                    >
                                        {ticker}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Featured Image */}
                        {featuredImage && (
                            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl">
                                <img
                                    src={featuredImage.asset_url}
                                    alt={featuredImage.alt_text}
                                    className="w-full h-auto max-h-[600px] object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = FALLBACK_IMAGES.BLOG_DETAIL;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        )}

                        {/* Engagement Buttons */}
                        <div className="flex items-center gap-4 mb-8">
                            <Button
                                variant={isLiked ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsLiked(!isLiked)}
                                className={`flex items-center gap-2 ${isLiked
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'border-white/20 text-white/70 hover:text-white'
                                    }`}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                <span>{blog.votes?.length || 0}</span>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 text-white/70 hover:text-white flex items-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Comment</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <Card className="glass rounded-2xl p-8"
                            style={{
                                background: 'rgba(20, 20, 20, 0.30)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                            <article className="prose prose-invert max-w-none">
                                <div className="whitespace-pre-line text-lg leading-relaxed text-white/90">
                                    {blog.body.split('\n').map((paragraph, index) => {
                                        if (paragraph.trim() === '') {
                                            return <br key={index} />;
                                        }

                                        // Check if it's a bullet point
                                        if (paragraph.trim().startsWith('-')) {
                                            return (
                                                <div key={index} className="flex items-start mb-2">
                                                    <span className="text-blue-400 mr-3 mt-1">•</span>
                                                    <span className="flex-1">{paragraph.substring(1).trim()}</span>
                                                </div>
                                            );
                                        }

                                        return (
                                            <p key={index} className="mb-6 last:mb-0">
                                                {paragraph}
                                            </p>
                                        );
                                    })}
                                </div>
                            </article>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Bottom Back Button */}
            <section className="py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto flex justify-center">
                        <Button
                            onClick={handleGoToBlogs}
                            variant="outline"
                            className="text-white/70 hover:!bg-white/20 transition-all duration-300 px-8 py-3 cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5 mr-3" />
                            Back to All Blogs
                        </Button>
                    </div>
                </div>
            </section>

            {/* Related Blogs Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-8">More from TechTren</h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* You can add related blogs here using the useBlogs hook */}
                            <Card
                                className="glass p-6 hover:!bg-white/5 transition-colors cursor-pointer"
                                style={{
                                    background: 'rgba(20, 20, 20, 0.30)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                                onClick={handleGoToBlogs}
                            >
                                <h3 className="text-white font-semibold mb-2 line-clamp-2">
                                    Exploring Market Trends in 2024
                                </h3>
                                <p className="text-white/60 text-sm line-clamp-2">
                                    Discover the latest market trends and investment opportunities...
                                </p>
                            </Card>

                            <Card
                                className="glass p-6 hover:!bg-white/5 transition-colors cursor-pointer"
                                style={{
                                    background: 'rgba(20, 20, 20, 0.30)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                                onClick={handleGoToBlogs}
                            >
                                <h3 className="text-white font-semibold mb-2 line-clamp-2">
                                    AI Revolution in Trading
                                </h3>
                                <p className="text-white/60 text-sm line-clamp-2">
                                    How artificial intelligence is transforming the trading landscape...
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Background Elements */}
            <div className="!overflow-hidden myBullBg">
                <img src={singleBox} alt="box" className="absolute -left-[450px] -top-10 object-contain w-1/2 sm:block hidden !-z-90" />
                <div className="green-shadow -top-10 -left-[450px] sm:block hidden !-z-90"></div>
            </div>

            <div className="">
                <img src={singleBox} alt="box" className="absolute -right-[380px] top-44 object-contain w-1/2 -z-90 sm:block hidden" />
                <div className="purple-shadow sm:w-[600px] sm:-right-96 sm:h-[450px] sm:top-20 w-1/2 h-1/4 bottom-24 right-20 -z-50"></div>
            </div>
        </div>
    );
}