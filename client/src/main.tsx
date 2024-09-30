import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./Router";
import UserState from "./context/UserContext/UserState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserState>
        <Router />
      </UserState>
    </QueryClientProvider>
  </StrictMode>
);
