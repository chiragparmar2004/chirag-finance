import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Toaster />
      {/* <QueryClientProvider client={queryClient}> */}
      <App />
      {/* </QueryClientProvider> */}
    </AuthContextProvider>
  </React.StrictMode>
);
