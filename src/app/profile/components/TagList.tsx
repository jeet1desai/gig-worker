'use client';

import { useState } from 'react';

interface Props {
  keywords: string[];
}

export default function TagList({ keywords = [] }: Props) {
  const maxVisible = 3;
  const visibleTags = keywords.slice(0, maxVisible);
  const hiddenTags = keywords.slice(maxVisible);
  const [showTooltip, setShowTooltip] = useState(false);

  const hasTags = keywords.length > 0;

  return (
    <div className="mb-4 flex min-h-[28px] items-center gap-2 whitespace-nowrap">
      {hasTags ? (
        <>
          {visibleTags.map((tag, i) => (
            <span key={i} className="rounded bg-slate-800 px-2 py-1 text-xs text-gray-300">
              #{tag}
            </span>
          ))}

          {hiddenTags.length > 0 && (
            <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
              <span className="cursor-pointer rounded bg-slate-700 px-2 py-1 text-xs text-gray-300">+{hiddenTags.length}</span>

              {showTooltip && (
                <div className="absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-xs -translate-x-1/2 rounded bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
                  {hiddenTags.map((tag, i) => (
                    <div key={i}>#{tag}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        // Invisible placeholder to maintain height
        <span className="invisible rounded px-2 py-1 text-xs">placeholder</span>
      )}
    </div>
  );
}
