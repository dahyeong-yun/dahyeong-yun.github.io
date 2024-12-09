import React from 'react';
import { Link } from 'gatsby';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BlogPost {
  frontmatter: {
    title: string;
    date: string;
    tags: string[];
    slug: string;
  };
  excerpt: string;
  id: string;
}

interface TagPageProps {
  posts: BlogPost[];
  currentTag?: string;
}

const TagPage: React.FC<TagPageProps> = ({ posts, currentTag }) => {
  // 모든 태그와 각 태그의 게시물 수를 계산
  const tagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      post.frontmatter.tags?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [posts]);

  // 현재 태그에 해당하는 게시물만 필터링
  const filteredPosts = React.useMemo(() => {
    if (!currentTag) return posts;
    return posts.filter(post =>
      post.frontmatter.tags?.includes(currentTag)
    );
  }, [posts, currentTag]);

  return (
    <div className="container mx-auto p-4">
      {/* 태그 필터 섹션 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/blog"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${!currentTag
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'}`}
          >
            All ({posts.length})
          </Link>
          {Object.entries(tagCounts).map(([tag, count]) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${currentTag === tag
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'}`}
            >
              {tag} ({count})
            </Link>
          ))}
        </div>
      </div>

      {/* 게시물 목록 */}
      <div className="grid gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>
                <Link
                  to={post.frontmatter.slug}
                  className="hover:text-primary transition-colors"
                >
                  {post.frontmatter.title}
                </Link>
              </CardTitle>
              <CardDescription>{post.frontmatter.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>{post.excerpt}</p>
              </div>
              <div className="flex gap-2">
                {post.frontmatter.tags?.map((tag) => (
                  <Link
                    key={tag}
                    to={`/tags/${tag}`}
                    className="text-sm bg-secondary px-2 py-1 rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TagPage;
