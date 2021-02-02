import React from "react";

import { AuthProvider, useAuth } from "./hooks/auth/index";
import { FirestoreProvider } from "./hooks/firestore/context";
import { useDocument } from "./hooks/firestore/document";
import { useCollection } from "./hooks/firestore/collection";

export function FirebaseProvider({ children }) {
  return (
    <AuthProvider>
      <FirestoreProvider>{children}</FirestoreProvider>
    </AuthProvider>
  );
}

export { useAuth, useDocument, useCollection };
