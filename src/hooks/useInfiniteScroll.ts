import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Pixels from bottom to trigger load
  rootMargin?: string;
}

interface UseInfiniteScrollReturn {
  sentinelRef: React.RefObject<HTMLDivElement>;
  isLoadingMore: boolean;
}

export const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
  const { threshold = 100, rootMargin = '0px' } = options;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          callback();
          // Reset loading state after callback
          setTimeout(() => setIsLoadingMore(false), 500);
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [callback, hasMore, isLoadingMore, rootMargin]);

  return { sentinelRef, isLoadingMore };
};
