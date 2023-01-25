import esbuild from "esbuild";
import express from "express";
import config from "./esbuild";
import path from "path";
import { EventEmitter } from "events";

const PORT = Number(process.env.PORT) || 8080;

const app = express();
const emitter = new EventEmitter();

app.use(express.static(path.resolve(__dirname, "..", "build")));
app.get("/subscribe", (req, res) => {
    const headers = {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);
    res.write("");

    emitter.on("refresh", () => {
        res.write("data: message \n\n");
    });
});

function sendMessage() {
    emitter.emit("refresh", "123123");
}

app.listen(PORT, () => {
    console.clear();
    console.log(`local server - http://localhost:${PORT}`);
});

esbuild
    .build({
        ...config,
        watch: {
            onRebuild(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.clear();
                    console.log("rebuild...");
                    sendMessage();
                    setTimeout(() => {
                        console.clear();
                        console.log(`local server - http://localhost:${PORT}`);
                    }, 300);
                }
            },
        },
    })
    .catch(console.log);
