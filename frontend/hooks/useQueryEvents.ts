import { useEffect, useRef } from "react";
import { UseQueryResult } from "@tanstack/react-query";

interface Callbacks<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export function useQueryEvents<TData, TError>(
  query: UseQueryResult<TData, TError>,
  callbacks: Callbacks<TData, TError> = {},
): UseQueryResult<TData, TError> {
  const onSuccessRef = useRef(callbacks.onSuccess);
  const onErrorRef = useRef(callbacks.onError);
  onSuccessRef.current = callbacks.onSuccess;
  onErrorRef.current = callbacks.onError;

  useEffect(() => {
    if (query.data) {
      onSuccessRef.current?.(query.data);
    }
  }, [query.data]);

  useEffect(() => {
    if (query.error) {
      onErrorRef.current?.(query.error);
    }
  }, [query.error]);

  return query;
}
