import React, { type DetailedHTMLProps, type HTMLAttributes, createElement } from 'react';
import CodeBlock from "@/components/CodeBlock";
import { generateId } from './utils';

type HeadingProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;

// 각 헤딩 레벨별 스타일 정의
const headingStyles = {
  h1: "text-4xl font-bold mt-12 mb-6",
  h2: "text-3xl font-semibold mt-10 mb-5",
  h3: "text-2xl font-medium mt-8 mb-4",
  h4: "text-xl font-medium mt-6 mb-3",
  h5: "text-lg font-medium mt-4 mb-2",
  h6: "text-base font-medium mt-4 mb-2",
};

const createHeadingComponent = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  return ({ children, ...props }: HeadingProps) => {
    const id = generateId(children);
    const tag = `h${level}`;
    const styleClass = headingStyles[tag as keyof typeof headingStyles];

    return createElement(
      tag,
      {
        ...props,
        id,
        className: `scroll-mt-20 ${styleClass}`,
      },
      children
    );
  };
};

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  title?: string;
}

export const MDXComponents = {
  h1: createHeadingComponent(1),
  h2: createHeadingComponent(2),
  h3: createHeadingComponent(3),
  h4: createHeadingComponent(4),
  h5: createHeadingComponent(5),
  h6: createHeadingComponent(6),

  p: (props: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>) => (
    <p {...props} className="leading-7 my-6" />
  ),

  blockquote: (props: DetailedHTMLProps<HTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>) => (
    <blockquote {...props} className="pl-4 border-l-4 border-gray-300 italic my-6" />
  ),

  ul: (props: DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>) => (
    <ul {...props} className="list-disc pl-6 my-6" />
  ),

  ol: (props: DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>) => (
    <ol {...props} className="list-decimal pl-6 my-6" />
  ),

  li: (props: DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>) => (
    <li {...props} className="my-2" />
  ),

  img: ({ src, alt, title, ...rest }: ImageProps) => {
    if (!src) return null;

    return (
      <figure className="my-8">
        <img
          src={src}
          alt={alt || ''}
          title={title}
          {...rest}
          className="rounded-lg overflow-hidden max-w-full h-auto mx-auto"
          loading="lazy"
        />
        {title && (
          <figcaption className="text-center text-sm text-muted-foreground mt-2">
            {title}
          </figcaption>
        )}
      </figure>
    );
  },

  code: ({ className, children, ...props }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { className?: string }) => {
    const isInline = !className;
    return (
      <CodeBlock className={className} inline={isInline}>
        {children as string}
      </CodeBlock>
    );
  }
};
