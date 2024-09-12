// vite.config.js
import { defineConfig } from "file:///Users/Miguel/software_development_everything/documentcss/spotify-v5/node_modules/vite/dist/node/index.js";
import react from "file:///Users/Miguel/software_development_everything/documentcss/spotify-v5/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
var __vite_injected_original_import_meta_url = "file:///Users/Miguel/software_development_everything/documentcss/spotify-v5/vite.config.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "ssl/key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "ssl/cert.pem"))
    },
    host: "localhost",
    port: 3e3,
    proxy: {
      "/api": {
        target: "https://localhost:3001",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            proxyReq.setHeader("Origin", "https://localhost:3000");
          });
        }
      }
    }
  },
  assetsInclude: [
    "**/*.mp3",
    "**/*.mp4",
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.gif",
    "**/*.svg",
    "**/*.webp"
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvTWlndWVsL3NvZnR3YXJlX2RldmVsb3BtZW50X2V2ZXJ5dGhpbmcvZG9jdW1lbnRjc3Mvc3BvdGlmeS12NVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL01pZ3VlbC9zb2Z0d2FyZV9kZXZlbG9wbWVudF9ldmVyeXRoaW5nL2RvY3VtZW50Y3NzL3Nwb3RpZnktdjUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL01pZ3VlbC9zb2Z0d2FyZV9kZXZlbG9wbWVudF9ldmVyeXRoaW5nL2RvY3VtZW50Y3NzL3Nwb3RpZnktdjUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgcGF0aCwgeyBkaXJuYW1lIH0gZnJvbSAncGF0aCc7XG5cbi8vIEdldCB0aGUgX19maWxlbmFtZSBhbmQgX19kaXJuYW1lIHZhcmlhYmxlcyBpbiBhbiBFUyBtb2R1bGVcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBkaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyBEZWZpbmUgVml0ZSBjb25maWd1cmF0aW9uXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIGh0dHBzOiB7XG4gICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3NsL2tleS5wZW0nKSksXG4gICAgICBjZXJ0OiBmcy5yZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NzbC9jZXJ0LnBlbScpKSxcbiAgICB9LFxuICAgIGhvc3Q6ICdsb2NhbGhvc3QnLFxuICAgIHBvcnQ6IDMwMDAsXG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL2xvY2FsaG9zdDozMDAxJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmU6IChwcm94eSwgb3B0aW9ucykgPT4ge1xuICAgICAgICAgIHByb3h5Lm9uKCdwcm94eVJlcScsIChwcm94eVJlcSwgcmVxLCByZXMpID0+IHtcbiAgICAgICAgICAgIHByb3h5UmVxLnNldEhlYWRlcignT3JpZ2luJywgJ2h0dHBzOi8vbG9jYWxob3N0OjMwMDAnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxuICBhc3NldHNJbmNsdWRlOiBbXG4gICAgXCIqKi8qLm1wM1wiLFxuICAgIFwiKiovKi5tcDRcIixcbiAgICBcIioqLyoucG5nXCIsXG4gICAgXCIqKi8qLmpwZ1wiLFxuICAgIFwiKiovKi5qcGVnXCIsXG4gICAgXCIqKi8qLmdpZlwiLFxuICAgIFwiKiovKi5zdmdcIixcbiAgICBcIioqLyoud2VicFwiXG4gIF0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFgsU0FBUyxvQkFBb0I7QUFDM1osT0FBTyxXQUFXO0FBQ2xCLE9BQU8sUUFBUTtBQUNmLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sUUFBUSxlQUFlO0FBSmtOLElBQU0sMkNBQTJDO0FBT2pTLElBQU0sYUFBYSxjQUFjLHdDQUFlO0FBQ2hELElBQU0sWUFBWSxRQUFRLFVBQVU7QUFHcEMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLEtBQUssR0FBRyxhQUFhLEtBQUssUUFBUSxXQUFXLGFBQWEsQ0FBQztBQUFBLE1BQzNELE1BQU0sR0FBRyxhQUFhLEtBQUssUUFBUSxXQUFXLGNBQWMsQ0FBQztBQUFBLElBQy9EO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsUUFDUixXQUFXLENBQUMsT0FBTyxZQUFZO0FBQzdCLGdCQUFNLEdBQUcsWUFBWSxDQUFDLFVBQVUsS0FBSyxRQUFRO0FBQzNDLHFCQUFTLFVBQVUsVUFBVSx3QkFBd0I7QUFBQSxVQUN2RCxDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsZUFBZTtBQUFBLElBQ2I7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
