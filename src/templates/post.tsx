import * as React from "react"
import { graphql, PageProps } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import Layout from "../components/layout"
import PostHeader from "../components/PostHeader"
import TableOfContents from "@/components/TableOfContents"
import { MDXComponents } from "@/components/mdx/MDXComponents"

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
        // ID가 없거나 '-'인 경우 새로운 ID 생성
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

      if (JSON.stringify(newHeadings) !== JSON.stringify(headings)) {
        setHeadings(newHeadings);
      }
    };

    // 초기 실행
    const timer = setTimeout(updateHeadings, 500);

    // MutationObserver 설정
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

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [children]);

  return (
    <Layout>
      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        {headings.length > 0 && <TableOfContents headings={headings} />}
        <article className="w-full py-8 sm:py-12 md:py-16">
          <PostHeader title={title} date={date} tags={tags} />
          <MDXProvider components={MDXComponents}>
            <div
              ref={contentRef}
              className="prose dark:prose-invert prose-sm sm:prose-base md:prose-lg w-full prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:overflow-x-auto"
            >
              {children}
            </div>
          </MDXProvider>
        </article>
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
