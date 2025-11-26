import type { Blog } from '../types/blog';

// Format date for display
export const formatBlogDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    }
};

// Extract first image from assets for blog card
export const getBlogHeroImage = (blog: Blog): string | null => {
    return blog.assets.length > 0 ? blog.assets[0].asset_url : null;
};

// Truncate text for preview
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

// Format blog body for display (convert newlines to paragraphs)
export const formatBlogBody = (body: string): string => {
    return body.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
};