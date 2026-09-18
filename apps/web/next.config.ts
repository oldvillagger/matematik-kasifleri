import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: [
    "@matematik-kasifleri/curriculum",
    "@matematik-kasifleri/content-schema",
    "@matematik-kasifleri/engine-core",
    "@matematik-kasifleri/manipulatives",
    "@matematik-kasifleri/progression",
  ],
  outputFileTracingRoot: join(here, "..", ".."),
  // Dev sunucu ile production derlemesi aynı klasörü paylaşırsa derleme
  // çalışan sunucunun chunk'larını eziyor ("Cannot find module './713.js'").
  // NEXT_DIST_DIR=.next-build ile derleyerek ikisini ayırabilirsin.
  distDir: process.env["NEXT_DIST_DIR"] ?? ".next",
};

export default nextConfig;
