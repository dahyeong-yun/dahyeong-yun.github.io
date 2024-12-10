import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Array<Heading>;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0% -80% 0%' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      // 헤더의 높이(56px)와 추가 여백(24px)을 고려한 오프셋
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // URL 해시 업데이트 (선택사항)
      history.pushState(null, '', `#${headingId}`);
    }
  };

  const getHeadingClasses = (level: number, isActive: boolean) => {
    // 기본 스타일
    const baseClasses = cn(
      "w-full text-left rounded transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "py-1.5"
    );

    // 레벨별 스타일
    const levelClasses = {
      1: "text-base font-semibold pl-2",
      2: "text-sm font-medium pl-6",
      3: "text-sm font-normal pl-10",
      4: "text-xs font-normal pl-14",
      5: "text-xs font-light pl-16",
      6: "text-xs font-light pl-18",
    }[level] || "text-sm pl-2";

    // 활성 상태 스타일
    const activeClasses = isActive ? "text-primary bg-accent/50" : "text-muted-foreground";

    return cn(baseClasses, levelClasses, activeClasses);
  };

  if (headings.length === 0) return null;

  return (
    <nav className="fixed z-10 w-full lg:w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg shadow-lg lg:right-8 lg:top-24 transition-all duration-300">
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-lg font-semibold m-0">Table of Contents</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "transition-transform duration-300",
            isOpen ? "rotate-180" : ""
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 pt-2 overflow-y-auto max-h-[calc(60vh-4rem)]">
          <ul className="list-none m-0 p-0 space-y-1">
            {headings.map((heading, index) => (
              <li key={`${heading.id}-${index}`} className="m-0 p-0">
                <button
                  type="button"
                  onClick={() => scrollToHeading(heading.id)}
                  className={getHeadingClasses(heading.level, activeId === heading.id)}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TableOfContents;
