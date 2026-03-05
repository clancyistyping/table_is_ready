import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 1. Move the schema creation logic here so it runs in parallel per worker
    setupFiles: [
      './test/setup/setup.ts',    // Now runs in parallel per worker
      './test/setup/clear-db.ts'  // Cleans tables after schema is ready
    ],
    fileParallelism: false,
    // Ensure files are not ran sequentially
  },
});