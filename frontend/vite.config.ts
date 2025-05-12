import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: {
            "@ui": path.resolve(__dirname, "../components/ui"),
        },
    },
});