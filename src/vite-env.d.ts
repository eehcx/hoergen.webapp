/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL_V1: string
  readonly VITE_API_URL_V2: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'vite-plugin-obfuscator' {
    import { Plugin } from 'vite';
    interface ObfuscatorOptions {
        [key: string]: any;
    }
    export default function obfuscator(options?: ObfuscatorOptions): Plugin;
}