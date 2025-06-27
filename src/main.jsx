import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* AuthProvider wraps the App to provide authentication context */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
