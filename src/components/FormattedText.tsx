import React from 'react';

interface FormattedTextProps {
  content: string;
  className?: string;
}

export default function FormattedText({ content, className = "" }: FormattedTextProps) {
  if (!content || content === 'N/A') {
    return <p className={`text-sm text-muted-foreground ${className}`}>N/A</p>;
  }

  // Split content into paragraphs and format them
  const formatText = (text: string) => {
    // Split by double line breaks to create paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
    
    // If no double line breaks, split by single line breaks
    if (paragraphs.length === 1) {
      const lines = text.split('\n').filter(line => line.trim());
      return lines.map((line, index) => (
        <p key={index} className="mb-3 leading-relaxed">
          {line.trim()}
        </p>
      ));
    }
    
    // Format paragraphs with proper spacing
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed">
        {paragraph.trim()}
      </p>
    ));
  };

  return (
    <div className={`text-sm text-muted-foreground ${className}`}>
      {formatText(content)}
    </div>
  );
}
