import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
import fs from "node:fs";

// 本地 SVG 圖示目錄
const iconsDir = "./src/assets/icons";

// 讀取本地 SVG 目錄，自動生成 safelist
const generateSafeList = () => {
  try {
    return fs
      .readdirSync(iconsDir)
      .filter((file) => file.endsWith(".svg"))
      .map((file) => `i-svg:${file.replace(".svg", "")}`);
  } catch (error) {
    console.error("無法讀取圖示目錄:", error);
    return [];
  }
};

export default defineConfig({
  shortcuts: {
    "wh-full": "w-full h-full",
    "flex-center": "flex justify-center items-center",
    "flex-x-center": "flex justify-center",
    "flex-y-center": "flex items-center",
    "flex-x-start": "flex items-center justify-start",
    "flex-x-between": "flex items-center justify-between",
    "flex-x-end": "flex items-center justify-end",
  },
  theme: {
    colors: {
      primary: "var(--el-color-primary)",
      primary_dark: "var(--el-color-primary-light-5)",
    },
    breakpoints: Object.fromEntries(
      [640, 768, 1024, 1280, 1536, 1920, 2560].map((size, index) => [
        ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"][index],
        `${size}px`,
      ])
    ),
  },

  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        width: "1em",
        height: "1em",
      },
      collections: {
        svg: FileSystemIconLoader(iconsDir, (svg) => {
          return svg.includes('fill="') ? svg : svg.replace(/^<svg /, '<svg fill="currentColor" ');
        }),
      },
    }),
  ],
  safelist: generateSafeList(),
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
