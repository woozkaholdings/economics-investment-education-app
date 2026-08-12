import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // See DECISIONS.md ("LessonReader chunk size warning threshold") for why
    // this is raised instead of split. Re-check the actual gzip size against
    // that decision's stated bound whenever this limit needs raising again.
    chunkSizeWarningLimit: 600,
  },
});
