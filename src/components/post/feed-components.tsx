import React from 'react';
import { Link } from 'gatsby';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Heart, Repeat2, Share } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PostFrontmatter {
  title?: string;
  date: string;
  tags?: string[];
  slug: string;
  banner?: string;
  type?: 'note' | 'post';
}

interface Post {
  frontmatter: PostFrontmatter;
  excerpt: string;
  id: string;
}

interface FeedItemProps {
  post: Post;
}

interface BlogPostCardProps {
  post: Post;
}

const FeedItem: React.FC<FeedItemProps> = ({ post }) => {
  const date = new Date(post.frontmatter.date);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  return (
    <div className="p-4 border-b hover:bg-muted/50 transition-colors">
      <div className="flex gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src="/avatar.png" alt="Author" />
          <AvatarFallback>DY</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">Dahyeong Yun</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{timeAgo}</span>
          </div>
          <div className="mb-3">
            <div className="prose dark:prose-invert max-w-none text-sm">
              {post.excerpt}
            </div>
          </div>
          <div className="flex items-center justify-between text-muted-foreground max-w-md">
            <Button variant="ghost" size="sm" className="hover:text-primary">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="text-xs">0</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-green-500">
              <Repeat2 className="w-4 h-4 mr-2" />
              <span className="text-xs">0</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-red-500">
              <Heart className="w-4 h-4 mr-2" />
              <span className="text-xs">0</span>
            </Button>
            <Button variant="ghost" size="sm" className="hover:text-primary">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Card className="overflow-hidden">
      {post.frontmatter.banner && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.frontmatter.banner}
            alt={post.frontmatter.title || ''}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-6">
        <Link
          to={post.frontmatter.slug}
          className="block hover:text-primary transition-colors"
        >
          <h2 className="text-xl font-semibold mb-2">{post.frontmatter.title}</h2>
        </Link>
        <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/avatar.png" alt="Author" />
              <AvatarFallback>DY</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">Dahyeong Yun</div>
              <div className="text-xs text-muted-foreground">
                {post.frontmatter.date}
              </div>
            </div>
          </div>
          {post.frontmatter.tags && (
            <div className="flex gap-2">
              {post.frontmatter.tags.slice(0, 2).map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${tag}`}
                  className="text-xs bg-secondary hover:bg-secondary/80 px-2 py-1 rounded-full transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export { FeedItem, BlogPostCard };
export type { Post, PostFrontmatter };
