import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: false,
    setupNodeEvents(on, config) {
    }
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite"
    }
  },

  defaultCommandTimeout: 4000,
  pageLoadTimeout: 60000,

  video: false,
  screenshotOnRunFailure: true,

  viewportWidth: 1280,
  viewportHeight: 720
});