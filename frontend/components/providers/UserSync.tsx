"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useAuthHttp } from "@/app/auth/action/http";
import { ME_QUERY_KEY } from "@/lib/constants/queryKeys";

// Keeps AuthContext's user object fresh against the server. The
// login/signup response only reflects state at that moment (e.g.
// isEmailVerified can flip in another tab after the user verifies) —
// this refetches /users/me once authenticated and syncs it in.
export function UserSync() {
  const { isAuthenticated, updateUser } = useAuth();
  const { me } = useAuthHttp();

  const { data } = useQuery({
    queryKey: [ME_QUERY_KEY],
    queryFn: me,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data) updateUser(data);
  }, [data, updateUser]);

  return null;
}
