import { Plugin } from "esbuild";
import { rm } from "fs/promises";

export const CleanPlug: Plugin = {
    name: "clean",
    setup(build) {
        build.onStart(async () => {
            try {
                const pathBuild = build.initialOptions.outdir;
                if (pathBuild) {
                    await rm(pathBuild, { recursive: true });
                }
            } catch {
                console.log("CleanPlug error");
            }
        });
    },
};
