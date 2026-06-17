"use client";

import { useCallback, useEffect, useState } from "react";

export type RouteDataStatus = "loading" | "ready" | "error" | "empty";

interface UseRouteDataStateOptions<T> {
  fetcher: () => Promise<T> | T;
  isEmpty?: (data: T) => boolean;
  minLoadingMs?: number;
}

export function useRouteDataState<T>({
  fetcher,
  isEmpty,
  minLoadingMs = 0,
}: UseRouteDataStateOptions<T>) {
  const [status, setStatus] = useState<RouteDataStatus>("loading");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    const started = Date.now();

    try {
      const result = await fetcher();
      const elapsed = Date.now() - started;
      if (minLoadingMs > elapsed) {
        await new Promise((resolve) => setTimeout(resolve, minLoadingMs - elapsed));
      }
      setData(result);
      if (isEmpty?.(result)) {
        setStatus("empty");
      } else {
        setStatus("ready");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setStatus("error");
    }
  }, [fetcher, isEmpty, minLoadingMs]);

  useEffect(() => {
    void load();
  }, [load]);

  return { status, data, error, reload: load };
}
