
"use client";

import { createContext, useContext } from "react";
import type { CurrentUser } from "@/app/(dashboard)/layout";

const CurrentUserContext = createContext<CurrentUser | null>(null);

export function CurrentUserProvider({
  currentUser,
  children,
}: {
  currentUser: CurrentUser;
  children: React.ReactNode;
}) {
  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const currentUser = useContext(CurrentUserContext);

  if (!currentUser) {
    throw new Error(
      "useCurrentUser must be used within CurrentUserProvider"
    );
  }

  return currentUser;
}
