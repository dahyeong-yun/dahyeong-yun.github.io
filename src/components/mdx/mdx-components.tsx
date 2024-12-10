import React from 'react';
import type { ComponentType } from 'react';
import type { MDXComponents as MDXComponentsType } from 'mdx/types';
import CodeBlock from "@/components/mdx/code-block";
import { generateId } from './utils';

// HTML 속성 타입들
type HTMLAttributes<T> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T>;
type ImgHTMLAttributes<T> = React.DetailedHTMLProps<React.ImgHTMLAttributes<T>, T>;

// 헤딩 컴포넌트를 위한 타입
type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

// 이미지 컴포넌트를 위한 타입
type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
  alt?: string;
  title?: string;
};

// 헤딩 스타일 정의
const headingStyles = {
  h1: "text-4xl font-bold mt-12 mb-6",
  h2: "text-3xl font-semibold mt-10 mb-5",
  h3: "text-2xl font-medium mt-8 mb-4",
  h4: "text-xl font-medium mt-6 mb-3",
  h5: "text-lg font-medium mt-4 mb-2",
  h6: "text-base font-medium mt-4 mb-2",
} as const;

// 헤딩 컴포넌트 생성 함수
const createHeadingComponent = (level: 1 | 2 | 3 | 4 | 5 | 6): ComponentType<HeadingProps> => {
  return ({ children, ...props }: HeadingProps) => {
    const id = generateId(children);
    const tag = `h${level}`;
    const styleClass = headingStyles[tag as keyof typeof headingStyles];

    return React.createElement(
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

// 이미지 컴포넌트
const ImageComponent: ComponentType<ImageProps> = ({ src, alt, title, ...rest }) => {
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
};

// MDX 컴포넌트 정의
export const customMDXComponents: MDXComponentsType = {
  h1: createHeadingComponent(1),
  h2: createHeadingComponent(2),
  h3: createHeadingComponent(3),
  h4: createHeadingComponent(4),
  h5: createHeadingComponent(5),
  h6: createHeadingComponent(6),

  p: (props: HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="leading-7 my-6" />
  ),

  blockquote: (props: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote {...props} className="pl-4 border-l-4 border-gray-300 italic my-6" />
  ),

  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="list-disc pl-6 my-6" />
  ),

  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="list-decimal pl-6 my-6" />
  ),

  li: (props: HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className="my-2" />
  ),

  img: ImageComponent as ComponentType<ImgHTMLAttributes<HTMLImageElement>>,

  code: ({ className, children, ...props }: HTMLAttributes<HTMLElement> & { className?: string }) => {
    const isInline = !className;
    return (
      <CodeBlock className={className} inline={isInline}>
        {children as string}
      </CodeBlock>
    );
  }
};
