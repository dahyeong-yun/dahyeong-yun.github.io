import React from 'react';

const TAG_COLORS = [
  { bg: "bg-red-50 dark:bg-red-950", text: "text-red-600 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
  { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  { bg: "bg-green-50 dark:bg-green-950", text: "text-green-600 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  { bg: "bg-yellow-50 dark:bg-yellow-950", text: "text-yellow-600 dark:text-yellow-300", border: "border-yellow-200 dark:border-yellow-800" },
  { bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-600 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800" },
  { bg: "bg-pink-50 dark:bg-pink-950", text: "text-pink-600 dark:text-pink-300", border: "border-pink-200 dark:border-pink-800" },
];

const Tag = ({ children }: { children: React.ReactNode }) => {
  const colorIndex = React.useMemo(() => {
    if (typeof children !== 'string') return 0;
    return Array.from(children).reduce((acc, char) => acc + char.charCodeAt(0), 0) % TAG_COLORS.length;
  }, [children]);

  const colorSet = TAG_COLORS[colorIndex];

  return (
    <span
      className={`
        inline-flex items-center px-2 py-1 text-xs
        sm:px-3 sm:py-1.5 sm:text-sm
        font-medium rounded-lg border transition-colors duration-200
        ${colorSet.bg} ${colorSet.text} ${colorSet.border}
        hover:bg-opacity-80
      `}
    >
      {children}
    </span>
  );
};

interface PostHeaderProps {
  title: string;
  date: string;
  tags?: string[];
}

const PostHeader = ({ title, date, tags }: PostHeaderProps) => {
  return (
    <header className="mb-8 sm:mb-12 md:mb-16">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
        {title}
      </h1>
      <div className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        {date}
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
    </header>
  );
};

export default PostHeader;
