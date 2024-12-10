import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import Layout from "../components/layout/layout"
import PostHeader from "../components/post/post-header"
import TableOfContents from "@/components/post/table-of-contents"
import { customMDXComponents } from '@/components/mdx/mdx-components'

interface PostQueryData {
  mdx: {
    frontmatter: {
      title: string
      date: string
      slug: string
      tags?: string[]
    }
  }
}

interface Heading {
  id: string
  text: string
  level: number
}

const Post: React.FC<PageProps<PostQueryData>> = ({ data, children }) => {
  const { frontmatter } = data.mdx;
  const { title, date, tags } = frontmatter;
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updateHeadings = () => {
      if (!contentRef.current) return;

      const elements = Array.from(contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const newHeadings = elements.map((el, index) => {
        const text = el.textContent || '';
        let id = el.id;
        if (!id || id === '-') {
          id = `heading-${index + 1}-${text.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')}`;
          el.id = id;
        }

        return {
          id,
          text,
          level: parseInt(el.tagName.substring(1), 10)
        };
      }).filter(heading => heading.text);

      setHeadings(newHeadings);
    };

    setTimeout(updateHeadings, 100);

    const observer = new MutationObserver(() => {
      updateHeadings();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }

    return () => observer.disconnect();
  }, [children]);

  const hasHeadings = headings && headings.length > 0;

  return (
    <Layout>
      <div className="w-full max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:gap-16 relative">
          {/* Main Content */}
          <article className="flex-1 py-8 lg:max-w-[calc(100%-20rem)]">
            <div className="max-w-3xl">
              <PostHeader title={title} date={date} tags={tags} />

              {/* Mobile Table of Contents */}
              <div className="block lg:hidden mb-8">
                {hasHeadings && <TableOfContents headings={headings} />}
              </div>

              <MDXProvider components={customMDXComponents}>
                <div
                  ref={contentRef}
                  className="prose dark:prose-invert prose-sm sm:prose-base md:prose-lg w-full prose-headings:scroll-mt-20 prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:overflow-x-auto"
                >
                  {children}
                </div>
              </MDXProvider>
            </div>
          </article>

          {/* Desktop Table of Contents */}
          <aside className="hidden lg:flex w-72 shrink-0">
            {hasHeadings && (
              <div className="w-full sticky top-24">
                <TableOfContents headings={headings} />
              </div>
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Post;
export const query = graphql`
  query PostQuery($id: String!) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        date(formatString: "YYYY.MM.DD")
        slug
        tags
      }
    }
  }
`;
