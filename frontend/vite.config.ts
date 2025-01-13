import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ 상대 경로 설정
  build: {
    outDir: '../backend/src/main/resources/static', // ✅ 백엔드 static 폴더에 직접 빌드 결과 저장
    emptyOutDir: true
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ 별칭을 정확히 설정
    }
  },
  server: {
    watch: {
      usePolling: true,   // 변경 감지 강화를 위한 폴링 사용
    },
    hmr: {
      overlay: true,       // 브라우저에 오류 메시지 표시
    },
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});