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
      key: fs.readFileSync(path.resolve(__dirname, "key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "cert.pem"))
    },
    host: "localhost",
    port: 3e3,
    proxy: {
      "/auth": {
        target: "https://localhost:3001",
        changeOrigin: true,
        secure: false
      },
      "/api": {
        target: "https://localhost:3001",
        changeOrigin: true,
        secure: false
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvTWlndWVsL3NvZnR3YXJlX2RldmVsb3BtZW50X2V2ZXJ5dGhpbmcvZG9jdW1lbnRjc3Mvc3BvdGlmeS12NVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL01pZ3VlbC9zb2Z0d2FyZV9kZXZlbG9wbWVudF9ldmVyeXRoaW5nL2RvY3VtZW50Y3NzL3Nwb3RpZnktdjUvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL01pZ3VlbC9zb2Z0d2FyZV9kZXZlbG9wbWVudF9ldmVyeXRoaW5nL2RvY3VtZW50Y3NzL3Nwb3RpZnktdjUvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XG5pbXBvcnQgcGF0aCwgeyBkaXJuYW1lIH0gZnJvbSAncGF0aCc7XG5cbi8vIEdldCB0aGUgX19maWxlbmFtZSBhbmQgX19kaXJuYW1lIHZhcmlhYmxlcyBpbiBhbiBFUyBtb2R1bGVcbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBkaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyBEZWZpbmUgVml0ZSBjb25maWd1cmF0aW9uXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIGh0dHBzOiB7XG4gICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAna2V5LnBlbScpKSxcbiAgICAgIGNlcnQ6IGZzLnJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnY2VydC5wZW0nKSksXG4gICAgfSxcbiAgICBob3N0OiBcImxvY2FsaG9zdFwiLFxuICAgIHBvcnQ6IDMwMDAsXG4gICAgcHJveHk6IHtcbiAgICAgICcvYXV0aCc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9sb2NhbGhvc3Q6MzAwMScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9sb2NhbGhvc3Q6MzAwMScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGFzc2V0c0luY2x1ZGU6IFtcbiAgICBcIioqLyoubXAzXCIsXG4gICAgXCIqKi8qLm1wNFwiLFxuICAgIFwiKiovKi5wbmdcIixcbiAgICBcIioqLyouanBnXCIsXG4gICAgXCIqKi8qLmpwZWdcIixcbiAgICBcIioqLyouZ2lmXCIsXG4gICAgXCIqKi8qLnN2Z1wiLFxuICAgIFwiKiovKi53ZWJwXCJcbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4WCxTQUFTLG9CQUFvQjtBQUMzWixPQUFPLFdBQVc7QUFDbEIsT0FBTyxRQUFRO0FBQ2YsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxRQUFRLGVBQWU7QUFKa04sSUFBTSwyQ0FBMkM7QUFPalMsSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLFFBQVEsVUFBVTtBQUdwQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsS0FBSyxHQUFHLGFBQWEsS0FBSyxRQUFRLFdBQVcsU0FBUyxDQUFDO0FBQUEsTUFDdkQsTUFBTSxHQUFHLGFBQWEsS0FBSyxRQUFRLFdBQVcsVUFBVSxDQUFDO0FBQUEsSUFDM0Q7QUFBQSxJQUNBLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFNBQVM7QUFBQSxRQUNQLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxlQUFlO0FBQUEsSUFDYjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
