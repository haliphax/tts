import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		emptyOutDir: true,
		outDir: resolve(__dirname, "..", "html"),
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				oauth: resolve(__dirname, "oauth", "index.html"),
			},
		},
		target: "esnext",
	},
});
