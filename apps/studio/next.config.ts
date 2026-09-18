import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  transpilePackages: ["@matematik-kasifleri/curriculum"],
  outputFileTracingRoot: join(here, "..", ".."),
};

export default nextConfig;
