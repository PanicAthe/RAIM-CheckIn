import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 코드 분할로 초기 로딩 시간 단축 (갤럭시탭A9 최적화)
    rollupOptions: {
      output: {
        manualChunks: {
          'face-api': ['face-api.js'],
          'firebase': ['firebase/app', 'firebase/firestore']
        }
      }
    },
    // esbuild (기본값) 사용: terser보다 20-40배 빠름
    minify: 'esbuild',
    // 빌드 최적화
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false
  },
  optimizeDeps: {
    // 사전 번들링으로 초기 로딩 속도 향상
    include: ['face-api.js', 'firebase/app', 'firebase/firestore', 'react', 'react-dom'],
    exclude: []
  },
  esbuild: {
    // esbuild 최적화 옵션
    drop: ['console', 'debugger'], // console.log 제거
    legalComments: 'none'
  }
})
