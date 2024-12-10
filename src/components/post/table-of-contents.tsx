import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents = ({ headings = [] }: TableOfContentsProps) => {
  const [activeId, setActiveId] = React.useState<string>('');
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
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

  const getHeadingClasses = (level: number, isActive: boolean) => {
    const baseClasses = cn(
      "block py-1 transition-colors duration-200",
      "hover:text-primary"
    );

    const levelClasses = {
      1: "text-base font-medium",
      2: "text-sm pl-4 font-medium",
      3: "text-sm pl-6",
      4: "text-sm pl-8",
      5: "text-sm pl-10",
      6: "text-sm pl-12",
    }[level] || "text-sm";

    const activeClasses = isActive
      ? "text-primary font-medium"
      : "text-muted-foreground";

    return cn(baseClasses, levelClasses, activeClasses);
  };

  if (!headings?.length) return null;

  return (
    <nav className="p-6 rounded-lg bg-muted/50 dark:bg-muted/20 border">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-foreground/80">목차</div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronUp
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isCollapsed ? "rotate-180" : ""
            )}
          />
        </Button>
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isCollapsed ? "max-h-0" : "max-h-[500px]"
        )}
      >
        <ul className="space-y-1">
          {headings.map((heading, index) => (
            <li key={`${heading.id}-${index}`}>
              <a
                href={`#${heading.id}`}
                className={getHeadingClasses(heading.level, activeId === heading.id)}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest',
                  });
                  window.history.pushState(null, '', `#${heading.id}`);
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContents;
