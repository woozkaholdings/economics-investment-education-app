import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { AppError } from "./components/ui.jsx";
import { TR } from "./locales/index.js";
import { loadLang } from "./lib/useAppState.js";

// The outermost boundary (backlog item 99). `ScreenBoundary` inside App covers
// the screen area, which is where a crash almost always originates — but it is
// rendered BY App, so it cannot catch App's own render: a throw in the header,
// the bottom nav, the first-run modal, or any hook in `useAppState` unmounts
// the tree above it and leaves the blank page this exists to end.
//
// Its copy has to come from `localStorage` rather than from App's state, since
// App may never have rendered. `loadLang` is the same reader the hook uses, so
// a crash on first paint is still answered in the reader's own language.
const rootT = TR[loadLang()];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<AppError t={rootT} style={{ margin: "24px" }} />}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
