import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    projects: [
      {
        resolve: {
          alias: {
            "@": resolve(__dirname, "src"),
          },
        },
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.spec.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "components",
          environment: "happy-dom",
          include: ["src/**/*.spec.tsx"],
          setupFiles: ["./src/test-setup.ts"],
        },
      },
      {
        plugins: [storybookTest()],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: ["@storybook/addon-vitest/internal/setup-file"],
        },
      },
    ],
  },
});
