import Link from "next/link";
import ReactMarkdown from "react-markdown";

// Renders article content written in superadmin. Raw HTML is not allowed (react-markdown default).
export function Markdown({ children, className = "" }: { children?: string; className?: string }) {
  if (!children) return null;
  return (
    <div className={`space-y-5 text-lg leading-relaxed text-charcoal ${className}`}>
      <ReactMarkdown
        components={{
          h2: ({ children }) => <h2 className="pt-4 text-2xl font-extrabold text-charcoal-900">{children}</h2>,
          h3: ({ children }) => <h3 className="pt-2 text-xl font-bold text-charcoal-900">{children}</h3>,
          ul: ({ children }) => <ul className="list-disc space-y-2 pl-6 marker:text-teal-ink">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6 marker:text-teal-ink">{children}</ol>,
          strong: ({ children }) => <strong className="font-bold text-charcoal-900">{children}</strong>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-teal pl-5 italic">{children}</blockquote>,
          a: ({ href = "", children }) =>
            href.startsWith("/") ? (
              <Link href={href} className="font-semibold text-teal-ink underline underline-offset-2">{children}</Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-ink underline underline-offset-2">{children}</a>
            ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
