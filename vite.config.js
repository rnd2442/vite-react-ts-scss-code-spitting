import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { extname, relative, resolve } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";
import libAssetsPlugin from "@laynezh/vite-plugin-lib-assets";

export default defineConfig({
  resolve: {
    // Aliases for SCSS and CSS
    alias: {
      $fonts: resolve("src/fonts"),
      // These styles are in public directory, so styles from this directory
      // can be used int the library and in the consuming app
      $shared: resolve("public/scss"),
    },
  },
  plugins: [
    react(),
    // Generate d.ts for lib
    dts({
      include: ["src"],
    }),
    // Paths from tsconfig.json
    tsconfigPaths(),
    // Add imports for css in generated js files
    // This the essence of the CSS code splitting
    libInjectCss(),
    // Extracts assets to specific directory. Without this plugin
    // Vite injects assets such fonts into CSS as base64
    libAssetsPlugin({
      include: /\.(eot|woff2?|ttf)(\?.*)?(#.*)?$/,
      name: "fonts/[name].[ext]",
    }),
    libAssetsPlugin({
      include: /\.(svg)(\?.*)?(#.*)?$/,
      name: "svg/[name].[ext]",
    }),
    libAssetsPlugin({
      include: /\.(png|jpeg|jpg|gif|webp)(\?.*)?(#.*)?$/,
      name: "images/[name].[ext]",
    }),
  ],
  build: {
    // Copy everything from public directory to dist
    // This is why our mixins from /public/scss are available
    // in the consuming app
    copyPublicDir: true,
    // We don't need minification for library in order to debug it
    minify: false,
    // This switches Vite ot the Vite Library mode
    lib: {
      // Lib entry point
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      input: Object.fromEntries(
        glob
          .sync(["src/**/*.{ts,tsx}"], {
            ignore: ["src/**/*.d.ts", "src/**/*.d"],
          })
          .map((file) => {
            return [
              // The name of the entry point
              // lib/nested/foo.ts becomes nested/foo
              relative(
                "src",
                file.slice(0, file.length - extname(file).length)
              ),
              // The absolute path to the entry file
              // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
              fileURLToPath(new URL(file, import.meta.url)),
            ];
          })
      ),
      output: {
        // This is path for CSS assets
        assetFileNames: "assets/css/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
});
