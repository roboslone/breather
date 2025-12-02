import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Selector } from "./components/selector";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Selector />
  </StrictMode>
);
