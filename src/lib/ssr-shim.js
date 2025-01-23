// Top-level DOM access protection
if (typeof window === "undefined") {
  global.window = {};
  global.document = {};
}

// CSS injection safety
if (typeof document !== "undefined" && document.createElement) {
  const style = document.createElement("style");
  style.setAttribute("data-ssr-css", "");
  document.head.appendChild(style);
}
