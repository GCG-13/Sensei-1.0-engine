import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Configuración para tests de Sensei AI
    globals: true,
    environment: 'node',
    
    // Coverage para demostrar calidad
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    // Timeout generoso para algoritmos complejos
    testTimeout: 10000,
    
    // Reporte detallado
    reporter: ['verbose', 'json'],
    
    // Watch mode para desarrollo
    watch: false
  },
  
  // Resolución de módulos para CommonJS
  resolve: {
    alias: {
      '@': './src'
    }
  }
});
