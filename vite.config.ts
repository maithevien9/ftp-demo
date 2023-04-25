import react from '@vitejs/plugin-react-swc';
import { loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import reactRefresh from '@vitejs/plugin-react-refresh';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import fs from 'vite-plugin-fs';

function htmlPlugin(env: Record<string, string | undefined>) {
  return {
    name: 'html-transform',
    transformIndexHtml: {
      enforce: 'pre',
      transform: (html: string) => {
        return html.replace(/<%=(.*?)%>/g, (match, p1) => env[p1] ?? match);
      },
    },
  };
}

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    build: {
      outDir: 'build',
      sourcemap: true,
      rollupOptions: {
        external: ['fs/promises', 'fs'],
      },
    },
    optimizeDeps: {
      include: [],
    },
    plugins: [svgr(), react(), htmlPlugin(env), tsconfigPaths(), reactRefresh(), fs()],
    resolve: {
      alias: {
        fs: nodeBuiltins(),
      },
      fallback: {
        fs: 'empty',
      },
    },
    test: {
      testTimeout: 15000,
      globals: true,
      environment: 'jsdom',
      deps: {
        inline: ['vitest-canvas-mock'],
      },
      coverage: {
        reporter: ['text', 'html'],
        exclude: ['node_modules/', 'src/setupTests.ts'],
      },
      include: ['**/*.{test,spec}.{ts,tsx}'],
    },
  };
};
