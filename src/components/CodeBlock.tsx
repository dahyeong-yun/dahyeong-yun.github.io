import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark as darkTheme,
  oneLight as lightTheme,
} from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, inline = false }) => {
  // className이 language-java 같은 형식으로 옴
  const language = className ? className.replace('language-', '') : '';

  // 인라인 코드인 경우 (백틱 하나로 감싼 경우)
  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group">
      {language && (
        <div className="absolute right-4 top-4 text-xs text-gray-400 dark:text-gray-500 font-mono uppercase">
          {language}
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={darkTheme}
        className="!bg-gray-900 !rounded-lg !mt-4 !mb-4"
        customStyle={{
          padding: '1.5rem',
          fontSize: '0.875rem',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
