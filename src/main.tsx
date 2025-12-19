import { createRoot } from "react-dom/client";
import "@fontsource/noto-sans-thai/300.css";
import "@fontsource/noto-sans-thai/400.css";
import "@fontsource/noto-sans-thai/500.css";
import "@fontsource/noto-sans-thai/600.css";
import "@fontsource/noto-sans-thai/700.css";
import "@fontsource/sarabun"; // Optional fallback or specific weights if needed, but keeping simple for now

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
