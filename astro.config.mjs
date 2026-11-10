// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      port: 4321,
      host: true,
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      },
    },
    ssr: {
      noExternal: ["@mailgun-js/mailgun-js", "mailgun.js"],
      
    },
  },

  adapter: node({
    mode: "standalone",
  }),

  
});