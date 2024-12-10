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
  // className이 없거나 language- 접두사가 없는 경우 'text'를 기본값으로 사용
  const language = className ? className.replace('language-', '') : 'text';

  // 인라인 코드인 경우 (백틱 하나로 감싼 경우)
  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-sm border">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group not-prose">
      {language !== 'text' && (
        <div className="absolute right-4 top-4 text-xs text-muted-foreground font-mono uppercase">
          {language}
        </div>
      )}
      <div className="rounded-lg overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={darkTheme}
          customStyle={{
            margin: '0',
            padding: '1.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'hsl(var(--muted))',
          }}
          PreTag="div"
          codeTagProps={{
            className: "font-mono text-muted-foreground"
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;
