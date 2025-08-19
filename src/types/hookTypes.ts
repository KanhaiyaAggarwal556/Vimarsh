export interface UseInfiniteQueryResult<T> {
  data: T | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
  data: TData | undefined;
}

export interface UseViewTrackingResult {
  ref: React.RefObject<HTMLElement>;
  hasAttemptedTracking: boolean;
  isTracking: boolean;
}

export interface ViewTrackingOptions {
  enabled?: boolean;
  referralSource?: string;
  minViewDuration?: number;
  threshold?: number;
  rootMargin?: string;
}