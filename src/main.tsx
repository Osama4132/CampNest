import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastProvider";
import router from "./routes";
import { UserProvider } from "./contexts/UserProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </UserProvider>
  </StrictMode>
);
