import { Plugin } from "esbuild";
import { writeFile } from "fs/promises";
import path from "path";

interface HTMLPlugOptions {
    title?: string;
    ccsPath?: string[];
    jsPath?: string[];
}

const PORT = Number(process.env.PORT) || 8080;

const preparePaths = (outputs: string[]) => {
    return outputs.reduce<string[][]>(
        (a, e) => {
            const [cssPath, jsPath] = a;
            const file = e.split("/").pop();
            if (file?.endsWith(".js")) jsPath.push(file);
            if (file?.endsWith(".css")) cssPath.push(file);
            return a;
        },
        [[], []]
    );
};

const HTMLRender = (options: HTMLPlugOptions) => {
    return `<!doctype html>
<html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      ${options?.ccsPath
          ?.map((path) => `<link rel="stylesheet" href=${path} >`)
          .join("\n")}
      <title>${options.title}</title>
    </head>
    <body>
      <div id="root"></div>
      ${options?.jsPath
          ?.map((path) => `<script src=${path}></script>`)
          .join("\n")}
      <script>
        const eventSrc = new EventSource("http://localhost:${PORT}/subscribe");
        eventSrc.onopen = function () { console.log('open') }
        eventSrc.onerror = function () { console.log('error') }
        eventSrc.onmessage = function () { 
          console.log('message');
          window.location.reload();
        }
      </script>
    </body>
</html>
`;
};

export const HTMLPlug = (options: HTMLPlugOptions): Plugin => {
    return {
        name: "html",
        setup(build) {
            const pathBuild = build.initialOptions.outdir;
            build.onStart(async () => {});
            build.onEnd(async (result) => {
                const outputs = result.metafile?.outputs;
                const filePaths = preparePaths(Object.keys(outputs || {}));
                if (pathBuild) {
                    await writeFile(
                        path.resolve(pathBuild, "index.html"),
                        HTMLRender({
                            ccsPath: filePaths[0],
                            jsPath: filePaths[1],
                            ...options,
                        })
                    );
                }
            });
        },
    };
};
