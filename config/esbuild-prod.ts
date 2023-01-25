import esbuild from "esbuild";
import config from "./esbuild";

esbuild.build(config).catch(console.log);
