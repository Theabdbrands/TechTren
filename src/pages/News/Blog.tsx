import { useState } from 'react';
import TrendingMarketNewsSection from "./components/TrendingMarketNews";
import LatestMarketStories from "./components/LatestMarketStories";
import FeaturedAIInsight from "./components/FeaturedAIInsight";
import ExploreRecentTopStories from "./components/ExploreRecentTopStories";
import PreFooter from "../Home/components/PreFooter";
import { useBlogs } from '../../api/hooks/blog/useBlogs';


export default function Blog() {
  const [sortBy, setSortBy] = useState<'latest' | 'hot'>('latest');

  const { data: blogsData, isLoading } = useBlogs({
    sort_by: sortBy,
    limit: 20
  });

  const blogs = blogsData?.data || [];

  return (
    <main className="relative flex min-h-screen flex-col pb-24 pt-32 overflow-x-hidden">
      <TrendingMarketNewsSection
        blogs={blogs}
        isLoading={isLoading}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <LatestMarketStories blogs={blogs.slice(0, 4)} />
      <FeaturedAIInsight blogs={blogs} />
      <ExploreRecentTopStories blogs={blogs.slice(4, 10)} />
      <PreFooter />
    </main>
  );
}