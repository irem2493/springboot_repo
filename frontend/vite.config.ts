import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/src/main/resources/static',  // 빌드된 파일 백엔드로 복사
    emptyOutDir: true
  }
});