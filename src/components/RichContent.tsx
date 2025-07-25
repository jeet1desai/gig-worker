'use client';
import { useEffect, useState } from 'react';

export default function RichContent({ content, title }: { content: string; title: string }) {
  const [decoded, setDecoded] = useState('');

  useEffect(() => {
    const decodeHTMLEntities = (escapedStr: string): string => {
      const txt = document.createElement('textarea');
      txt.innerHTML = escapedStr;
      return txt.value;
    };

    setDecoded(decodeHTMLEntities(content));
  }, [content]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: decoded }} />
    </div>
  );
}
