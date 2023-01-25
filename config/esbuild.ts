import { BuildOptions } from "esbuild";
import { CleanPlug } from "./plugins/clean";
import { HTMLPlug } from "./plugins/html";
import eslint from "esbuild-plugin-eslint";
import linaria from "@linaria/esbuild";
import path from "path";

const mode = process.env.MODE || "DEV";
const DEV = mode === "DEV";
const PROD = mode === "PROD";

function resolve(...dirs: string[]): string {
    return path.resolve(__dirname, "..", ...dirs);
}

const config: BuildOptions = {
    outdir: resolve("build"),
    entryPoints: [resolve("src", "index.tsx")],
    tsconfig: resolve("tsconfig.json"),
    entryNames: "[dir]/bundle.[name]-[hash]",
    allowOverwrite: true,
    bundle: true,
    minify: PROD,
    sourcemap: DEV,
    metafile: true,
    plugins: [
        CleanPlug,
        eslint(),
        linaria(),
        HTMLPlug({
            title: "Single-page application",
        }),
    ],
    loader: {
        ".png": "file",
        ".svg": "file",
        ".jpg": "file",
        ".jpeg": "file",
        ".webp": "file",
    },
};

export default config;
