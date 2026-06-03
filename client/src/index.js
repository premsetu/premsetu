import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "18px",
              border: "1px solid rgba(59, 74, 58, 0.12)",
              background: "rgba(255, 253, 249, 0.95)",
              color: "#2f392f",
              boxShadow: "0 18px 40px rgba(38, 49, 37, 0.14)"
            },
            success: {
              iconTheme: {
                primary: "#3b4a3a",
                secondary: "#f0ede6"
              }
            },
            error: {
              iconTheme: {
                primary: "#b88968",
                secondary: "#fffdf9"
              }
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
