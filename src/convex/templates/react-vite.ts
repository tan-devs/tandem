type FileNode = {
	type: 'file';
	contents: string;
};

type FolderNode = {
	type: 'folder';
	children: Record<string, TemplateNode>;
};

type TemplateNode = FileNode | FolderNode;

type Template = {
	files: Record<string, TemplateNode>;
	entry: string;
};

export const VITE_REACT_TEMPLATE: Template = {
	files: {
		'App.jsx': {
			type: 'file',
			contents: `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  let world = "world";

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "4rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Hello, {world}!</h1>
      <p style={{ fontSize: "4rem", fontWeight: "bold", margin: "1rem 0" }}>{count}</p>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
        <button onClick={() => setCount(count - 1)} style={{ fontSize: "1.5rem", padding: "0.25rem 1rem", cursor: "pointer" }}>−</button>
        <button onClick={() => setCount(count + 1)} style={{ fontSize: "1.5rem", padding: "0.25rem 1rem", cursor: "pointer" }}>+</button>
      </div>
    </div>
  );
}
`
		},

		'index.jsx': {
			type: 'file',
			contents: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`
		},

		'index.html': {
			type: 'file',
			contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.jsx"></script>
  </body>
</html>
`
		},

		'package.json': {
			type: 'file',
			contents: `{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "3.1.0",
    "vite": "4.1.4",
    "esbuild-wasm": "0.17.12"
  }
}
`
		},

		'vite.config.js': {
			type: 'file',
			contents: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false,
    },
  },
});
`
		},

		'jsconfig.json': {
			type: 'file',
			contents: `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "allowJs": true,
    "checkJs": false,
    "noEmit": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "*": ["./node_modules/*"]
    }
  },
  "exclude": ["node_modules"]
}
`
		}
	},
	entry: 'App.jsx'
};
