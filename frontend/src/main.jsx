import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const temaGuardado = localStorage.getItem("theme");

if (temaGuardado === "light") {
  document.body.classList.add("theme-light");
} else {
  document.body.classList.remove("theme-light");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
