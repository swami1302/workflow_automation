import { useEffect, useRef } from "react";
import { UseMutationResult } from "@tanstack/react-query";

interface MutationCallbacks<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export function useMutationEvents<TData, TError, TVariables>(
  mutation: UseMutationResult<TData, TError, TVariables>,
  callbacks: MutationCallbacks<TData, TError> = {}
): UseMutationResult<TData, TError, TVariables> {
  const onSuccessRef = useRef(callbacks.onSuccess);
  const onErrorRef = useRef(callbacks.onError);
  onSuccessRef.current = callbacks.onSuccess;
  onErrorRef.current = callbacks.onError;

  useEffect(() => {
    if (mutation.isSuccess && mutation.data) {
      onSuccessRef.current?.(mutation.data);
    }
  }, [mutation.isSuccess, mutation.data]);

  useEffect(() => {
    if (mutation.isError && mutation.error) {
      onErrorRef.current?.(mutation.error);
    }
  }, [mutation.isError, mutation.error]);

  return mutation;
}
